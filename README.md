# MMM-CalendarExt3
MagicMirror module for calendar view.

> `~1.3` has many changes from `1.2.x` and still beta staged. If you want to use the old version, checkout `snap-1.2.6` branch


## Screenshot
![screenshot](https://raw.githubusercontent.com/MMRIZE/public_ext_storage/main/MMM-CalendarExt3/calendarext3.png)



## Concept

My previous module, `MMM-CalendarExt2`, was always notorious for its difficulty to use. I need a more easy and light one. So I rewrite this from scratch newly. 


## Features
### What's different with `CX2`.
- Only focusing on how it shows; Parsing is delegated to original MagicMirror module `calendar`. (It means the `calendar` module is REQUIRED to use this module.)
- Only `week` and `month` views. I found that people are rarely interested in other views on `CX2`. So I drop out different views.
- Respect to original MM's hide/show mechanism. Now you can hide/show this module easily with other scheduler or control modules. (By the way, Look at this module also. - [MMM-Scenes](https://github.com/MMRIZE/MMM-Scenes))
- No dependency on the 3rd party modules (e.g. momentJS or Luxon, etc.). This is built with pure JS and CSS only.

### Main Features
- `week` view or `month` view
- locale-aware calendar
- customizing events: filtering, sorting, transforming
- multi-instance available. You don't need to copy and rename the module. Just add one more configuration in your `config.js`.


## Install OR Update
```sh
cd ~/MagicMirror/modules
git clone https://github.com/MMRIZE/MMM-CalendarExt3
npm install
git submodule update --init --recursive
```
> Usually, the last line is needless because it would be executed automatically in `npm install` , but many people forgot to execute `npm install`, so I'm exaggarating.

When some `submodule` seems not installed and updated properly, try this.
```sh
cd ~/MagicMirror/modules/MMM-CalendarExt3
git submodule update --init --recursive
```

If you want to return to `1.2.6` version,
```sh
cd ~/MagicMirror/modules/MMM-CalendarExt3
git checkout snap-1.2.6
```

## Config
Anyway, even this simplest will work.
```js
{
  module: "MMM-CalendarExt3",
  position: "bottom_bar",
},

```

More conventional;
```js
{
  module: "MMM-CalendarExt3",
  position: "bottom_bar",
  title: "",
  config: {
    mode: "month",
    instanceId: "basicCalendar",
    locale: 'de-DE',
    maxEventLines: 5,
    firstDayOfWeek: 1,
    calendarSet: ['us_holiday', 'abfall', 'mytest'],
    ...
  }
},
```

You need setup default `calendar` configuration also.
```js
/* default/calendar module configuration */
{
  module: "calendar",
  position: "top_left",
  config: {
    broadcastPastEvents: true, // <= IMPORTANT to see past events
    calendars: [
      {
        url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics",
        name: "us_holiday", // <= RECOMMENDED to assign name
        color: "red" // <= RECOMMENDED to assign color
      },
      ...

```

### Config details
All the properties are omittable, and if omitted, a default value will be applied.

|**property**|**default**|**description**|
|---|---|---|
|`mode`| 'week' | Calendar view type. You can choose between 'week', 'month', 'day'|
|`weekIndex`| -1 | Which week starts in a `week` view. `-1` is the previous week of the current focusing moment. `0` is the focusing week of the moment. `1` will be the next week, and so on.<br>Ignored on `mode:'month'` and `mode:'week'`.|
|`dayIndex` | -1 | Which day starts in a `day` view. `-1` is the previous day of the current focusing moment, `0` is the focusing day of the moment. `1` will be the next day, and so on.<br> Ignored on `mode:'month'` and `mode:'week'`.|
|`weeksInView` | 3 | How many weeks from the index. <br> `weekIndex:-1`, `weeksInView:3` means 3 weeks view from the last week. <br> Ignored on `mode:'month'`|
|`instanceId` | (auto-generated) | When you want more than 1 instance of this module, each instance would need this value to distinguish each other. If you don't assign this property, the `identifier` of the module instance will be assigned automatically but not recommended to use it. (Hard to guess the auto-assigned value.)|
|`firstDayOfWeek`| 1 | Monday is the first day of the week according to the international standard ISO 8601, but in the US, Canada, Japan and some cultures, it's counted as the second day of the week. If you want to start the week from Monday, set this property to `1`. If you want Sunday, set `0`. <br> Sunday:0, Monday:1, Tuesday:2, ..., Saturday:6 |
|`minimalDaysOfNewYear` | 4 | ISO 8601 also says **each week's year is the Gregorian year in which the Thursday falls**. The first week of the year, hence, always contains 4 January. However, the US (Yes, it is.) system differs from standards. In the US, **containing 1 January** defines the first week. In that case, set this value to `1`. And under some other culture, you might need to modify this. |
|`locale` | (`language` of MM config) | `de` or `ko-KR` or `ja-Jpan-JP-u-ca-japanese-hc-h12`. It defines how to handle and display your date-time values by the locale. When omitted, the default `language` config value of MM. |
|`calendarSet` | [] | When you want to display only selected calendars, fulfil this array with the targeted calendar name(of the default `calendar` module). <br>e.g) `calendarSet: ['us_holiday', 'office'],`<br> `[]` or `null` will allow all the calendars. |
|`maxEventLines` | 5 | How many events will be displayed in 1-day cell. The overflowed events will be hidden. |
|`fontSize` | '18px' | Default font size of this module. |
|`eventHeight` | '22px' | The height of each event. |
|`cellDateOptions` | {month: 'short', <br>day: 'numeric'} | The format of day cell date. It varies by the `locale` and this option. <br>`locale:'en-US'`, the default displaying will be `Jun 1` or `1`. <br> See [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) | 
|`eventTimeOptions` | {timeStyle: 'short'} | The format of event time. It varies by the `locale` and this option. <br> `locale:'en-US'`, the default displaying will be `3:45 pm`.<br> See [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) | 
|`headerWeekDayOptions`|{weekday: 'long'} | The format of weekday header. It varies by the `locale` and this option. <br> `locale:'en-US'`, the default displaying will be `Tuesday`.<br> See [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) |
|`headerTitleOptions`|{month: 'long'} | The format of module header of the month view. It varies by the `locale` and this option. <br> `locale:'en-US'`, the default displaying will be `December`. In `mode:'week'`, this will be ignored.<br> See [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) |
|`eventFilter`| callback function | See the `Filtering` part.|
|`eventSorter`| callback function | See the `Sorting` part.|
|`eventTransformer`| callback function | See the `Transforming` part.|
|`waitFetch`| 5000 | (ms) waiting the fetching of last calendar to prevent flickering view by too frequent fetching. |
|`refreshInterval`| 1800000 | (ms) refresh view by force if you need it. |
|`animationSpeed` | 1000 | (ms) Refreshing the view smoothly. |
|`useSymbol` | true | Whether to show font-awesome symbold instead of simple dot icon. |
|`displayLegend` | false | If you set as true, legend will be displayed. (Only the clanear which has name assigned)|
|`eventNotification`| 'CALENDAR_EVENTS' | A carrier notification of event source.|
|`eventPayload` | callback function | A converter for event payload before using it.|
|`useWeather` | true | Whether to show forecasted weather information of default weather module. |
|`weatherLocationName` | null | When you have multi forecasting instances of several locations, you can describe specific weather location to show. |
|`weatherNotification`| 'WEATHER_UPDATED' | A carrier notification of weather forecasting source |
|`weatherPayload` | callback function | A converter for weather foracasting payload before using it. |
|`displayWeatherTemp` | false | If you want to show the temperature of the forecasting, set this to `true`|
|`preProcessor` | callback function | See the `preProcessing` part. |
|`manipulateDateCell` | callback function | See the `manipulating dateCell` part. |
|`displayEndTime`| false | If you want to show the end time of the event, set this to `true`|
|`popoverTemplate`| './popover.html' | If you want to change the template of popover, use this. (Usually not needed) |
|`popoverPeriodOptions`| {timeStyle: 'short', dateStyle: 'short'} | The format of period of event time on popover displayed,<br> It varies by the `locale` and the period itself how consisted. <br> See [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) |
|`popoverTimeout`| 5000 | (ms) The popover has `light dismiss` but for the convenience, I added timeout dismission. <br>`0` will not dismiss popover forever unless other popover activated or you dismiss popover by click outside manually |



