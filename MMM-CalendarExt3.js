/* Global Log, Module, config */
logCE = (...args) => { /* do nothing */ }

const popoverSupported = (typeof HTMLElement !== 'undefined') ? HTMLElement.prototype.hasOwnProperty('popover') : false
if (!popoverSupported) console.info(`This browser doesn't support popover yet. Update your system.`)
const animationSupported = (typeof window !== 'undefined' && window?.mmVersion) ? +(window.mmVersion.split('.').join('')) >= 2250 : false


// Check if a character is a simple emoji
String.prototype.isSimpleEmoji = function() {
  const codePoint = this.codePointAt(0);
  return (
    (codePoint >= 0x1F300 && codePoint <= 0x1F3FA) || // Miscellaneous Symbols and Pictographs
    (codePoint >= 0x1F400 && codePoint <= 0x1F6F9) || // Emoticons
    (codePoint >= 0x1F700 && codePoint <= 0x1F773) || // Alchemical Symbols
    (codePoint >= 0x1F780 && codePoint <= 0x1F7D8) || // Geometric Shapes Extended
    (codePoint >= 0x1F800 && codePoint <= 0x1F80B) || // Supplemental Arrows-C
    (codePoint >= 0x1F900 && codePoint <= 0x1F9FF) || // Supplemental Symbols and Pictographs
    (codePoint >= 0x2600 && codePoint <= 0x26FF) ||   // Miscellaneous Symbols
    (codePoint >= 0x2700 && codePoint <= 0x27BF) ||   // Dingbats
    (codePoint >= 0x1F680 && codePoint <= 0x1F6FF) || // Transport and Map Symbols
    (codePoint >= 0x1F910 && codePoint <= 0x1F9C0) || // Supplemental Symbols and Pictographs
    (codePoint >= 0x1F100 && codePoint <= 0x1F1FF) || // Enclosed Alphanumeric Supplement
    (codePoint >= 0x1F200 && codePoint <= 0x1F2FF) || // Enclosed Ideographic Supplement
    (codePoint >= 0x2B00 && codePoint <= 0x2BFF) ||   // Miscellaneous Symbols and Arrows
    (codePoint >= 0x27F0 && codePoint <= 0x27FF) ||   // Supplemental Arrows-A
    (codePoint >= 0x2900 && codePoint <= 0x297F) ||   // Supplemental Arrows-B
    (codePoint >= 0x1FA70 && codePoint <= 0x1FAFF) || // Symbols and Pictographs Extended-A
    (codePoint >= 0x1F900 && codePoint <= 0x1F9FF) || // Symbols and Pictographs Extended-B
    (codePoint >= 0xFE00 && codePoint <= 0xFE0F) ||   // Emoticons (Emoji Variation Selector)
    (codePoint >= 0xD800 && codePoint <= 0xDFFF)
  );
};

// Check if a character is combined into an emoji
String.prototype.isCombinedIntoEmoji = function() {
  return this.length > 1 && this.split('').some(char => char.isSimpleEmoji());
};

// Check if a character is an emoji
String.prototype.isEmoji = function() {
  return this.isSimpleEmoji() || this.isCombinedIntoEmoji();
};

// Check if a string contains a single emoji
String.prototype.isSingleEmoji = function() {
  return this.length === 1 && this.isEmoji();
};

// Check if a string contains any emoji
String.prototype.containsEmoji = function() {
  return this.split('').some(char => char.isEmoji());
};

// Check if a string contains only emojis
String.prototype.containsOnlyEmoji = function() {
  return this.length > 0 && !this.split('').some(char => !char.isEmoji());
};

// Extract emojis from a string and return as a new string
String.prototype.emojiString = function() {
  return this.split('').filter(char => char.isEmoji()).join('');
};

// Function to extract all emojis from a string
String.prototype.extractEmojis = function() {
  let emojis = '';

  for (let i = 0; i < this.length; i++) {
      // Extract substrings starting from the current index
      const substring = this[i];

      // Check if the substring represents a valid emoji
      if (substring.isEmoji()) {
          // Add the emoji to the array
          emojis += substring;
      }
      else { break }
  }

  return emojis;
}

// Extract emojis from a string and return as an array of characters
String.prototype.emojis = function() {
  return this.split('').filter(char => char.isEmoji());
};

// Extract emoji scalars from a string and return as an array of UnicodeScalars
String.prototype.emojiScalars = function() {
  return this.split('').filter(char => char.isEmoji()).flatMap(char => [...char]);
};

