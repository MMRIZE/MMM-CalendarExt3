/* global Log, Module, config */
/* x-eslint-disable @stylistic/linebreak-style, @stylistic/semi, @stylistic/indent */
/* eslint-disable no-unused-vars */


const popoverSupported = HTMLElement.prototype.hasOwnProperty("popover")
/*
Even though `.prototype.hasOwnProperty` is not recommended, it's the only way to check the existence of `popover` feature at this moment.
console.log(Object.prototype.hasOwnProperty.call(HTMLElement, "popover")) // false
console.log(Object.hasOwn(HTMLElement, "popover")) // false
console.log(HTMLElement.prototype.showPopover === 'function') // false
consoe.log(HTMLElement.prototype.hasOwnProperty("popover")) // true
*/

if (!popoverSupported) console.info("This browser doesn't support popover yet. Update your system.")
const animationSupported = (typeof window !== "undefined" && window?.mmVersion) ? +(window.mmVersion.split(".").join("")) >= 2250 : false

Module.register("MMM-CalendarExt3", {
  defaults: {
    mode: "week", // or 'month', 'day'
    weekIndex: -1, // Which week from this week starts in a view. Ignored on mode 'month'
    dayIndex: -1,
    weeksInView: 3, //  How many weeks will be displayed. Ignored on mode 'month'
    instanceId: null,
    firstDayOfWeek: null, // 0: Sunday, 1: Monday
    minimalDaysOfNewYear: null, // When the first week of new year starts in your country.
    weekends: [], // or [0, 6]. 0: Sunday, 6: Saturday
    locale: null, // 'de' or 'en-US' or prefer array like ['en-CA', 'en-US', 'en']
    cellDateOptions: {
      month: "short",
      day: "numeric"
    },
    eventTimeOptions: {
      timeStyle: "short"
    },
    headerWeekDayOptions: {
      weekday: "long"
    },
    headerTitleOptions: {
      month: "long"
    },
    calendarSet: [],
    maxEventLines: 5, // How many events will be shown in a day cell.
    // It could be possible to use {} like {"4": 6, "5": 5, "6": 4} to set different lines by the number of the week of the month.
    // Also, it could be possible to use [] like [8, 8, 7, 6, 5] to set different lines by the number of week of the month.
    fontSize: "18px",
    eventHeight: "22px",
    eventFilter: (ev) => { return true },
    eventSorter: null,
    eventTransformer: (ev) => { return ev },
    refreshInterval: 1000 * 60 * 10, // too frequent refresh. 10 minutes is enough.
    waitFetch: 1000 * 5,
    glanceTime: 1000 * 60, // deprecated, use refreshInterval instead.
    animationSpeed: 2000,
    useSymbol: true,
    displayLegend: false,
    useWeather: true,
    weatherLocationName: null,
    //notification: 'CALENDAR_EVENTS', /* reserved */
    manipulateDateCell: (cellDom, events) => { },
    weatherNotification: "WEATHER_UPDATED",
    weatherPayload: (payload) => { return payload },
    eventNotification: "CALENDAR_EVENTS",
    eventPayload: (payload) => { return payload },
    displayEndTime: false,
    displayWeatherTemp: false,
    popoverTemplate: "./popover.html",
    popoverTimeout: 1000 * 30,
    popoverPeriodOptions: {
      dateStyle: "short",
      timeStyle: "short"
    },
    popoverDateOptions: {
      dateStyle: "full"
    },
    displayCW: true,
    animateIn: "fadeIn",
    animateOut: "fadeOut",
    skipPassedEventToday: false,
    showMore: true,
    useIconify: true,
    useMarquee: false,

    skipDuplicated: true,
    monthIndex: 0,
    referenceDate: null,

    customHeader: false // true or function
  },

  defaulNotifications: {
    weatherNotification: "WEATHER_UPDATED",
    weatherPayload: (payload) => { return payload },
    eventNotification: "CALENDAR_EVENTS",
    eventPayload: (payload) => { return payload }
  },

  getStyles () {
    let css = ["MMM-CalendarExt3.css"]
    return css
  },

  getMoment (options) {
    let moment = (options.referenceDate) ? new Date(options.referenceDate) : new Date(Date.now())
    //let moment = (this.tempMoment) ? new Date(this.tempMoment.valueOf()) : new Date()
    switch (options.mode) {
      case "day":
        moment = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + options.dayIndex)
        break
      case "month":
        moment = new Date(moment.getFullYear(), moment.getMonth() + options.monthIndex, 1)
        break
      case "week":
      default:
        moment = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + (7 * options.weekIndex))
    }
    return moment
  },

  regularizeConfig (options) {
    const weekInfoFallback = {
      firstDay: 1,
      minimalDays: 4,
      weekend: [0, 6]
    }

    options.locale = Intl.getCanonicalLocales(options.locale ?? config?.locale ?? config?.language)?.[0] ?? ""
    const calInfo = new Intl.Locale(options.locale)
    if (calInfo?.weekInfo) {
      options.firstDayOfWeek = (options.firstDayOfWeek !== null) ? options.firstDayOfWeek : (calInfo.weekInfo?.firstDay ?? weekInfoFallback.firstDay)
      options.minimalDaysOfNewYear = (options.minimalDaysOfNewYear !== null) ? options.minimalDaysOfNewYear : (calInfo.weekInfo?.minimalDays ?? weekInfoFallback.minDays)
      options.weekends = ((Array.isArray(options.weekends) && options.weekends?.length) ? options.weekends : (calInfo.weekInfo?.weekend ?? [])).map((d) => d % 7)
    }

    options.instanceId = options.instanceId ?? this.identifier
    this.notifications = {
      weatherNotification: options.weatherNotification ?? this.defaulNotifications.weatherNotification,
      weatherPayload: (typeof options.weatherPayload === "function") ? options.weatherPayload : this.defaulNotifications.weatherPayload,
      eventNotification: options.eventNotification ?? this.defaulNotifications.eventNotification,
      eventPayload: (typeof options.eventPayload === "function") ? options.eventPayload : this.defaulNotifications.eventPayload
    }

    options.mode = (["day", "month", "week"].includes(options.mode)) ? options.mode : "week"
    options.weekIndex = (options.mode === "month") ? 0 : options.weekIndex
    options.weeksInView = (options.mode === "month") ? 6 : options.weeksInView
    options.dayIndex = (options.mode === "day") ? options.dayIndex : 0

    return options
  },

  start () {
    this.activeConfig = this.regularizeConfig({ ...this.config })
    this.originalConfig = { ...this.activeConfig }

    this.fetchTimer = null
    this.refreshTimer = null
    this.forecast = []
    this.eventPool = new Map()
    this.popoverTimer = null

    this._ready = false

    let _moduleLoaded = new Promise((resolve, reject) => {
      import(`/${this.file("CX3_Shared/CX3_shared.mjs")}`).then((m) => {
        this.library = m
        if (this.config.useIconify) this.library.prepareIconify()
        resolve()
      }).catch((err) => {
        console.error(err)
        reject(err)
      })
    })

    let _domCreated = new Promise((resolve, reject) => {
      this._domReady = resolve
    })

    Promise.allSettled([_moduleLoaded, _domCreated]).then((result) => {
      this._ready = true
      this.library.prepareMagic()
      setTimeout(() => {
        this.updateAnimate()
      }, this.activeConfig.waitFetch)
    })
    if (popoverSupported) {
      this.preparePopover()
    }
  },

  preparePopover () {
    if (!popoverSupported) return
    if (document.getElementById("CX3_POPOVER")) return

    fetch(this.file(this.config.popoverTemplate)).then((response) => {
      return response.text()
    }).then((text) => {
      const template = new DOMParser().parseFromString(text, "text/html").querySelector("#CX3_T_POPOVER").content.querySelector(".popover")
      const popover = document.importNode(template, true)
      popover.id = "CX3_POPOVER"
      document.body.append(popover)
      popover.ontoggle = (ev) => {
        if (this.popoverTimer) {
          clearTimeout(this.popoverTimer)
          this.popoverTimer = null
        }
        if (ev.newState === "open") {
          this.popoverTimer = setTimeout(() => {
            try {
              popover.hidePopover()
              popover.querySelector(".container").innerHTML = ""
            } catch (e) {
              // do nothing
            }
          }, this.activeConfig.popoverTimeout)
        } else { // closed
          popover.querySelector(".container").innerHTML = ""
        }
      }
    }).catch((err) => {
      console.error("[CX3]", err)
    })
  },

  dayPopover(cDom, events, options) {
    const popover = document.getElementById("CX3_POPOVER")
    if (!popover) return
    const container = popover.querySelector(".container")
    container.innerHTML = ""
    const ht = popover.querySelector("template#CX3_T_EVENTLIST").content.cloneNode(true)
    container.append(document.importNode(ht, true))
    let header = container.querySelector(".header")
    header.innerHTML = new Intl.DateTimeFormat(options.locale, { dateStyle: "full" }).formatToParts(new Date(+cDom.dataset.date))
    .reduce((prev, cur, curIndex, arr) => {
      const result = `${prev}<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
      return result
    }, "")

    let list = container.querySelector(".list")
    list.innerHTML = ""
    const { renderSymbol } = this.library
    events.forEach((e) => {
      const pOption = (e.fullDayEvent) ? { dateStyle: "short" } : { dateStyle: "short", timeStyle: "short" }

      const item = popover.querySelector("template#CX3_T_EVENTITEM").content.firstElementChild.cloneNode(true)
      item.style.setProperty("--calendarColor", e.color)
      item.classList.add("event")
      const symbol = item.querySelector(".symbol")
      renderSymbol(symbol, e, config)
      const time = item.querySelector(".time")
      time.innerHTML = new Intl.DateTimeFormat(options.locale, pOption).formatRangeToParts(new Date(+e.startDate), new Date(+e.endDate))
      .reduce((prev, cur, curIndex, arr) => {
        const result = `${prev}<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
        return result
      }, "")
      const title = item.querySelector(".title")
      title.innerHTML = e.title
      list.append(item)
    })

    this.activatePopover(popover)
  },

  eventPopover(eDom, options) {
    const popover = document.getElementById("CX3_POPOVER")
    if (!popover) return
    const container = popover.querySelector(".container")
    container.innerHTML = ""
    const ht = popover.querySelector("template#CX3_T_EVENTDETAIL").content.cloneNode(true)
    container.append(document.importNode(ht, true))
    let eSymbol = eDom.querySelector(".symbol").cloneNode(true)
    container.querySelector(".symbol").append(eSymbol)
    let eTitle = eDom.querySelector(".title").cloneNode(true)
    container.querySelector(".title").append(eTitle)
    let header = container.querySelector(".header")
    header.style.setProperty("--calendarColor", eDom.style.getPropertyValue("--calendarColor"))
    header.style.setProperty("--oppositeColor", eDom.style.getPropertyValue("--oppositeColor"))
    header.dataset.isFullday = eDom.dataset.fullDayEvent

    let criteria = container.querySelector(".criteria")
    criteria.innerHTML = ""
    const ps = ["location", "description", "calendar"]
    ps.forEach((c) => {
      if (eDom.dataset[c]) {
        const ct = popover.querySelector("template#CX3_T_CRITERIA").content.firstElementChild.cloneNode(true)
        //ct.querySelector('.name').innerHTML = c
        //ct.querySelector('.name').classList.add(c)
        ct.classList.add(c)
        ct.querySelector(".value").innerHTML = eDom.dataset[c]
        criteria.append(document.importNode(ct, true))
      }
    })

    let start = new Date(+(eDom.dataset.startDate))
    let end = new Date(+(eDom.dataset.endDate))
    const ct = popover.querySelector("template#CX3_T_CRITERIA").content.firstElementChild.cloneNode(true)
    criteria.append(document.importNode(ct, true))
    const n = Array.from(criteria.childNodes).at(-1)
    n.classList.add("period")
    const pOption = (eDom.dataset.fullDayEvent === "true") ? { dateStyle: "short" } : { dateStyle: "short", timeStyle: "short" }
    n.querySelector(".value").innerHTML = new Intl.DateTimeFormat(options.locale, pOption).formatRangeToParts(start, end)
    .reduce((prev, cur, curIndex, arr) => {
      const result = `${prev}<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
      return result
    }, "")
    this.activatePopover(popover)
  },

  activatePopover (popover) {
    let opened = document.querySelectorAll("[popover-opened]")
    for (const o of Array.from(opened)) {
      o.hidePopover()
    }
    popover.showPopover()
  },

  notificationReceived (notification, payload, sender) {
    const replyCurrentConfig = ({ callback }) => {
      if (typeof callback === "function") {
        callback({ ...this.activeConfig })
      }
    }

    if (notification === this.notifications.eventNotification) {
      let convertedPayload = this.notifications.eventPayload(payload)
      this.eventPool.set(sender.identifier, JSON.parse(JSON.stringify(convertedPayload)))
    }

    if (notification === "MODULE_DOM_CREATED") {
      this._domReady()
      const moduleContainer = document.querySelector(`#${this.identifier} .module-content`)
      const callback = (mutationsList, observer) => {
        for (let mutation of mutationsList) {
          const content = document.querySelector(`#${this.identifier} .module-content .CX3`)
          if (mutation.addedNodes.length > 0) this.updated(content, this.activeConfig)
        }
      }
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver
      const observer = new MutationObserver(callback)
      observer.observe(moduleContainer, { childList: true })
    }

    if (notification === this.notifications.weatherNotification) {
      let convertedPayload = this.notifications.weatherPayload(payload)
      if (
        (this.activeConfig.useWeather
        && ((this.activeConfig.weatherLocationName && convertedPayload.locationName.includes(this.activeConfig.weatherLocationName))
        || !this.activeConfig.weatherLocationName))
        && (Array.isArray(convertedPayload?.forecastArray) && convertedPayload?.forecastArray.length)
      ) {
        this.forecast = [...convertedPayload.forecastArray].map((o) => {
          let d = new Date(o.date)
          o.dateId = d.toLocaleDateString("en-CA")
          return o
        })
      } else {
        if (this.activeConfig.weatherLocationName && !convertedPayload.locationName.includes(this.activeConfig.weatherLocationName)) {
          Log.warn(`"weatherLocationName: '${this.activeConfig.weatherLocationName}'" doesn't match with location of weather module ('${convertedPayload.locationName}')`)
        }
      }
    }

    if (["CX3_GLANCE_CALENDAR", "CX3_MOVE_CALENDAR", "CX3_SET_DATE"].includes(notification)) {
      console.warn("[DEPRECATED]'CX3_GLANCE_CALENDAR' notification was deprecated. Use 'CX3_SET_CONFIG' instead. (README.md)")
    }
    if (payload?.instanceId && payload?.instanceId !== this.activeConfig?.instanceId) return

    if (notification === "CX3_GET_CONFIG") {
      replyCurrentConfig(payload)
    }

    if (notification === "CX3_SET_CONFIG") {
      this.activeConfig = this.regularizeConfig({ ...this.activeConfig, ...payload })
      this.updateAnimate()
      replyCurrentConfig(payload)
    }

    if (notification === "CX3_RESET") {
      this.activeConfig = this.regularizeConfig({ ...this.originalConfig })
      this.updateAnimate()
      replyCurrentConfig(payload)
    }
  },

  getDom () {
    let dom = document.createElement("div")
    dom.innerHTML = ""
    dom.classList.add("bodice", `CX3_${this.activeConfig.instanceId}`, "CX3")
    if (this.activeConfig.fontSize) dom.style.setProperty("--fontsize", this.activeConfig.fontSize)
    if (!this.library?.loaded) {
      Log.warn("[CX3] Module is not prepared yet, wait a while.")
      return dom
    }
    dom = this.draw(dom, this.activeConfig)

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
    this.refreshTimer = setTimeout(() => {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
      this.updateAnimate()
    }, this.activeConfig.refreshInterval)
    this.sendNotification("CX3_DOM_UPDATED", { instanceId: this.activeConfig.instanceId })
    return dom
  },


  updated (dom, options) {
    if (!dom) return
    dom.querySelectorAll(".title")?.forEach((e) => {
      const parent = e.closest(".event")
      const { offsetWidth, scrollWidth } = e
      if (options.useMarquee && parent?.dataset?.noMarquee !== "true" && offsetWidth < scrollWidth) {
        const m = document.createElement("span")
        m.innerHTML = e.innerHTML
        e.innerHTML = ""
        e.append(m)
        e.classList.add("marquee")
        m.classList.add("marqueeText")
        const length = m.offsetWidth
        m.style.setProperty("--marqueeOffset", `${offsetWidth}px`)
        m.style.setProperty("--marqueeScroll", `${scrollWidth}px`)
        m.style.setProperty("--marqueeLength", `${length}s`)
      }
    })
  },

  async draw (dom, options) {
    if (!this.library?.loaded) return dom
    const {
      isToday, isThisMonth, isThisYear, getWeekNo, renderEventAgenda,
      prepareEvents, getBeginOfWeek, getEndOfWeek, displayLegend, regularizeEvents
    } = this.library

    const startDayOfWeek = getBeginOfWeek(new Date(Date.now()), options).getDay()

    dom.innerHTML = ""
    //dom.style.setProperty("--maxeventlines", options.maxEventLines)
    dom.style.setProperty("--eventheight", options.eventHeight)
    dom.style.setProperty("--displayEndTime", (options.displayEndTime) ? "inherit" : "none")
    dom.style.setProperty("--displayWeatherTemp", (options.displayWeatherTemp) ? "inline-block" : "none")
    dom.dataset.mode = options.mode

    const makeCellDom = (d, seq) => {
      let tm = new Date(d.valueOf())
      let cell = document.createElement("div")
      cell.classList.add("cell")
      if (isToday(tm)) cell.classList.add("today")
      if (isThisMonth(tm)) cell.classList.add("thisMonth")
      if (isThisYear(tm)) cell.classList.add("thisYear")
      cell.classList.add(
        `year_${tm.getFullYear()}`,
        `month_${tm.getMonth() + 1}`,
        `date_${tm.getDate()}`,
        `weekday_${tm.getDay()}`
      )
      cell.dataset.date = new Date(tm.getFullYear(), tm.getMonth(), tm.getDate()).valueOf()
      options.weekends.forEach((w, i) => {
        if (tm.getDay() === w) cell.classList.add("weekend", `weekend_${i + 1}`)
      })
      let h = document.createElement("div")
      h.classList.add("cellHeader")

      let cwDom = document.createElement("div")
      cwDom.innerHTML = getWeekNo(tm, options)
      cwDom.classList.add("cw")
      if (tm.getDay() === startDayOfWeek) {
        cwDom.classList.add("cwFirst")
      }

      h.append(cwDom)

      let forecasted = this.forecast.find((e) => {
        return (tm.toLocaleDateString("en-CA") === e.dateId)
      })

      if (forecasted && forecasted?.weatherType) {
        let weatherDom = document.createElement("div")
        weatherDom.classList.add("cellWeather")
        let icon = document.createElement("span")
        icon.classList.add("wi", `wi-${forecasted.weatherType}`)
        weatherDom.append(icon)
        let maxTemp = document.createElement("span")
        maxTemp.classList.add("maxTemp", "temperature")
        maxTemp.innerHTML = Math.round(forecasted.maxTemperature)
        weatherDom.append(maxTemp)
        let minTemp = document.createElement("span")
        minTemp.classList.add("minTemp", "temperature")
        minTemp.innerHTML = Math.round(forecasted.minTemperature)
        weatherDom.append(minTemp)
        h.append(weatherDom)
      }
      let dateDom = document.createElement("div")
      dateDom.classList.add("cellDate")
      let dParts = new Intl.DateTimeFormat(options.locale, options.cellDateOptions).formatToParts(tm)
      let dateHTML = dParts.reduce((prev, cur, curIndex) => {
        const result = `${prev}<span class="dateParts ${cur.type} seq_${curIndex}">${cur.value}</span>`
        return result
      }, "")
      dateDom.innerHTML = dateHTML

      h.append(dateDom)

      let b = document.createElement("div")
      b.classList.add("cellBody")

      let f = document.createElement("div")
      f.classList.add("cellFooter")

      cell.append(h)
      cell.append(b)
      cell.append(f)
      return cell
    }

    const rangeCalendar = (moment, options) => {
      let boc, eoc
      switch (options.mode) {
        case "day":
          boc = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate())
          eoc = new Date(boc.valueOf())
          eoc.setDate(boc.getDate() + 7 * options.weeksInView)
          eoc.setMilliseconds(-1)
          break
        case "month":
          boc = getBeginOfWeek(new Date(moment.getFullYear(), moment.getMonth(), 1), options)
          eoc = getEndOfWeek(new Date(moment.getFullYear(), moment.getMonth() + 1, 0), options)
          break
        case "week":
        default:
          boc = getBeginOfWeek(new Date(moment.getFullYear(), moment.getMonth(), moment.getDate()), options)
          eoc = getEndOfWeek(new Date(boc.getFullYear(), boc.getMonth(), boc.getDate() + (7 * (options.weeksInView - 1))), options)
          break
      }
      return { boc, eoc }
    }

    const makeDayHeaderDom = (dom, options, range) => {
      let wm = new Date(range.boc.valueOf())
      let dayDom = document.createElement("div")
      dayDom.classList.add("headerContainer", "weekGrid")
      for (let i = 0; i < 7; i++) {
        let dm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + i)
        let day = (dm.getDay() + 7) % 7
        let dDom = document.createElement("div")
        dDom.classList.add("weekday", `weekday_${day}`)
        options.weekends.forEach((w, i) => {
          if (day === w) dDom.classList.add("weekend", `weekend_${i + 1}`)
        })
        dDom.innerHTML = new Intl.DateTimeFormat(options.locale, options.headerWeekDayOptions).format(dm)
        dayDom.append(dDom)
      }

      dom.append(dayDom)
    }

    const makeWeekGridDom = (dom, options, events, { boc, eoc }) => {
      const getMaxEventLines = ({ maxEventLines }, weekCount) => {
        if (Number.isInteger(+maxEventLines) && Number.isFinite(+maxEventLines)) return +maxEventLines
        let lines = []
        if (typeof maxEventLines === "object") {
          if (!Array.isArray(maxEventLines)) {
            const maxKeys = Object.keys(maxEventLines)
              .filter((k) => Number.isInteger(+k) && Number.isFinite(+k)).map((k) => +k)
              .reduce((p, v) => { return (p > v ? p : v) }, 0)
            lines.length = maxKeys + 1
            const defaultLines = maxEventLines?.[0] ?? maxEventLines?.["0"] ?? this.defaults.maxEventLines
            lines.fill(defaultLines)
            for (let [key, value] of Object.entries(maxEventLines)) {
              if (Number.isInteger(+key) && Number.isFinite(+key) && Number.isInteger(+value) && Number.isFinite(+value)) {
                lines[+key] = +value
              }
            }
          } else {
            lines = [...maxEventLines.filter((v) => Number.isInteger(+v) && Number.isFinite(+v))]
          }
        }
        return +(lines?.[weekCount] ?? lines?.[0] ?? this.defaults.maxEventLines)
      }

      // how many weeks between boc(begin of calendar) and eoc(end of calendar)
      let count = 1;
      let eocWeek = getWeekNo(eoc, options)
      let w = new Date(boc.valueOf())
      do {
        w.setDate(w.getDate() + 7)
        count++
      } while (getWeekNo(w, options) !== eocWeek)

      count = (options.mode === "month") ? count : options.weeksInView
      const maxEventLines = getMaxEventLines(options, count)
      dom.style.setProperty("--maxeventlines", maxEventLines)
      dom.dataset.maxEventLines = maxEventLines
      const newOptions = { ...options, maxEventLines }
      let wm = new Date(boc.valueOf())
      do {
        let wDom = document.createElement("div")
        wDom.classList.add("week")
        wDom.dataset.weekNo = getWeekNo(wm, options)

        let ccDom = document.createElement("div")
        ccDom.classList.add("cellContainer", "weekGrid")

        let ecDom = document.createElement("div")
        ecDom.classList.add("eventContainer", "weekGrid", "weekGridRow")

        let boundary = []

        let cm = new Date(wm.valueOf())
        for (let i = 0; i < 7; i++) {
          if (i) cm = new Date(cm.getFullYear(), cm.getMonth(), cm.getDate() + 1)
          ccDom.append(makeCellDom(cm, i))
          boundary.push(cm.getTime())
        }
        boundary.push(cm.setHours(23, 59, 59, 999))

        let sw = new Date(wm.valueOf())
        let ew = new Date(sw.getFullYear(), sw.getMonth(), sw.getDate() + 6, 23, 59, 59, 999)
        let eventsOfWeek = events.filter((ev) => {
          return !(ev.endDate <= sw.getTime() || ev.startDate >= ew.getTime())
        })
        for (let event of eventsOfWeek) {
          if (options.skipPassedEventToday) {
            if (event.today && event.isPassed && !event.isFullday && !event.isMultiday && !event.isCurrent) event.skip = true
          }
          if (event?.skip) continue

          let eDom = renderEventAgenda(event, options, moment)

          let startLine = 0
          if (event.startDate >= boundary.at(0)) {
            startLine = boundary.findIndex((b, idx, bounds) => {
              return (event.startDate >= b && event.startDate < bounds[idx + 1])
            })
          } else {
            eDom.classList.add("continueFromPreviousWeek")
          }

          let endLine = boundary.length - 1
          if (event.endDate <= boundary.at(-1)) {
            endLine = boundary.findIndex((b, idx, bounds) => {
              return (event.endDate <= b && event.endDate > bounds[idx - 1])
            })
          } else {
            eDom.classList.add("continueToNextWeek")
          }

          eDom.style.gridColumnStart = startLine + 1
          eDom.style.gridColumnEnd = endLine + 1

          if (event?.noMarquee) {
            eDom.dataset.noMarquee = true
          }

          if (event?.skip) {
            eDom.dataset.skip = true
          }

          if (popoverSupported) {
            if (!eDom.id) eDom.id = `${eDom.dataset.calendarSeq}_${eDom.dataset.startDate}_${eDom.dataset.endDate}_${new Date(Date.now()).getTime()}`
            eDom.dataset.popoverble = true
            eDom.onclick = (ev) => {
              this.eventPopover(eDom, options)
            }
          }

          ecDom.append(eDom)
        }

        let dateCells = ccDom.querySelectorAll(".cell")
        for (let i = 0; i < dateCells.length; i++) {
          let dateCell = dateCells[i]
          let dateStart = new Date(+dateCell.dataset.date)
          let dateEnd = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), 23, 59, 59, 999)
          let thatDayEvents = eventsOfWeek.filter((ev) => {
            return !(ev.endDate <= dateStart.valueOf() || ev.startDate > dateEnd.valueOf())
          })
          dateCell.dataset.events = thatDayEvents.length
          dateCell.dataset.hasEvents = (thatDayEvents.length > 0) ? "true" : "false"
          if (typeof options.manipulateDateCell === "function") {
            options.manipulateDateCell(dateCell, thatDayEvents)
          }

          if (options.showMore) {
            const skipped = thatDayEvents.filter((ev) => ev.skip).length
            const noskip = thatDayEvents.length - skipped
            const noskipButOverflowed = (noskip > maxEventLines) ? noskip - maxEventLines : 0
            const hidden = skipped + noskipButOverflowed
            if (hidden) {
              dateCell.classList.add("hasMore")
              dateCell.style.setProperty("--more", hidden)
            }
          }

          if (popoverSupported) {
            if (!dateCell.id) dateCell.id = `${dateCell.dataset.date}_${new Date(Date.now()).getTime()}`
            dateCell.dataset.popoverble = true
            dateCell.onclick = (ev) => {
              this.dayPopover(dateCell, thatDayEvents, options)
            }
          }
        }

        wDom.append(ccDom)
        wDom.append(ecDom)

        dom.append(wDom)
        wm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + 7)
      } while (wm.valueOf() <= eoc.valueOf())
    }

    const customHeaderDom = (dom, options, { boc, eoc }) => {
      const defaultCustomHeader = (options, boc, eoc) => {
        try {
          const locale = options.locale
          const titleOptions = options.headerTitleOptions
          if (options.mode === "month") {
            const moment = this.getMoment(options)
            return new Intl.DateTimeFormat(locale, titleOptions)
              .formatToParts(new Date(moment.valueOf()))
              .reduce((prev, cur, curIndex, arr) => {
                const result = `${prev}<span class="headerTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
                return result
              }, "")
          } else {
            const begin = new Date(boc.valueOf())
            const end = new Date(eoc.valueOf())
            return new Intl.DateTimeFormat(locale, titleOptions)
              .formatRangeToParts(begin, end)
              .reduce((prev, cur, curIndex, arr) => {
                const result = `${prev}<span class="headerTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
                return result
              }, "")
          }
        } catch (e) {
          Log.error(e)
          return ""
        }
      }
      const header = document.createElement("h1")
      header.classList.add("headerTitle")
      header.innerHTML = (typeof options.customHeader === "function") ? options.customHeader(options, boc, eoc) : defaultCustomHeader(options, boc, eoc)
      dom.prepend(header)
    }

    let moment = this.getMoment(options)
    let { boc, eoc } = rangeCalendar(moment, options)
    dom.dataset.beginOfCalendar = boc.valueOf()
    dom.dataset.endOfCalendar = eoc.valueOf()
    const targetEvents = prepareEvents({
      targetEvents: regularizeEvents({
        eventPool: this.eventPool,
        config: options
      }),
      config: options,
      range: [boc, eoc]
    })
    makeDayHeaderDom(dom, options, { boc, eoc })
    makeWeekGridDom(dom, options, targetEvents, { boc, eoc })
    if (options.displayLegend) displayLegend(dom, targetEvents, options)
    if (options.customHeader) customHeaderDom(dom, options, { boc, eoc })
    return dom
  },

  getHeader () {
    if (this.data.header && this.data.header.trim() !== "") return this.data.header
    if (!this.activeConfig.customHeader && this.activeConfig.mode === "month") {
      const moment = this.getMoment(this.activeConfig)
      const locale = this.activeConfig.locale
      const titleOptions = this.activeConfig.headerTitleOptions
      return new Intl.DateTimeFormat(locale, titleOptions).format(new Date(moment.valueOf()))
    }
    return this.data.header
  },

  updateAnimate () {
    this.updateDom(
      (!animationSupported)
        ? this.config.animationSpeed
        : {
          options: {
            speed: this.config.animationSpeed,
            animate: {
              in: this.config.animateIn,
              out: this.config.animateOut
            }
          }
        }
    )
  }
})