## Notification
### Incoming Notifications
#### **(deprecated)** `CX3_MOVE_CALENDAR`, payload: {instanceId, step} 
#### `CX3_GLANCE_CALENDAR`, payload: {instanceId, step} 
Jump calendar view to another moment. It will return after `refreshInterval` from last notification command.
- `instanceId` : If you have more than 1 instance of this module, you can specify the instance to manipulate. If omitted or `null`, all instances would obey this notification order. 
- `step` : How many leaps of the current view. In `mode:'week'` 1 step will be a week. In `mode:'month'` 1 step will be a month. Negative value is allowed.

#### `CX3_SET_DATE`, payload: {instanceId, date}
Set the date of specific view. 
- `instanceId` : See the above
- `date` : Specific date to move. e.g) In `mode:'month'`, `date: "2022-12-25"` would display calendar view of `2022 Decemeber`. Be aware of `weekIndex` of `mode:'week'`. The view range will be calculated with `weekIndex`, `weeksInView` and this value.

#### `CX3_RESET`
Return to the default view instantly. (no payload)

#### `CALENDAR_EVENTS`
Any module which can emit this notification could become the source of this module. Generally, the default `calendar` module would be.

#### `WEATHER_UPDATED`
Any module which can emit this notification could become the source of weather forecasting. Generally, the default `weather` module would be.