Module.register('MMM-CalendarExt3', {
  defaults: {
    debug: false,    
    mode: 'week', // or 'month', 'day'
    weekIndex: -1, // Which week from this week starts in a view. Ignored on mode 'month'
    dayIndex: -1,
    weeksInView: 3, //  How many weeks will be displayed. Ignored on mode 'month'
    instanceId: null,
    firstDayOfWeek: null, // 0: Sunday, 1: Monday
    minimalDaysOfNewYear: null, // When the first week of new year starts in your country.
    weekends: [], // or [0, 6]. 0: Sunday, 6: Saturday
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
    refreshInterval: 1000 * 60 * 5, // too frequent refresh. 10 minutes is enough.
    waitFetch: 1000 * 5,
    glanceTime: 1000 * 60, // deprecated, use refreshInterval instead.
    animationSpeed: 2000,
    useSymbol: true,
    displayLegend: false,
    useWeather: true,
    weatherLocationName: null,
    //notification: 'CALENDAR_EVENTS', /* reserved */
    updateNotification: 'UPDATE_CAL',
    manipulateDateCell: (cellDom, events) => { },
    weatherNotification: 'WEATHER_UPDATED',
    weatherPayload: (payload) => { return payload },
    eventNotification: 'CALENDAR_EVENTS',
    eventPayload: (payload) => { return payload },
    displayEndTime: false,
    displayWeatherTemp: false,
    popoverTemplate: './popover.html',
    popoverTimeout: 1000 * 30,
    popoverPeriodOptions: {
      dateStyle: 'short',
      timeStyle: 'short'
    },
    popoverDateOptions: {
      dateStyle: 'full',
    },
    customEvents: [
			// Array of {keyword: "", symbol: "", color: "", eventClass: ""} where Keyword is a regexp and symbol/color/eventClass are to be applied for matches
		],
    coloredEvent: true,
		coloredSymbol: true,    
    displayCW: true,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    skipPassedEventToday: false,
    showMore: true,
    useIconify: true,
    useMarquee: false,

    skipDuplicated: true,
    monthIndex: 0,
    referenceDate: null,
    showLess: true,
    shortenIndex: 2,
    futureMaxEventLines: 2, 
  },

  defaulNotifications: {
    weatherNotification: 'WEATHER_UPDATED',
    weatherPayload: (payload) => { return payload },
    eventNotification: 'CALENDAR_EVENTS',
    eventPayload: (payload) => { return payload },
  },

  getStyles: function () {
    let css = ['MMM-CalendarExt3.css']
    return css
  },

  getMoment: function (options, indexOffset) {
    let moment = (options.referenceDate) ? new Date(options.referenceDate) : new Date()
    //let moment = (this.tempMoment) ? new Date(this.tempMoment.valueOf()) : new Date()
    switch (options.mode) {
      case 'day':
        moment = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() +  options.dayIndex)
        break
      case 'month':
        moment = new Date(moment.getFullYear(), moment.getMonth() + (options.monthIndex-indexOffset), 1)
        break
      case 'week':
      default:
        moment = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate() + (7 * (options.weekIndex-indexOffset)))
    }
    return moment
  },

  regularizeConfig: function (options) {
    const weekInfoFallback = {
      firstDay: 1,
      minimalDays: 4,
      weekend: [0, 6]
    }

    options.locale = Intl.getCanonicalLocales(options.locale ?? config?.locale ?? config?.language)?.[ 0 ] ?? ''
    const calInfo = new Intl.Locale(options.locale)
    if (calInfo?.weekInfo) {
      options.firstDayOfWeek = (options.firstDayOfWeek !== null) ? options.firstDayOfWeek : (calInfo.weekInfo?.firstDay ?? weekInfoFallback.firstDay)
      options.minimalDaysOfNewYear = (options.minimalDaysOfNewYear !== null) ? options.minimalDaysOfNewYear : (calInfo.weekInfo?.minimalDays ?? weekInfoFallback.minDays)
      options.weekends = ((Array.isArray(options.weekends) && options.weekends?.length) ? options.weekends : (calInfo.weekInfo?.weekend ?? [])).map(d => d % 7)
    }

    options.instanceId = options.instanceId ?? this.identifier
    this.notifications = {
      weatherNotification: options.weatherNotification ?? this.defaulNotifications.weatherNotification,
      weatherPayload: (typeof options.weatherPayload === 'function') ? options.weatherPayload : this.defaulNotifications.weatherPayload,
      eventNotification: options.eventNotification ?? this.defaulNotifications.eventNotification,
      eventPayload: (typeof options.eventPayload === 'function') ? options.eventPayload : this.defaulNotifications.eventPayload,
    }

    options.mode = ([ 'day', 'month', 'week' ].includes(options.mode)) ? options.mode : 'week'
    options.weekIndex = (options.mode === 'month') ? 0 : options.weekIndex
    options.weeksInView = (options.mode === 'month') ? 6 : options.weeksInView
    options.dayIndex = (options.mode === 'day') ? options.dayIndex : 0

    return options
  },

  start: function() {
    if (this.config.debug) logCE = (...args) => { console.log("[CALEXT]", ...args) }
    this.activeConfig = this.regularizeConfig({ ...this.config })
    this.originalConfig = { ...this.activeConfig }

    this.fetchTimer = null
    this.refreshTimer = null
    this.forecast = []
    this.eventPool = new Map()
    this.popoverTimer = null
    
    this._ready = false

    let _moduleLoaded = new Promise((resolve, reject) => {
      import('/' + this.file('CX3_Shared/CX3_shared.mjs')).then((m) => {
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

    Promise.allSettled([_moduleLoaded, _domCreated]).then ((result) => {
      this._ready = true
      this.library.prepareMagic()
      setTimeout(() => {
        this.updateAnimate()
      }, this.activeConfig.waitFetch)
    })

  /* append popover with notification to send event details*/
    if (popoverSupported) {
        document.body.addEventListener('click', (ev) => {
            let eDom = ev.target.closest('.event[data-popoverble=true]');
            if (eDom) {
                // Extract event details
                let eventDetails = {
                    id: eDom.dataset.id,
                    title: eDom.dataset.title,
                    startDate: eDom.dataset.startDate,
                    endDate: eDom.dataset.endDate,
                    location: eDom.dataset.location,
                    description: eDom.dataset.description,
                    calendarName: eDom.dataset.calendarName,
                    allDay: eDom.dataset.fullDayEvent 
                };
                
                // Send the notification with event details
                this.sendNotification('EDIT_CALENDAR_EVENT', eventDetails);
                Log.info("eventdetails:", eventDetails)
                // Commenting out the next line to disable event popover activation
                //return this.activatePopover(eDom);
            }
            return;
        });
      this.preparePopover();
    }
  },

  prepareHomeButton: function() {
    var moduleElement = document.getElementsByClassName("module MMM-CalendarExt3 MMM-CalendarExt3");
    // Create the "Home event" button
    let homeButton = document.createElement("button");
    homeButton.className = "home-button";
    homeButton.innerHTML = '<i class="fas fa-calendar-day"></i>'; 
    homeButton.addEventListener("click", () => {
      this.activeConfig = this.regularizeConfig({ ...this.originalConfig })
      this.updateAnimate()
    });
    moduleElement[0].appendChild(homeButton);
  },

  preparePopover: function () {
    if (!popoverSupported) return
    if (document.getElementById('CX3_POPOVER')) return

    fetch(this.file(this.config.popoverTemplate)).then((response) => {
      return response.text()
    }).then((text) => {
      const template = new DOMParser().parseFromString(text, 'text/html').querySelector('#CX3_T_POPOVER').content.querySelector('.popover')
      const popover = document.importNode(template, true)
      popover.id = 'CX3_POPOVER'
      document.body.appendChild(popover)
      popover.ontoggle = (ev) => {
        if (this.popoverTimer) {
          clearTimeout(this.popoverTimer)
          this.popoverTimer = null
        }
        if (ev.newState === 'open') {
          this.popoverTimer = setTimeout(() => {
            try {
              popover.hidePopover()
              popover.querySelector('.container').innerHTML = ''
            } catch (e) {
              // do nothing
            }
          }, this.activeConfig.popoverTimeout)
        } else { // closed
          popover.querySelector('.container').innerHTML = ''
        }
      }
    }).catch((err) => {
      console.error('[CX3]', err)
    })
  },

  dayPopover(cDom, events, options) {
    const popover = document.getElementById('CX3_POPOVER')
    if (!popover) return
    const container = popover.querySelector('.container')
    container.innerHTML = ''
    const ht = popover.querySelector('template#CX3_T_EVENTLIST').content.cloneNode(true)
    container.appendChild(document.importNode(ht, true))
    let header = container.querySelector('.header')
    header.innerHTML = new Intl.DateTimeFormat(options.locale, { dateStyle: 'full' }).formatToParts(new Date(+cDom.dataset.date))
    .reduce((prev, cur, curIndex, arr) => {
      prev = prev + `<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
      return prev
    }, '')

    let list = container.querySelector('.list')
    list.innerHTML = ''
    const { renderSymbol } = this.library
    events.forEach((e) => {
      pOption = (e.fullDayEvent) ? { dateStyle: 'short' } : { dateStyle: 'short', timeStyle: 'short' }

      const item = popover.querySelector('template#CX3_T_EVENTITEM').content.firstElementChild.cloneNode(true)
      item.style.setProperty('--calendarColor', e.color)
      item.classList.add('event')
      const symbol = item.querySelector('.symbol')
      renderSymbol(symbol, e, config)
      const time = item.querySelector('.time')
      time.innerHTML = new Intl.DateTimeFormat(options.locale, pOption).formatRangeToParts(new Date(+e.startDate), new Date(+e.endDate))
      .reduce((prev, cur, curIndex, arr) => {
        prev = prev + `<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
        return prev
      }, '')
      const title = item.querySelector('.title')
      title.innerHTML = e.title
      list.appendChild(item)
    })
	  //leave this active to review day
    //edit button is overlayed on the left (on the date number), day popover can be selected on the right side
    this.activatePopover(popover)
  },

  eventPopover: function (eDom) {
    const popover = document.getElementById('CX3_POPOVER')
    if (!popover) return
    const container = popover.querySelector('.container')
    container.innerHTML = ''
    const ht = popover.querySelector('template#CX3_T_EVENTDETAIL').content.cloneNode(true)
    container.appendChild(document.importNode(ht, true))
    let eSymbol = eDom.querySelector('.symbol').cloneNode(true)
    container.querySelector('.symbol').appendChild(eSymbol)
    let eTitle = eDom.querySelector('.title').cloneNode(true)
    container.querySelector('.title').appendChild(eTitle)
    let header = container.querySelector('.header')
    header.style.setProperty('--calendarColor', eDom.style.getPropertyValue('--calendarColor'))
    header.style.setProperty('--oppositeColor', eDom.style.getPropertyValue('--oppositeColor'))
    header.dataset.isFullday = eDom.dataset.fullDayEvent

    let criteria = container.querySelector('.criteria')
    criteria.innerHTML = ''
    const ps = ['location', 'description', 'calendar']
    ps.forEach((c) => {
      if (eDom.dataset[ c ]) {
        const ct = popover.querySelector('template#CX3_T_CRITERIA').content.firstElementChild.cloneNode(true)
        ct.querySelector('.name').innerHTML = c
        ct.querySelector('.value').innerHTML = eDom.dataset[ c ]
        criteria.appendChild(document.importNode(ct, true))
      }
    })

    let start = new Date(+(eDom.dataset.startDate))
    let end = new Date(+(eDom.dataset.endDate))
    const ct = popover.querySelector('template#CX3_T_CRITERIA').content.firstElementChild.cloneNode(true)
    const n = criteria.appendChild(document.importNode(ct, true))
    n.classList.add('period')
    n.querySelector('.name').innerHTML = 'period'
    pOption = (eDom.dataset.fullDayEvent === 'true') ? { dateStyle: 'short' } : { dateStyle: 'short', timeStyle: 'short' }
    n.querySelector('.value').innerHTML = new Intl.DateTimeFormat(this.locale, pOption).formatRangeToParts(start, end)
    .reduce((prev, cur, curIndex, arr) => {
      prev = prev + `<span class="eventTimeParts ${cur.type} seq_${curIndex} ${cur.source}">${cur.value}</span>`
      return prev
    }, '')
    //disable event popover as we want to use event handler
    //this.activatePopover(popover)
  },

  activatePopover: function (popover) {
    let opened = document.querySelectorAll('[popover-opened]')
    for (const o of Array.from(opened)) {
      o.hidePopover()
    }
    popover.showPopover()
  },

  notificationReceived: function (notification, payload, sender) {
    logCE("notificationReceived:", notification)
    const replyCurrentConfig = ({ callback }) => {
      if (typeof callback === 'function') {
        callback({ ...this.activeConfig })
      }
    }
    //force a reanimation
    if (notification === this.config.updateNotification) {
      //reset the animation timer as we are updating right now
      this.resetAnimationTimer(false);
      this.updateAnimate();
    }
    //handles eventPool reset, will display on next updateAnimate
    if (notification === this.notifications.eventNotification) {
      Log.info("eventNotification Payload:", payload);
      let convertedPayload = this.notifications.eventPayload(payload)
      this.eventPool.set(sender.identifier, JSON.parse(JSON.stringify(convertedPayload)))
    }

    if (notification === 'MODULE_DOM_CREATED') {
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
          o.dateId = d.toLocaleDateString('en-CA')
          return o
        })
      } else {
        if (this.activeConfig.weatherLocationName && !convertedPayload.locationName.includes(this.activeConfig.weatherLocationName)) {
          Log.warn(`"weatherLocationName: '${this.activeConfig.weatherLocationName}'" doesn't match with location of weather module ('${convertedPayload.locationName}')`)
        }
      }
    }

    if (['CX3_GLANCE_CALENDAR', 'CX3_MOVE_CALENDAR', 'CX3_SET_DATE'].includes(notification)) {
      console.warn (`[DEPRECATED]'CX3_GLANCE_CALENDAR' notification was deprecated. Use 'CX3_SET_CONFIG' instead. (README.md)`)
    }
    if (payload?.instanceId && payload?.instanceId !== this.activeConfig?.instanceId) return

    if (notification === 'CX3_GET_CONFIG') {
      replyCurrentConfig(payload)
    }

    if (notification === 'CX3_SET_CONFIG') {
      this.activeConfig = this.regularizeConfig({ ...this.activeConfig, ...payload })
      this.updateAnimate()
      replyCurrentConfig(payload)
    }

    if (notification === 'CX3_RESET') {
      this.activeConfig = this.regularizeConfig({ ...this.originalConfig })
      this.updateAnimate()
      replyCurrentConfig(payload)
    }
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "EVENT_ADD_SUCCESS") {
    }
  },

  resetAnimationTimer: function (timerBlocked = false) {
    logCE("resetAnimationTimer");
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
    this.refreshTimer = setTimeout(() => {
      // Check if the timer is not blocked before executing the callback
      if (!timerBlocked) {
        clearTimeout(this.refreshTimer)
        this.refreshTimer = null
        this.updateAnimate()
      }
    }, this.activeConfig.refreshInterval)
  },

  getDom: function () {
    let dom = document.createElement('div')
    dom.innerHTML = ""
    dom.classList.add('bodice', 'CX3_' + this.activeConfig.instanceId, 'CX3')
    if (this.activeConfig.fontSize) dom.style.setProperty('--fontsize', this.activeConfig.fontSize)
    if (!this.library?.loaded) {
      Log.warn('[CX3] Module is not prepared yet, wait a while.')
      return dom
    }
    dom = this.draw(dom, this.activeConfig)
    this.resetAnimationTimer(false)
    if (!this.homeButtonPrepared) {
      this.prepareHomeButton();
      this.homeButtonPrepared = true; // Set flag to true after calling prepareHomeButton()
    }
    return dom
  },

  updated: function (dom, options) {
    if (!dom) return
    dom.querySelectorAll('.title')?.forEach((e) => {
      const parent = e.closest('.event')
      const symbol = parent.querySelector('.symbol')
      var transformedTitle = e.innerHTML;

      // Check if the innerHTML content is not empty and the first character is an emoji
      if (transformedTitle.length > 0) {
        const hasEmoji = transformedTitle.containsEmoji(); // Assuming you have defined the isEmoji method as shown in the previous code
        if (hasEmoji) {
          // Remove the first character from transformedTitle
          myEmoji=transformedTitle.extractEmojis()
          transformedTitle = transformedTitle.substring(myEmoji.length);
          keyword = '^' + myEmoji
          const newEvent = {
              keyword: '^' + myEmoji,
              emoji: myEmoji,
              transform: {
                  search: myEmoji,
                  replace: ''
              }
          };
          found = false
          // Loop through customEvents array to check if emoji already exists
          for (let i = 0; i < this.config.customEvents.length; i++) {
              if (this.config.customEvents[i].keyword === keyword) {
                  this.config.customEvents[i] = newEvent;
                  found = true;
                  break;
              }
          }

          // If emoji doesn't exist, add new event
          if (!found) {
              this.config.customEvents.push(newEvent);
          }          
        }
      }

      // Color events if custom color or eventClass are specified, transform title if required
      if (this.config.customEvents.length > 0) {
        for (let ev in this.config.customEvents) {
          let needle = new RegExp(this.config.customEvents[ev].keyword, "gi");
          //matched keyword
          if (needle.test(e.innerHTML)) {
            //transform title
            if (typeof this.config.customEvents[ev].transform === "object") {
              transformedTitle = this.titleTransform(transformedTitle, this.config.customEvents[ev].transform);
            }

            //color event
            if (typeof this.config.customEvents[ev].color !== "undefined" && this.config.customEvents[ev].color !== "") {
              // Respect parameter ColoredSymbolOnly also for custom events
              if (this.config.coloredEvent) {
                //parent is the event overall container
                parent.style.backgroundColor = this.config.customEvents[ev].color;
                let magic = this.library.prepareMagic()
                //event title should be colored by the --oppositeColor variable in CCS
                magic.style.color = parent.style.backgroundColor
                let oppositeColor = this.library.getContrastYIQ(window.getComputedStyle(magic).getPropertyValue('color'))                
                parent.style.setProperty('--oppositeColor', oppositeColor)
              }
            }
            //color symbol
            if (typeof this.config.customEvents[ev].symbolcolor !== "undefined" && this.config.customEvents[ev].symbolcolor !== "") {
              //assign color to symbol (may be blocked by useSymbol)
              if (this.config.useSymbol && this.config.coloredSymbol) {
                symbol.style.color = this.config.customEvents[ev].symbolcolor;
              }
            }
            //overwrite symbol class
            if (typeof this.config.customEvents[ev].symbol !== "undefined" && this.config.customEvents[ev].symbol !== "") {
              symbol.innerHTML = "<span class='" + this.config.customEvents[ev].symbol + "'></span>";
            }
            //overwrite symbol class
            if (typeof this.config.customEvents[ev].emoji !== "undefined" && this.config.customEvents[ev].emoji !== "") {
              symbol.innerHTML = "<span class=''>" + this.config.customEvents[ev].emoji + "</span>";
            }            
            //assign class (to inherit css)
            if (typeof this.config.customEvents[ev].eventClass !== "undefined" && this.config.customEvents[ev].eventClass !== "") {
              //attach class to parent
              parent.className += ` ${this.config.customEvents[ev].eventClass}`;
            }
          }
        }
      }   
      //update event text/html
      e.innerHTML = transformedTitle;   

      //apply marquee
      const {offsetWidth, scrollWidth} = e
      if (options.useMarquee && parent?.dataset?.noMarquee !== 'true' && offsetWidth < scrollWidth) {
        const m = document.createElement('span')
        m.innerHTML = e.innerHTML
        e.innerHTML = ''
        e.appendChild(m)
        e.classList.add('marquee')
        m.classList.add('marqueeText')
        const length = m.offsetWidth
        m.style.setProperty('--marqueeOffset', offsetWidth + 'px')
        m.style.setProperty('--marqueeScroll', scrollWidth + 'px')
        m.style.setProperty('--marqueeLength', length + 's')
      }      
    })
  },

	titleTransform (title, titleReplace) {
		let transformedTitle = title;
		 for (let tr in titleReplace) {
			let transform = titleReplace[tr];
		//for (let transform of titleReplace) {
			if (typeof transform === "object") {
				if (typeof transform.search !== "undefined" && transform.search !== "" && typeof transform.replace !== "undefined") {
					let regParts = transform.search.match(/^\/(.+)\/([gim]*)$/);
					let needle = new RegExp(transform.search, "g");
					if (regParts) {
						// the parsed pattern is a regexp with flags.
						needle = new RegExp(regParts[1], regParts[2]);
					}

					let replacement = transform.replace;
					if (typeof transform.yearmatchgroup !== "undefined" && transform.yearmatchgroup !== "") {
						const yearmatch = [...title.matchAll(needle)];
						if (yearmatch[0].length >= transform.yearmatchgroup + 1 && yearmatch[0][transform.yearmatchgroup] * 1 >= 1900) {
							let calcage = new Date().getFullYear() - yearmatch[0][transform.yearmatchgroup] * 1;
							let searchstr = `$${transform.yearmatchgroup}`;
							replacement = replacement.replace(searchstr, calcage);
						}
					}
					transformedTitle = transformedTitle.replace(needle, replacement);
				}
			}
		}
		return transformedTitle;
	},

  draw: async function (dom, options) {
    if (!this.library?.loaded) return dom
    const {
      isToday, isThisMonth, isThisYear, getWeekNo, renderEventAgenda,
      prepareEvents, getBeginOfWeek, getEndOfWeek, displayLegend, regularizeEvents,
    } = this.library

    const startDayOfWeek = getBeginOfWeek(new Date(), options).getDay()

    dom.innerHTML = ''
    dom.style.setProperty('--maxeventlines', options.maxEventLines)
    dom.style.setProperty('--eventheight', options.eventHeight)
    dom.style.setProperty('--displayEndTime', (options.displayEndTime) ? 'inherit' : 'none')
    dom.style.setProperty('--displayWeatherTemp', (options.displayWeatherTemp) ? 'inline-block' : 'none')

  const makeCellDom = (d, seq, eventsOfTheDay) => {
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
      options.weekends.forEach((w, i) => {
        if (tm.getDay() === w) cell.classList.add('weekend', 'weekend_' + (i + 1))
      })
      let h = document.createElement('div')
      h.classList.add('cellHeader')

      let dateDom = document.createElement('div')
      dateDom.classList.add('cellDate')
      let dParts = new Intl.DateTimeFormat(this.locale, this.config.cellDateOptions).formatToParts(tm)
      let dateHTML = dParts.reduce((prev, cur, curIndex) => {
        prev = prev + `<span class="dateParts ${cur.type} seq_${curIndex}">${cur.value}</span>`
        return prev
      }, '')
      dateDom.innerHTML = dateHTML
      h.appendChild(dateDom)
      
      let workIconDom = document.createElement('div');
      // Attach click event listener
      workIconDom.addEventListener('click', (event) => {
          let clickedElement = event.target;
      
          let eventDetails = {
              id: clickedElement.dataset.id,
              title: clickedElement.dataset.title,
              startDate: clickedElement.dataset.startDate,
              endDate: clickedElement.dataset.endDate,
              location: clickedElement.dataset.location,
              description: clickedElement.dataset.description,
              calendarName: clickedElement.dataset.calendarName,
              allDay: clickedElement.dataset.fullDayEvent 
          };
      
          // Send the notification with event details
          this.sendNotification('EDIT_CALENDAR_EVENT', eventDetails);
          console.log("event details: " + clickedElement.dataset.id + eventDetails);
      });
	    h.appendChild(workIconDom);			
      
      if (this.config.displayCW) {
        let cwDom = document.createElement('div')
        cwDom.innerHTML = getWeekNo(tm, options)
        cwDom.classList.add('cw')
        if (tm.getDay() === startDayOfWeek) {
          cwDom.classList.add('cwFirst')
        }
        h.appendChild(cwDom)
      }

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

      // Create button to add event 
      let btn = document.createElement('button');
      btn.className = 'eventButton';
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        let payload = { date: tm };
        this.sendNotification('BUTTON_CLICKED', payload);
      });

      // Add the button to the cell header
      h.appendChild(btn);

      let b = document.createElement('div')
      b.classList.add('cellBody')

      let f = document.createElement('div')
      f.classList.add('cellFooter')

      cell.appendChild(h)
      cell.appendChild(b)
      cell.appendChild(f)
      return cell
    }

    const rangeCalendar = (moment, options) => {
      let boc, eoc
      switch (options.mode) {
        case 'day':
          boc = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate())
          eoc = new Date(boc.valueOf())
          eoc.setDate(boc.getDate() + 7 * this.weeksInView)
          eoc.setMilliseconds(-1)
          break
        case 'month':
          boc = getBeginOfWeek(new Date(moment.getFullYear(), moment.getMonth(), 1), options)
          eoc = getEndOfWeek(new Date(moment.getFullYear(), moment.getMonth() + 1, 0), options)
          break
        case 'week':
        default:
          boc = getBeginOfWeek(new Date(moment.getFullYear(), moment.getMonth(), moment.getDate()), options)
          eoc = getEndOfWeek(new Date(boc.getFullYear(), boc.getMonth(), boc.getDate() + (7 * (options.weeksInView - 1))), options)
          break
      }
      return { boc, eoc }
    }

    const makeDayHeaderDom = (dom, options, range) => {
      let wm = new Date(range.boc.valueOf())
      let dayDom = document.createElement('div')
      dayDom.classList.add('headerContainer', 'weekGrid')
      for (i = 0; i < 7; i++) {
        let dm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + i)
        let day = (dm.getDay() + 7) % 7
        let dDom = document.createElement('div')
        dDom.classList.add('weekday', 'weekday_' + day)
        options.weekends.forEach((w, i) => {
          if (day === w) dDom.classList.add('weekend', 'weekend_' + (i + 1))
        })
        dDom.innerHTML = new Intl.DateTimeFormat(options.locale, options.headerWeekDayOptions).format(dm)
        dayDom.appendChild(dDom)
      }

      dom.appendChild(dayDom)
    }

    const makeWeekGridDom = (dom, options, events, range) => {
      let wm = new Date(range.boc.valueOf())
      let newYearRollover = 0      
      do {
        let wDom = document.createElement('div')
        wDom.classList.add('week')
        let currentWeek = getWeekNo(wm,options)

        //first iteration
        if (this.thisWeek === undefined) {
          //original this week index is always the same offset
          this.thisWeek = currentWeek - this.originalConfig.weekIndex;
          //assign the rollover based on this week and the shortenIndex offeset
          (this.thisWeek > (52 - options.shortenIndex)) ? newYearRollover = 52 : newYearRollover = 0
        }

        let weekMax = options.maxEventLines

        //show less for weeks outside of this week + shorten index
        //this week moves with calendar swipe
        if (options.showLess) {
          //use temp so weekNo is not affected
          let tempWeekNumber = currentWeek
          //handle the rollover dec-jan for week numbers
          if ((tempWeekNumber - this.originalConfig.weekIndex) - (this.thisWeek) < 0) {
            tempWeekNumber = currentWeek + newYearRollover;
          }
          if ((tempWeekNumber - this.thisWeek) > options.shortenIndex ){
            weekMax = options.futureMaxEventLines
            wDom.style.setProperty('--maxeventlines', weekMax)
          }
          if ((tempWeekNumber - this.thisWeek) < 0 ){
            weekMax = options.futureMaxEventLines
            wDom.style.setProperty('--maxeventlines', weekMax)
          }        
        }

        wDom.dataset.weekNo = currentWeek        
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
          if (options.skipPassedEventToday) {
            if (event.today && event.isPassed && !event.isFullday && !event.isMultiday && !event.isCurrent) event.skip = true
          }
          if (event?.skip) continue

          let eDom = renderEventAgenda(event, options, moment)
          Log.debug("renderEventAgenda edom:", eDom);
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

          if (event?.noMarquee || event?.isPassed) {
            eDom.dataset.noMarquee = true
          } else {
            eDom.dataset.noMarquee = false
          }

          if (event?.skip) {
            eDom.dataset.skip = true
          }

          if (popoverSupported) {
            if (!eDom.id) eDom.id = eDom.dataset.calendarSeq + '_' + eDom.dataset.startDate + '_' + eDom.dataset.endDate + '_' + new Date().getTime()
            eDom.dataset.popoverble = true
            eDom.onclick = (ev) => {
              this.eventPopover(eDom)
            }
          }

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
          if (typeof options.manipulateDateCell === 'function') {
            options.manipulateDateCell(dateCell, thatDayEvents)
          }

          if (options.showMore) {
            const skipped = thatDayEvents.filter(ev => ev.skip).length
            const noskip = thatDayEvents.length - skipped
            const noskipButOverflowed = (noskip > this.newMax) ? noskip - weekMax : 0
            const hidden = skipped + noskipButOverflowed
            if (hidden) {
              dateCell.classList.add('hasMore')
              dateCell.style.setProperty('--more', hidden)
            }
          }

          if (popoverSupported) {
            if (!dateCell.id) dateCell.id = dateCell.dataset.date + '_' + new Date().getTime()
            dateCell.dataset.popoverble = true
            dateCell.onclick = (ev) => {
              this.dayPopover(dateCell, thatDayEvents, config)
            }
          }
        }

        wDom.appendChild(ccDom)
        wDom.appendChild(ecDom)

        dom.appendChild(wDom)
        wm = new Date(wm.getFullYear(), wm.getMonth(), wm.getDate() + 7)
      } while(wm.valueOf() <= eoc.valueOf())
      //reset thisWeek value so that first iteration fires again when the calendar is swiped
      this.thisWeek = undefined
    }
    let moment = this.getMoment(options, 0)
    let { boc, eoc } = rangeCalendar(moment, options)
    const targetEvents = prepareEvents({
      targetEvents: regularizeEvents({
        eventPool: this.eventPool,
        config: options,
      }),
      config: options,
      range: [boc, eoc],
    })
    makeDayHeaderDom(dom, options, { boc, eoc })
    makeWeekGridDom(dom, options, targetEvents, { boc, eoc })
    if (options.displayLegend) displayLegend(dom, targetEvents, options)
    return dom
  },

  getHeader: function () {
    if (this.activeConfig.mode === 'month') {
      let moment = this.getMoment(this.activeConfig, this.originalConfig.monthIndex)
      return new Intl.DateTimeFormat(this.activeConfig.locale, this.activeConfig.headerTitleOptions).format(new Date(moment.valueOf()))  + "&nbsp;&nbsp;&nbsp" + moment.getFullYear()
    }
    if (this.activeConfig.mode === 'week') {
      let moment = this.getMoment(this.activeConfig, this.originalConfig.weekIndex) 
      return new Intl.DateTimeFormat(this.activeConfig.locale, this.activeConfig.headerTitleOptions).format(new Date(moment.valueOf()))  + "&nbsp;&nbsp;&nbsp;" + moment.getFullYear()
    }
    return this.data.header
  },

  updateAnimate: function () {
    logCE("updateAnimate");    
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
