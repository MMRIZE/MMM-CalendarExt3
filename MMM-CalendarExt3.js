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
    eventSorter: (a, b) => { return 1 },
    eventTransformer: (ev) => { return ev },
  },

  getStyles: function () {
    return ['module.css']
  },

  start: function() {
    this.locale = Intl.getCanonicalLocales(this.config.locale ?? config.language )?.[0] ?? ''
    this.instanceId = this.config.instanceId ?? this.identifier
    this.weekIndex = (this.config.mode === 'month') ? 0 : this.config.weekIndex
    this.weeksInView = (this.config.mode === 'month') ? 6 : this.config.weeksInView
    this.moment = new Date()
    this.config.mode = (this.config.mode === 'month') ? 'month' : 'week'
    this.newCalendar(this.moment, 0)
  },
  
  notificationReceived: function(notification, payload, sender) {
    if (notification === 'CALENDAR_EVENTS') {
      this.storedEvents = JSON.parse(JSON.stringify(payload))
      let calendarSet = (Array.isArray(this.config.calendarSet)) ? [...this.config.calendarSet] : []
      if (calendarSet.length > 0) {
        this.storedEvents = this.storedEvents.filter((ev) => {
          return (calendarSet.includes(ev.calendarName))
        }).map((ev) => {
          let i = calendarSet.findIndex((name) => {
            return name === ev.calendarName
          }) + 1
          ev.calendarSeq = i 
          return ev
        })
      }
      this.updateDom(1000)
    }
    if (notification === 'CX3_MOVE_CALENDAR') {
      if (payload?.instanceId === this.config.instanceId || !payload?.instanceId) {
        this.newCalendar(this.moment, payload?.step ?? 0)
        this.updateDom(1000)
      } 
    }

    if (notification === 'CX3_SET_DATE') {
      if (payload?.instanceId === this.config.instanceId || !payload?.instanceId) {
        let nf = new Date(payload?.date ?? null)
        this.moment = new Date(nf.getFullYear(), nf.getMonth(), nf.getDate())
        this.newCalendar(this.moment, 0)
        this.updateDom(1000)
      } 
    }
  },

  newCalendar: function (moment, s = 0) {
    let m = new Date(moment.valueOf())
    if (this.config.mode === 'month') {
      this.moment = new Date(m.getFullYear(), m.getMonth() + s, m.getDate())
    } else {
      this.moment = new Date(m.getFullYear(), m.getMonth(), m.getDate() + (s * 7))
    }
    this.updateDom(1000)
  },

  getDom: function() {
    let dom = document.createElement('div')
    dom.innerHTML = ""
    dom.classList.add('bodice', 'CX3_' + this.instanceId, 'CX3', 'mode_' + this.config.mode)
    if (this.config.fontSize) dom.style.setProperty('--fontsize', this.config.fontSize)
    dom.style.setProperty('--maxeventlines', this.config.maxEventLines)
    dom.style.setProperty('--eventheight', this.config.eventHeight)
    dom = this.draw(dom)
    return dom

  },

  draw: function (dom) {
    dom.innerHTML = ''

    const isToday = (d) => {
      let tm = new Date()
      let start = (new Date(tm.valueOf())).setHours(0, 0, 0, 0)
      let end = (new Date(tm.valueOf())).setHours(23, 59, 59, 999)
      return (d.getTime() >= start && d.getTime() <= end)
    }

    const isThisMonth = (d) => {
      let tm = new Date()
      let start = new Date(tm.getFullYear(), tm.getMonth(), 1)
      let end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999)
      return (d.getTime() >= start && d.getTime() <= end)
    }

    const isThisYear = (d) => {
      let tm = new Date()
      let start = new Date(tm.getFullYear(), 1, 1)
      let end = new Date(tm.getFullYear(), 11, 31, 23, 59, 59, 999)
      return (d.getTime() >= start && d.getTime() <= end)
    }

    const getBeginOfWeek = (d) => {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() - this.config.firstDayOfWeek + 7 ) % 7)
    }

    const getBeginOfCalendar = (d) => {
      let m
      if (this.config.mode === 'month') {
        m = new Date(d.getFullYear(), d.getMonth(), 1)
      } else {
        m = new Date(d.getFullYear(), d.getMonth(), d.getDate() + this.weekIndex * 7)
      }
      
      return getBeginOfWeek(m)
    }

    const getEndOfCalendar = (boc) => {
      return new Date(boc.getFullYear(), boc.getMonth(), boc.getDate() + (7 * this.weeksInView), 23, 59, 59, 999)
    }

    const getWeekNo = (d) => {
      let bow = getBeginOfWeek(d)
      let fw = getBeginOfWeek(new Date(d.getFullYear(), 0, this.config.minimalDaysOfNewYear))
      if (bow.getTime() < fw.getTime()) fw = getBeginOfWeek(new Date(d.getFullYear() - 1), 0, this.config.minimalDayosOfNewYear)
      let count = 1;
      let t = new Date(fw.valueOf())
      while (bow.getTime() > t.getTime()) {
        t.setDate(t.getDate() + 7)
        count++;
      }
      return count
    }

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
      
      let h = document.createElement('div')
      h.classList.add('cellHeader')

      
      let cwDom = document.createElement('div')
      if (seq === 0) {
        cwDom.innerHTML = getWeekNo(tm)
        cwDom.classList.add('cw')
      }
      
      h.appendChild(cwDom)
      
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

    const isPassed = (ev) => {
      return (ev.endDate < Date.now())
    }

    const isFuture = (ev) => {
      return (ev.startDate > Date.now())
    }

    const isCurrent = (ev) => {
      let tm = Date.now()
      return (ev.endDate >= tm && ev.startDate <= tm)
    }

    const isMultiday = (ev) => {
      let s = new Date(ev.startDate)
      let e = new Date(ev.endDate)
      return ((s.getDate() !== e.getDate())
        || (s.getMonth() !== e.getMonth())
        || (s.getFullYear() !== e.getFullYear()))
    }
    


    let moment = new Date(this.moment.valueOf())

    let boc = getBeginOfCalendar(getBeginOfWeek(moment))
    let eoc = getEndOfCalendar(boc)

    let tboc = boc.getTime()
    let teoc = eoc.getTime()


    let events = this.storedEvents ?? []

    events = events.filter((ev) => {
      return !(+ev.endDate <= tboc || +ev.startDate >= teoc)
    }).map((ev) => {
      ev.startDate = +ev.startDate
      ev.endDate = +ev.endDate
      let et = new Date(+ev.endDate)
      if (et.getHours() === 0 && et.getMinutes() === 0 && et.getSeconds() === 0 && et.getMilliseconds() === 0) ev.endDate = ev.endDate - 1
      ev.isPassed = isPassed(ev)
      ev.isCurrent = isCurrent(ev)
      ev.isFuture = isFuture(ev)
      ev.isFullday = ev.fullDayEvent
      ev.isMultiday = isMultiday(ev)
      return ev
    }).sort((a, b) => {
      let aDur = a.endDate - a.startDate
      let bDur = b.endDate - b.startDate

      return ((a.isFullday || a.isMultiday) && (b.isFullday || b.isMultiday)) 
        ? bDur - aDur
        : ((a.startDate === b.startDate) ? a.endDate - b.endDate : a.startDate - b.startDate)

    })

    if (typeof this.config.eventFilter === 'function') {
      events = events.filter((ev) => {
        return this.config.eventFilter(ev)
      })
    }

    if (typeof this.config.eventSorter === 'function') {
      events = events.sort((a, b) => {
        return this.config.eventSorter(a, b)
      })
    }

    if (typeof this.config.eventTransformer === 'function') {
      events = events.map((ev) => {
        return this.config.eventTransformer(ev)
      })
    }

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


    for (w = 0; w < this.weeksInView; w++) {
      if (w) wm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + 7)
      let wDom = document.createElement('div')
      wDom.classList.add('week')
      wDom.dataset.weekNo = getWeekNo(wm)

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
        let eDom = document.createElement('div')
        eDom.classList.add('event')

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
        eDom.dataset.calendarSeq = event?.calendarSeq ?? 0
        eDom.dataset.calendarName = event.calendarName
        eDom.dataset.color = event.color
        eDom.dataset.description = event.description
        eDom.dataset.title = event.title
        eDom.dataset.fullDayEvent = event.fullDayEvent
        eDom.dataset.geo = event.geo
        eDom.dataset.location = event.location
        eDom.dataset.startDate = event.startDate
        eDom.dataset.endDate = event.endDate
        eDom.dataset.symbol = event.symbol.join(' ')
        eDom.dataset.today = event.today
        eDom.classList.add('calendar_' + encodeURI(event.calendarName))
        eDom.classList.add(event.class)
        eDom.style.setProperty('--calendarColor', event.color)
        if (event.fullDayEvent) eDom.classList.add('fullday')
        if (event.isPassed) eDom.classList.add('passed')
        if (event.isCurrent) eDom.classList.add('current')
        if (event.isFuture) eDom.classList.add('future')
        if (event.isMultiday) eDom.classList.add('multiday')
        if (!(event.isMultiday || event.fullDayEvent)) eDom.classList.add('singleday')
        let etDom = document.createElement('div')
        etDom.classList.add('title')
        etDom.innerHTML = event.title
        let esDom = document.createElement('div')
        esDom.classList.add('eventTime')
        let dParts = new Intl.DateTimeFormat(this.locale, this.config.eventTimeOptions).formatToParts(new Date(event.startDate))
        let dateHTML = dParts.reduce((prev, cur, curIndex, arr) => {
          prev = prev + `<span class="eventTimeParts ${cur.type} seq_${curIndex}">${cur.value}</span>`
          return prev
        }, '')
        esDom.innerHTML = dateHTML
        eDom.appendChild(esDom)
        eDom.appendChild(etDom)
        ecDom.appendChild(eDom)
      }

      wDom.appendChild(ccDom)
      wDom.appendChild(ecDom)
      
      dom.appendChild(wDom)
    }    





    return dom
  },

  getHeader: function () {
    if (this.config.mode === 'month') {
      return new Intl.DateTimeFormat(this.locale, this.config.headerTitleOptions).format(new Date(this.moment.valueOf()))
    }
    return this.data.header
  }
})