### Outgoing Notification
Nothing yet.  (Does it need?)

## Styling with CSS
You can handle almost all of the visual things with CSS. See the `module.css` and override your needs into your `custom.css`.
- `CX3`, `CX3_{instanceId}`, `mode_week` or `mode_month` : The root selector. Each instance of this module will have `CX3_{instanceId}` as another root selector. With this CSS selector, you can assign individual look to each instance.
```css
.CX3 {
  /* you CAN modify these values; but SHOULD NOT to remove */
  --celllinecolor: #333;
  --cellbgcolor: rgba(0, 0, 0, 0.2);
  --cellheaderheight: 25px;
  --cellfooterheight: 2px;
  --defaultcolor: #FFF;
  --eventheight: calc(var(--fontsize) + 4px);
  --totalheight: calc(var(--eventheight) * var(--maxeventlines));
  font-size: var(--fontsize);
  color: var(--defaultcolor);
  line-height: calc(var(--eventheight))
}
```
Most commonly used values would be defined in `.CX3` selector as variables. 

`--fontsize`, `--maxeventlines`, `--eventheight` would be imported from configuration for your setup convenience.

- `.cell` : Every day cell has this selector. Each cell could have these class name together by its condition.
  - `.today`, `.thisMonth`, `.thisYear`
  - `.year_2022`, `.month_12`, `.date_25`, `.weekday_0`
- `.cellHeader`, `.cellFooter` : Parts of day cell. `.cellHeader` would have `.cw`(count of week) and `.cellDate` as children.
  - `.cellHeader .cellDate` : Displaying date of the cell. The date would have many parts of date/hour information from `cellDateOptions` of config.

- `.event` : Every event has this selector. Each event could have these class name together by its condition.
  - `.continueFromPreviousWeek`, `.continueToNextWeek`
  - `.calendar_{calendarName}`, `{class}` : Orginal `calendar`
  - `.passed`, `.future`, `.current`, 
  - `.multiday`, `.singleday`, `.fullday`

And `event` also has `dataSet` (`data-*`) as its attributes. (e.g. data-title="...", data-start-date="...") You can use these attributes also.

  - `.event`
    - `.headline`
      - `.symbol`
      - `.time.startTime`
        - `.dateParts`
      - `.time.endTime`
        - `.dateParts`
      - `.title`
    - `.description`
    - `.location`

Each event component would be shown/hidden by the virtues of events. Of course, you can redeclare its behaviours with CSS.


- `.weekGrid`, `.weekGridRow` : Definition of calendar grid. You can adjust the grid itself. (e.g. Shrink the width of weekends cells)

## Handling Events
Each event object has this structure.
```json
{
  "title": "Leeds United - Chelsea",
  "startDate": 1650193200000,
  "endDate": 1650199500000,
  "fullDayEvent": false,
  "class": "PUBLIC",
  "location": false,
  "geo": false,
  "description": "...",
  "today": false,
  "symbol": ["calendar-alt"],
  "calendarName": "tottenham",
  "color": "gold",
  "calendarSeq": 1, // This would be the order from `calendarSet` of configuration
  "isPassed": true,
  "isCurrent": false,
  "isFuture": false,
  "isFullday": false,
  "isMultiday": false
}
```
You can use these values to handle events.

### Filtering
You can filter each event by its condition.
```js
eventFilter: (ev) => {
  if (ev.isFullday) return false
  return true
}
```
This example shows how you can filter out 'fullday' events.

### Sorting
You can sort each event by its condition. However, this module arranges events masonry with density. So displaying would not fit with your sorting intention. Anyway, try if you need it.
```js
eventSorter: (a, b) => {
  return a.calendarSeq - b.calendarSeq
}
```
This example tries to sort events by calendar order in `calendarSet`.

### Transforming
You can manipulate or change the properties of the event.
```js
eventTransformer: (ev) => {
  if (ev.title.search('John') > -1) ev.color = 'blue'
  return ev
}
```
This example shows how you can transform the color of events when the event title has specific text.

