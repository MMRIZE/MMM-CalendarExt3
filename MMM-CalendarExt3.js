Module.register('MMM-CalendarExt3', {
  defaults: {
    mode: 'week', // or 'month'
    weekIndex: -1, // Which week from this week starts in a view. Ignored on mode 'month' 
    weeksInView: 3, //  How many weeks will be displayed. Ignored on mode 'month'
    instanceId: null,
    firstDayOfWeek: 1, // 0: Sunday, 1: Monday
    minimalDaysOfNewYear: 4, // When the first week of new year starts in your country.
    locale: null, // 'de' or 'en-US' or prefer array like ['en-CA', 'en-US', 'en']
    cellDateOptions: {
      month: 'short',
      day: 'numeric'
    },
    eventTimeOptions: {
      timeStyle: 'short'
    },
    headerWeekDayOptions: {
      weekday: 'long'
    },
    headerTitleOptions: {
      month: 'long'
    },
    calendarSet: [],
    maxEventLines: 5, // How many events will be shown in a day cell.
    fontSize: '18px',
    eventHeight: '22px',
    eventFilter: (ev) => { return true },
    eventSorter: null,
    eventTransformer: (ev) => { return ev },
    refreshInterval: 1000 * 60,
    waitFetch: 1000 *  5,
    glanceTime: 1000 * 60, // deprecated, use refreshInterval instead.
    animationSpeed: 1000,
    useSymbol: true,
    displayLegend: false,
    useWeather: true,
    weatherLocationName: null,

    //notification: 'CALENDAR_EVENTS', /* reserved */

    manipulateDateCell: (cellDom, events) => {},
    weatherNotification: 'WEATHER_UPDATED',
    weatherPayload: (payload) => { return payload },
    eventNotification: 'CALENDAR_EVENTS',
    eventPayload: (payload) => { return payload },

    displayEndTime: false,
    displayWeatherTemp: false, 
  },

  defaulNotifications: {
    weatherNotification: 'WEATHER_UPDATED',
    weatherPayload: (payload) => { return payload },
    eventNotification: 'CALENDAR_EVENTS',
    eventPayload: (payload) => { return payload },
  },

  getStyles: function () {
    return ['MMM-CalendarExt3.css']
  },

  getMoment: function() {
    let moment = (this.tempMoment) ? new Date(this.tempMoment.valueOf()) : new Date()
    moment = (this.mode === 'month') ?
      new Date(moment.getFullYear(), moment.getMonth() + (this.stepIndex), 1) :
      new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + (7 * this.stepIndex))
    return moment
  },

  start: function() {
    this.mode = (this.config.mode === 'month') ? 'month' : 'week'
    this.locale = Intl.getCanonicalLocales(this.config.locale ?? config.language )?.[0] ?? ''
    this.instanceId = this.config.instanceId ?? this.identifier
    this.weekIndex = (this.mode === 'month') ? 0 : this.config.weekIndex
    this.weeksInView = (this.mode === 'month') ? 6 : this.config.weeksInView
    this.stepIndex = 0
    this.fetchTimer = null
    this.refreshTimer = null
    this.tempMoment = null
    this.forecast = []
    this.eventPool = new Map()

    this.notifications = {
      weatherNotification: this.config.weatherNotification ?? this.defaulNotifications.weatherNotification,
      weatherPayload: (typeof this.config.weatherPayload === 'function') ? this.config.weatherPayload : this.defaulNotifications.weatherPayload,
      eventNotification: this.config.eventNotification ?? this.defaulNotifications.eventNotification,
      eventPayload: (typeof this.config.eventPayload === 'function') ? this.config.eventPayload : this.defaulNotifications.eventPayload,
    }

    this._ready = false

    let _moduleLoaded = new Promise((resolve, reject) => {
      import('/' + this.file('CX3_Shared/CX3_shared.mjs')).then((m) => {
        this.library = m
        this.library.initModule(this, config.language)
        resolve()
      }).catch((err) => {
        console.error(err)
        reject(err)
      })
    })

    let _firstData = new Promise((resolve, reject) => {
      this._receiveFirstData = resolve
    })

    let _firstFetched = new Promise((resolve, reject) => {
      this._firstDataFetched = resolve
    })

    let _domCreated = new Promise((resolve, reject) => {
      this._domReady = resolve
    })

    Promise.allSettled([_moduleLoaded, _firstData, _domCreated]).then ((result) => {
      this._ready = true
      this.library.prepareMagic()
      let {payload, sender} = result[1].value
      this.fetch(payload, sender)
      this._firstDataFetched()
    })

    Promise.allSettled([_firstFetched]).then (() => {
      setTimeout(() => {
        this.updateDom(this.config.animationSpeed)
      }, this.config.waitFetch)
      
    })
  },

  fetch: function(payload, sender) {
    this.storedEvents = this.library.regularizeEvents({
      storedEvents: this.storedEvents,
      eventPool: this.eventPool,
      payload,
      sender,
      config: this.config
    })
  },
  
  notificationReceived: function(notification, payload, sender) {
    if (notification === this.notifications.eventNotification) {
      let conveertedPayload = this.notifications.eventPayload(payload)
      if (this?.storedEvents?.length == 0 && payload.length > 0) {
        this._receiveFirstData({payload: conveertedPayload, sender})
      }
      if (this?.library?.loaded) {
        this.fetch(conveertedPayload, sender)  
      } else {
        Log.warn('[CX3] Module is not prepared yet, wait a while.')
      }
    }

    if (notification === 'DOM_OBJECTS_CREATED') {
      this._domReady()
    }
    
    if (notification === 'CX3_MOVE_CALENDAR' || notification === 'CX3_GLANCE_CALENDAR') {
      if (notification === 'CX3_MOVE_CALENDAR') {
        Log.warn (`[DEPRECATED]'CX3_MOVE_CALENDAR' notification will be deprecated. Use 'CX3_GLANCE_CALENDAR' instead.`)
      }
      if (payload?.instanceId === this.config.instanceId || !payload?.instanceId) {
        this.stepIndex += payload?.step ?? 0
        this.updateDom(this.config.animationSpeed)
      }
    }

    if (notification === 'CX3_SET_DATE') {
      if (payload?.instanceId === this.config.instanceId || !payload?.instanceId) {
        this.tempMoment = new Date(payload?.date ?? null)
        this.stepIndex = 0
        this.updateDom(this.config.animationSpeed)
      } 
    }

    if (notification === 'CX3_RESET') {
      if (payload?.instanceId === this.config.instanceId || !payload?.instanceId) {
        this.tempMoment = null
        this.stepIndex = 0
        this.updateDom(this.config.animationSpeed)
      }
    }

    if (notification === this.notifications.weatherNotification) {
      let convertedPayload = this.notifications.weatherPayload(payload)
      if (
        (this.config.useWeather 
          && ((this.config.weatherLocationName && convertedPayload.locationName.includes(this.config.weatherLocationName)) 
          || !this.config.weatherLocationName))
        && (Array.isArray(convertedPayload?.forecastArray) && convertedPayload?.forecastArray.length)
      ) {
        this.forecast = [...convertedPayload.forecastArray].map((o) => {
          let d = new Date(o.date)
          o.dateId = d.toLocaleDateString('en-CA')
          return o
        })
      } else {
        if (this.config.weatherLocationName && !convertedPayload.locationName.includes(this.config.weatherLocationName)) {
          Log.warn(`"weatherLocationName: '${this.config.weatherLocationName}'" doesn't match with location of weather module ('${convertedPayload.locationName}')`)
        }
      }
    }
  },

  getDom: function() {
    let dom = document.createElement('div')
    dom.innerHTML = ""
    dom.classList.add('bodice', 'CX3_' + this.instanceId, 'CX3', 'mode_' + this.mode)
    if (this.config.fontSize) dom.style.setProperty('--fontsize', this.config.fontSize)
    dom.style.setProperty('--maxeventlines', this.config.maxEventLines)
    dom.style.setProperty('--eventheight', this.config.eventHeight)
    dom.style.setProperty('--displayEndTime', (this.config.displayEndTime) ? 'inherit' : 'none')
    dom.style.setProperty('--displayWeatherTemp', (this.config.displayWeatherTemp) ? 'inline-block' : 'none')
    dom = this.draw(dom, this.config)
    if (this.library?.loaded) {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer)
        this.refreshTimer = null
      }
      this.refreshTimer = setTimeout(() => {
        clearTimeout(this.refreshTimer)
        this.refreshTimer = null
        this.tempMoment = null
        this.stepIndex = 0
        this.updateDom(this.config.animationSpeed)
      }, this.config.refreshInterval)
    } else {
      Log.warn('[CX3] Module is not prepared yet, wait a while.')
    }
    return dom
  },

  draw: function (dom, config) {
    if (!this.library?.loaded) return dom
    const {
      isToday, isThisMonth, isThisYear, getWeekNo, renderEventAgenda,
      prepareEvents, getBeginOfWeek, getEndOfWeek, displayLegend,
      // gapFromToday, renderEventAgenda, eventsByDate, makeWeatherDOM, getRelativeDate, 
    } = this.library
    dom.innerHTML = ''

    const makeCellDom = (d, seq) => {
      let tm = new Date(d.valueOf())
      let cell = document.createElement('div')
      cell.classList.add('cell')
      if (isToday(tm)) cell.classList.add('today')
      if (isThisMonth(tm)) cell.classList.add('thisMonth')
      if (isThisYear(tm)) cell.classList.add('thisYear')
      cell.classList.add(
        'year_' + tm.getFullYear(),
        'month_' + (tm.getMonth() + 1),
        'date_' + tm.getDate(),
        'weekday_' + tm.getDay()
      )
      cell.dataset.date = new Date(tm.getFullYear(), tm.getMonth(), tm.getDate()).valueOf()
      
      let h = document.createElement('div')
      h.classList.add('cellHeader')

      let cwDom = document.createElement('div')
      if (seq === 0) {
        cwDom.innerHTML = getWeekNo(tm, config)
        cwDom.classList.add('cw')
      }
      
      h.appendChild(cwDom)

      let forecasted = this.forecast.find((e) => {
        return (tm.toLocaleDateString('en-CA') === e.dateId)
      })

      if (forecasted && forecasted?.weatherType) {
        let weatherDom = document.createElement('div')
        weatherDom.classList.add('cellWeather')
        let icon = document.createElement('span')
        icon.classList.add('wi', 'wi-' + forecasted.weatherType)
        weatherDom.appendChild(icon)
        let maxTemp = document.createElement('span')
        maxTemp.classList.add('maxTemp', 'temperature')
        maxTemp.innerHTML = Math.round(forecasted.maxTemperature)
        weatherDom.appendChild(maxTemp)
        let minTemp = document.createElement('span')
        minTemp.classList.add('minTemp', 'temperature')
        minTemp.innerHTML = Math.round(forecasted.minTemperature)
        weatherDom.appendChild(minTemp)
        h.appendChild(weatherDom)
      }

      let dateDom = document.createElement('div')
      dateDom.classList.add('cellDate')
      let dParts = new Intl.DateTimeFormat(this.locale, this.config.cellDateOptions).formatToParts(tm)
      let dateHTML = dParts.reduce((prev, cur, curIndex) => {
        prev = prev + `<span class="dateParts ${cur.type} seq_${curIndex}">${cur.value}</span>`
        return prev
      }, '')
      dateDom.innerHTML = dateHTML

      h.appendChild(dateDom)
      
      let b = document.createElement('div')
      b.classList.add('cellBody')

      let f = document.createElement('div')
      f.classList.add('cellFooter')

      cell.appendChild(h)
      cell.appendChild(b)
      cell.appendChild(f)
      return cell
    }

    let moment = this.getMoment()

    let boc = (this.mode === 'month') ?
      getBeginOfWeek(new Date(moment.getFullYear(), moment.getMonth(), 1), config) :
      getBeginOfWeek(new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + (7 * this.weekIndex)), config)
    
    let eoc = (this.mode === 'month') ?
      getEndOfWeek(new Date(moment.getFullYear(), moment.getMonth() + 1, 0), config) :
      getEndOfWeek(new Date(boc.getFullYear(), boc.getMonth(), boc.getDate() + (7 * (this.weeksInView - 1))), config)

    let events = prepareEvents({
      storedEvents: this.storedEvents,
      config: config,
      range: [boc, eoc]
    })

    let wm = new Date(boc.valueOf())

    let dayDom = document.createElement('div')
    dayDom.classList.add('headerContainer', 'weekGrid')
    for (i = 0; i < 7; i++) {
      let dm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + i)
      let day = (dm.getDay() + 7) % 7
      let dDom = document.createElement('div')
      dDom.classList.add('weekday', 'weekday_' + day)
      dDom.innerHTML = new Intl.DateTimeFormat(this.locale, this.config.headerWeekDayOptions).format(dm)
      dayDom.appendChild(dDom)
    }

    dom.appendChild(dayDom)

    do {
      let wDom = document.createElement('div')
      wDom.classList.add('week')
      wDom.dataset.weekNo = getWeekNo(wm, config)

      let ccDom = document.createElement('div')
      ccDom.classList.add('cellContainer', 'weekGrid')

      let ecDom = document.createElement('div')
      ecDom.classList.add('eventContainer', 'weekGrid', 'weekGridRow')

      let boundary = []

      let cm = new Date(wm.valueOf())
      for (i = 0; i < 7; i++) {
        if (i) cm = new Date(cm.getFullYear(), cm.getMonth(), cm.getDate() + 1)
        ccDom.appendChild(makeCellDom(cm, i))
        boundary.push(cm.getTime())       
      }
      boundary.push(cm.setHours(23, 59, 59, 999))

      let sw = new Date(wm.valueOf())
      let ew = new Date(sw.getFullYear(), sw.getMonth(), sw.getDate() + 6, 23, 59, 59, 999)
      let eventsOfWeek = events.filter((ev) => {
        return !(ev.endDate <= sw.getTime() || ev.startDate >= ew.getTime())
      })

      for (let event of eventsOfWeek) {
        let eDom = renderEventAgenda(
          event,
          {
            useSymbol: config.useSymbol,
            eventTimeOptions: config.eventTimeOptions,
            locale: this.locale
          },
          moment
        )

        let startLine = 0
        if (event.startDate >= boundary.at(0)) {
          startLine = boundary.findIndex((b, idx, bounds) => {
            return (event.startDate >= b && event.startDate < bounds[idx + 1])
          })
        } else {
          eDom.classList.add('continueFromPreviousWeek')
        }

        let endLine = boundary.length - 1
        if (event.endDate <= boundary.at(-1) ) {
          endLine = boundary.findIndex((b, idx, bounds) => {
            return (event.endDate <= b && event.endDate > bounds[idx - 1])
          })
        } else {
          eDom.classList.add('continueToNextWeek')
        }

        eDom.style.gridColumnStart = startLine + 1
        eDom.style.gridColumnEnd = endLine + 1

        /*
        let esDom = document.createElement('div')
        esDom.classList.add('eventTime', 'time')
        let dParts = new Intl.DateTimeFormat(this.locale, this.config.eventTimeOptions).formatToParts(new Date(event.startDate))
        let dateHTML = dParts.reduce((prev, cur, curIndex, arr) => {
          prev = prev + `<span class="eventTimeParts ${cur.type} seq_${curIndex}">${cur.value}</span>`
          return prev
        }, '')
        esDom.innerHTML = dateHTML
        eDom.appendChild(esDom)
        */
        ecDom.appendChild(eDom)
      }

      let dateCells = ccDom.querySelectorAll('.cell')
      for (let i = 0; i < dateCells.length; i++) {
        let dateCell = dateCells[i]
        let dateStart = new Date(+dateCell.dataset.date)
        let dateEnd = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), 23, 59, 59, 999)
        let thatDayEvents = eventsOfWeek.filter((ev) => {
          return !(ev.endDate <= dateStart.valueOf() || ev.startDate > dateEnd.valueOf())
        })
        dateCell.dataset.events = thatDayEvents.length
        dateCell.dataset.hasEvents = (thatDayEvents.length > 0) ? 'true' : 'false'
        if (typeof config.manipulateDateCell === 'function') {
          config.manipulateDateCell(dateCell, thatDayEvents)
        }
      }

      wDom.appendChild(ccDom)
      wDom.appendChild(ecDom)
      
      dom.appendChild(wDom)
      wm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + 7)
    } while(wm.valueOf() <= eoc.valueOf())

    if (config.displayLegend) displayLegend(dom, events, {useSymbol: config.useSymbol})

    return dom
  },

  getHeader: function () {
    if (this.mode === 'month') {
      let moment = this.getMoment()
      return new Intl.DateTimeFormat(this.locale, this.config.headerTitleOptions).format(new Date(moment.valueOf()))
    }
    return this.data.header
  }
})