### eventPayload / weatherPayload
You can convert or transform the payload of incoming notification instantly before used in this module. It would be convenient when conversion or manipulating payload from uncompatible module.
```js
weatherPayload: (payload) => {
  if (Array.isArray(payload?.forecastArray)) {
    payload.forecastArray = payload.forecastArray.map((f) => {
      f.maxTemperature = Math.round(f.maxTemperature * 9 / 5 + 32)
      f.minTemperature = Math.round(f.minTemperature * 9 / 5 + 32)
      return f
    })
  }
  return payload
},
```
This example show how to transform Celcius temperature to Fahrenheit units. (Original default weather module has a bug to deliver Fahrenheit temperature of broadcasted forecasts.)
> `preProcessor` could be replaced with this `eventPayload` but for backward-compatibility I'll keep it for a while.

### preProcessing
```js
preProcessor: (ev) => {
  if (ev.title.includes('test')) return null
  if (ev.calendarName === 'Specific calendar') ev.startDate += 2 * 60 * 60 * 1000
  return ev
}
```
This example shows 

1) if the title of event has test, drop the event off

2) then add 2 hours to the start time of events on specific calendar.

Unlike eventTransformer, the preProcessor would be applied to raw data format of events from the default calendar module or equivalent after receiving notification. 

This is the better place to adjust event itself to make it compatible with this module before main logic of the module handle and regularize events.

### manipulating dateCell
```js
manipulateDateCell: (cellDom, events) => {
  if (Array.isArray(events) && events.some(e => e.calendarName === 'Holidays')) {
    let dateIcon = document.createElement('span')
    dateIcon.classList.add('fa', 'fa-fas', 'fa-fw', 'fa-gift')
    let header = cellDom.querySelector('.cellHeader')
    let celldate = header.querySelector('.cellDate')
    header.insertBefore(dateIcon, celldate)
    // you don't need to return anything.
  }
}
```
If you want to handle date cell with events of that day, you can use it.


## Fun things
### Weather forecast
When you are using MM's default `weather` forecasting, weather icon will be displayed on the day cell.
```js
useWeather: true,
weatherLocationName: 'New York',
// Original weather module might have its location name with more details. (e.g. 'New York City, US'), but the partial text included would be acceptable for this attribute.
// When the location name would not match, warning messgage will be shown on dev console. Check it.
```

### Font Awesome icons with brands
You can set `brands` icons like this; (However, default calendar module cannot accept FA brands icons AFAIK.)
```js
/* In your default calendar config */
symbol: ['fa-brands fa-canadian-maple-leaf'],
/* or */
symbol: ['brands canadian-maple-leaf'],
/* of course below are also allowed */
symbol: 'brands canadian-maple-leaf',
/* But if you want multi-icons, use array */
symbol: ['brands google-drive', 'solid calendar'],
```

### Compatible with `randomBrainstormer/MMM-GoogleCalendar`
```js
preProcessor: (e) => {
  if (e.start?.dateTime) {
          e.startDate = new Date(e.start.dateTime).valueOf()
  } else if (e.start?.date) {
          e.startDate = new Date(`${e.start.date}T00:00:00`).valueOf()
  }
  
  if (e.end?.dateTime) {
          e.endDate = new Date(e.end.dateTime).valueOf()
  } else if (e.end?.date) {
          e.endDate = new Date(`${e.end.date}T00:00:00`).valueOf()
  }
  
  e.title = e.summary
  e.fullDayEvent = (e.start?.date) ? true : false
  return e
}
```
> This tip doesn't consider different timezone. You might need to adjsut startDate and endDate additionally to convert event into your timezone if the timezone of the calendar might be different with your system.


### simple `eouia/MMM-TelegramBot` implementation
Add these codes into your `MMM-TelegramBot` configuration
```js
customCommands: [
  {
    command: 'cx3_prev',
    description: '[CX3] Glance previous step',
    callback: (commandj, handler, self) => {
      self.sendNotification('CX3_GLANCE_CALENDAR', {step: -1})
      handler.reply('TEXT', 'PREV 1 step ')
    }
  },
  {
    command: 'cx3_next',
    description: '[CX3] Glance next step',
    callback: (commandj, handler, self) => {
      self.sendNotification('CX3_GLANCE_CALENDAR', {step: 1})
      handler.reply('TEXT', 'NEXT 1 step')
    }
  },
  {
    command: 'cx3_set',
    description: '[CX3] Glance specific date: e.g) /cx3_set 2023-12-25',
    callback: (commandj, handler, self) => {
      self.sendNotification('CX3_SET_DATE', {date: handler.args})
      handler.reply('TEXT', 'SET to ' + handler.args)
    }
  },
  {
    command: 'cx3_reset',
    description: '[CX3] Return to default instantly'
    callback: (commandj, handler, self) => {
      self.sendNotification('CX3_RESET_DATE')
      handler.reply('TEXT', 'RESET')
    }
  }
],
```

## Not the bug, but...
- The default `calendar` module cannot emit the exact starting time of `multidays-fullday-event which is passing current moment`. Always it starts from today despite of original event starting time. So this module displays these kinds of multidays-fullday-event weirdly.
- I am not considering 5-weekdays-view at this moment. Only-Weekdays-view might be useful, but in some cultures/locales, Locale-aware `Weekdays` are not easy to normalize. Friday and Sunday are weekends in Brunei. Iran adopts Friday only. I cannot calculate any convenient way to normalize this kind of grid view.
- I'll add `TimeLine` and `TimeTable` views/extended modules in future.

## History

### 1.5.0 (2023-08-29)
- **ADDED** `day` view implemented. (calendar starts from today)

### 1.4.0 (2023-06-04)
![popover](https://raw.githubusercontent.com/MMRIZE/public_ext_storage/main/MMM-CalendarExt3/CX3_1.4.0.png)
- **ADDED** **(Experimental)** Show popover of event details on click/touch (Chrome 114 or Electron 25 needed)
> See https://github.com/MMRIZE/MMM-CalendarExt3/discussions/80
- **FIXED** Clarify code for using MMM-GoogleCalendar module #78 (Thanks to @jcherniak)
- **UPDATED** Updated CX3_Shared submodule #76 / More robust `oppositeColor` calculation. (Thanks to @btastic)

### 1.3.2 (2023-05-30)
- **CHANGED** : Not to be too strict to other module's DOM creation failure.
### 1.3.1 (2023-04-25)
- **CHANGED**: Refactoring some codes, the structure of the events, CSS.
- **ADDED**: `displayEndTime: true` => Show end time of the event. (hidden by default) (Requested from @zelmo)
- **ADDED**: `displayWeatherTemp: true` => Show max/min temperature of the forecasted days.
<img width="1637" alt="CX3_1 3 1" src="https://user-images.githubusercontent.com/1720610/235691244-0eb98d9b-0337-4855-9057-15a82fc6ca2e.png">


### 1.3.0 (2023-04-17)
- **CHANGED**: Shared library to fix many issues.
- **FIXED**: some typo.
- **FIXED**: flickering for many reasons (logic error to treat notifications)
- **ADDED**: `CX3_RESET` notification (to reset instantly from glancing)
- **ADDED**: `MMM-TelegramBot` user implementation example
- **ADDED**: `preProcessor` for better handling of raw-data priorly
- **ADDED**: `manipulateDateCell` to manipulate date cell DOM after drawing
- **CHANGED**: Timing of `eventFilter` and `eventTransformer` is delayed for better-handling event data after regularized

### 1.2.6 (2022-12-05)
- **Added** `useWeather` option. (true/false)
- **Added** `weatherLocationName` option (some partial text to distinguish location)

### 1.2.5 (2022-11-04)
- **Added** Display legend of the calendar (`displayLegend: true` and when you set the calendar name on `calendar` module)
- **Fixed** Some CSS fixture
### 1.2.4 (2022-08-30)
- **Fixed** Urgent fix for `useSymbol` issue since #1.2.2
- **Fixed** `symbol:null` issue resolved
### 1.2.3 (2022-08-29)
- **Fixed** Move `eventFormatter` to prior to get compatibility with other calendar module (e.g GoogleCalendar module)

### 1.2.2 (2022-08-27)
- **Added** Multi icons
- **Added** Font-awesome 'brands' icons
### 1.2.1 (2022-08-25)
- **Added** Magic opposite color for the full-day event (This feature could solve the issue of no-color assigned.)
- **Fixed** CSS file renamed (module.css => MMM-CalendarExt3.css)
### 1.2.0 (2022-06-15)
- Support multi notifications from multi-calendar providers. (It will prevent events reset.)

### 1.1.0 (2022-05-29)
- https://github.com/MMRIZE/MMM-CalendarExt3/issues/4
![1.1.0](https://raw.githubusercontent.com/MMRIZE/public_ext_storage/main/MMM-CalendarExt3/cx3_110_2.png)
### 1.0.0 (2022-04-24)
- Released.

## Author
- Seongnoh Yi (eouia0819@gmail.com)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y56IFLK)

