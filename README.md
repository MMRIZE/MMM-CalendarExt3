# MMM-CalendarExt3
MagicMirror module for calendar view.


## Screenshot
![screenshot](https://raw.githubusercontent.com/MMRIZE/public_ext_storage/main/MMM-CalendarExt3/calendarext3.png)



## Concept

My previous module, `MMM-CalendarExt2`, was always notorious for its difficulty to use. I need a more easy and light one. So I re-write this from scratch newly.


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
### Install
```sh
cd ~/MagicMirror/modules
git clone https://github.com/MMRIZE/MMM-CalendarExt3
cd MMM-CalendarExt3
npm install
git submodule update --init --recursive

```

> Usually, the last line is needless because it would be executed automatically in `npm install` , but many people forgot to execute `npm install`, so I'm exaggarating.

### Update
```sh
cd ~/MagicMirror/modules/MMM-CalendarExt3
git pull
npm update
```

### Not working?
When some `submodule` seems not installed and updated properly, try this.
```sh
cd ~/MagicMirror/modules/MMM-CalendarExt3
git submodule update --init --recursive
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
|`referenceDate` | null | If `null`, the reference moment would be now(today, this week, this month). <br>Or you can assign any valid ISO-8601/RFC-2822(limited) date and time format. <br>(e.g.) `"2024-12-25"`, "2024-10-10T14:48:00.000+09:00" or "01 Jun 2016"(some browser wmay not support this RFC-2822 format)|
|`monthIndex`| 0 | Which month starts in a `month` view. `-1` is the previous month of the current focusing moment. `0` is the focusing month of the moment. `1` will be the next month, and so on. <br> Ignored on `mode:'week'` and `mode:'day'`.|
|`weekIndex`| -1 | Which week starts in a `week` view. `-1` is the previous week of the current focusing moment. `0` is the focusing week of the moment. `1` will be the next week, and so on.<br>Ignored on `mode:'month'` and `mode:'week'`.|
|`dayIndex` | -1 | Which day starts in a `day` view. `-1` is the previous day of the current focusing moment, `0` is the focusing day of the moment. `1` will be the next day, and so on.<br> Ignored on `mode:'month'` and `mode:'week'`.|
|`weeksInView` | 3 | How many weeks from the index. <br> `weekIndex:-1`, `weeksInView:3` means 3 weeks view from the last week. <br> Ignored on `mode:'month'`|
|`instanceId` | (auto-generated) | When you want more than 1 instance of this module, each instance would need this value to distinguish each other. If you don't assign this property, the `identifier` of the module instance will be assigned automatically but not recommended to use it. (Hard to guess the auto-assigned value.)|
|`locale` | (`language` of MM config) | `de` or `ko-KR` or `ja-Jpan-JP-u-ca-japanese-hc-h12`. It defines how to handle and display your date-time values by the locale. When omitted, the default `language` config value of MM. |
|`calendarSet` | [] | When you want to display only selected calendars, fulfil this array with the targeted calendar name(of the default `calendar` module). <br>e.g) `calendarSet: ['us_holiday', 'office'],`<br> `[]` or `null` will allow all the calendars. |
|`fontSize` | '18px' | Default font size of this module. |
|`eventHeight` | '22px' | The height of each event. |
|`cellDateOptions` | {month: 'short', <br>day: 'numeric'} | The format of day cell date. It varies by the `locale` and this option. <br>`locale:'en-US'`, the default displaying will be `Jun 1` or `1`. <br> See [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) |
|`eventTimeOptions` | {timeStyle: 'short'} | The format of event time. It varies by the `locale` and this option. <br> `locale:'en-US'`, the default displaying will be `3:45 pm`.<br> See [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) |
|`headerWeekDayOptions`|{weekday: 'long'} | The format of weekday header. It varies by the `locale` and this option. <br> `locale:'en-US'`, the default displaying will be `Tuesday`.<br> See [options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) |
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
|`popoverTimeout`| 30000 | (ms) The popover has `light dismiss` but for the convenience, I added timeout dismission. <br>`0` will not dismiss popover forever unless other popover activated or you dismiss popover by click outside manually |
|`animateIn` | 'fadeIn' | Animation effect on refresh. (Since MM 2.25) |
|`animateOut` | 'fadeOut' | Animation effect on refresh. (Since MM 2.25) |
|`skipPassedEventToday`| false | If set `true`, the passed singleday events (not fullday, not multiday events) of today will be disappeard to save screen asset. It will be useful when you have too many events to show in `maxEventLines`. It will be applied only for `today`.|
|`showMore` | true | When the number of events is more than `maxEventLines`, the number of overflowed events would be displayed in the right-bottom cornor of the cell. And also it will popover whole day event list by click/touch it.|
|`useIconify` | false | If set `true`, You can use `iconify-icon` instead of `fontawesome`. |
|`weekends` | auto-filled by locale. |(Array of day order). e.g. `weekends: [1, 3]` means Monday and Wedneseday would be regarded as weekends. Usually you don't have to set this value. <br> **Auto-filled by locale unless you set manually.** |
|`firstDayOfWeek`| auto-filled by locale | Monday is the first day of the week according to the international standard ISO 8601, but in the US, Canada, Japan and some cultures, it's counted as the second day of the week. If you want to start the week from Monday, set this property to `1`. If you want Sunday, set `0`. <br> Sunday:0, Monday:1, Tuesday:2, ..., Saturday:6 <br> **Auto-filled by locale unless you set manually.** |
|`minimalDaysOfNewYear` | auto-filled by locale | ISO 8601 also says **each week's year is the Gregorian year in which the Thursday falls**. The first week of the year, hence, always contains 4 January. However, the US (Yes, it is.) system differs from standards. In the US, **containing 1 January** defines the first week. In that case, set this value to `1`. And under some other culture, you might need to modify this. <br> **Auto-filled by locale unless you set manually.** |
|`useMarquee`| false | On `true`, if the title of event is too long to display, it will have marquee animation. |
|`skipDuplicated` | true | On `true`, duplicated events(same title, same start/end) from any calendars will be skipped except one. |
|`customHeader` | false | See `customHeader` section.
|`headerTitleOptions`|{month: 'long'} | The format of header of the view. It varies by the `locale` and this option. <br> `locale:'en-US'`, the default displaying will be `December`. See `customHeader` section. (Since 1.9.0, behaviour changed.) |
|`maxEventLines` | 5 | How many events will be displayed in 1-day cell. The overflowed events will be hidden. <br> (Since 1.9.0) This value could be an array or an object define multi value for week the rows of the calendar. See the `dynamic eventlines` part.|


## Notification
### Incoming Notifications
#### **(deprecated)** `CX3_MOVE_CALENDAR`, payload: {instanceId, step}
#### **(deprecated)** `CX3_GLANCE_CALENDAR`, payload: {instanceId, step}
#### **(deprecated)** `CX3_SET_DATE`, payload: {instanceId, date}

> Since 1.8.0 the structure of module's notification is changed. Instead of CX3_GLANCE_CALENDAR, use belows;

#### `CX3_GET_CONFIG`, payload: { callback, instanceId? }
Get current config properties.
```js
this.sendNotification('CX3_GET_CONFIG', {
  instanceId: 'OFFICE_CALENDAR', // If you have only one instance of this module, you don't need to describe it.
  callback: (current) => {
    console.log(current.mode, current.monthIndex)
  }
})
```


#### `CX3_SET_CONFIG`, payload: { ...configProperties, callback }
Set/merge new config properties to the current view.
```js
this.sendNotification('CX3_SET_CONFIG', {
  referenceDate: "2024-12-25",
  mode: "week",
  weekIndex: 0,
  weeksInView: 1,
  calendarSet: ["work", "family"],
})
```
> This notification order to show the 1 week view of 2024 Christmas week regardless of whatever current view. Unmentioned properties would be inherited from the current view config.

#### `CX3_RESET`, payload: { callback, instanceId? }
Reset the view with the original config values.
```js
this.sendNotification('CX3_GET_CONFIG', {
  callback: (before) => {
    this.sendNotification('CX3_SET_CONFIG', {
      monthIndex: before.monthIndex + 1,
      callback: (after) => {
        setTimeout(() => { this.sendNotification('CX3_RESET') }, 10_000)
      }
    })
  }
})
```
> this example shows how to make **dynamic glancing of next month view.**

#### `CALENDAR_EVENTS`
Any module which can emit this notification could become the source of this module. Generally, the default `calendar` module would be.

#### `WEATHER_UPDATED`
Any module which can emit this notification could become the source of weather forecasting. Generally, the default `weather` module would be.

### Outgoing Notification
#### `CX3_DOM_UPDATED`, payload: { instanceId }
This notification will be broadcasted when the DOM of this module is re-rendered.

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
The most commonly used values would be defined in the `.CX3` selector as variables.

`--fontsize`, `--maxeventlines`, `--eventheight` would be imported from configuration for your setup convenience.

- `.cell` : Each day cell has this selector. Each cell could have these class names together by its condition.
  - `.today`, `.thisMonth`, `.thisYear`
  - `.year_2022`, `.month_12`, `.date_25`, `.weekday_0`, `weekend`, `weekend_1`
- `.cellHeader`, `.cellFooter` : Parts of day cell. `.cellHeader` would have `.cw`(count of week) and `.cellDate` as children.
  - `.cellHeader .cellDate` : Displaying the date of the cell. The date would have many parts of date/hour information from `cellDateOptions` of config.

- `.event` : Every event has this selector. Each event could have these class names together by its condition.
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

Each event component would be shown/hidden by the virtues of events. Of course, you can redeclare its behaviors with CSS.


- `.weekGrid`, `.weekGridRow` : Definition of calendar grid. You can adjust the grid itself. (e.g. Shrink the width of weekend cells)

### customHeader (Since 1.9.0)
- `customHeader: false` (The same behaviour to the previous.)
  - When the module's header is undefined or an empty text, the module header will have the name of the month(or defined as `headerTitleOptions`) in `mode: month` view. In other mode, nothing will be shown.
  - When the module's header has some text, that text will be shown as a header title of the module.
- `customHeader: true`
  - Regardless of the module header, a new section to display title of the view above the week day header.
  - `headerTitleOptions` would be used;
    - **IMPORTANT** The default `headerTitleOptions` for `mode: "month"` view. If you are using `day` or `week` view, adjust the value for your purpose.
      - Example for `month`: `headerTitleOptions: { month: "long" },` => **October**
      - Example for `day` or `week` : `headerTitleOptions: { year: "numeric", month: "short", day: "numeric" },` => **2.-15. Oct. 2024**
      - (The result will be different by the locale you use)
  - See [options for the date format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters)
- `customHeader: (config, beginOfCalendar, endOfCalendar) => { return TextOrHTML }`
  - You can also use custom callback function to make your own header.
  - Parameters
    - `config`: (**Object**) current active configuration object of the view.
    - `beginOfCalendar` : (**Date Object**) the date object of the begin of the current calendar view.
    - `endOfCalendar` : (**Date Object**) the date object of the end of the current calendar view.
  - Return
    - Text or HTML to be shown should be returned.
- This newly created header will be `<h1 class="headerTitle>...</h1>`, so you can style with that CSS Selector.

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
  "isMultiday": false,
  "skip": false, // If this is set, event will not be rendered. (since 1.7.0)
  "noMarquee" : false,  // If this is set as true, too long event tilte will be rolling.
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

1) if the title of an event has "test", drop the event off

2) then add 2 hours to the start time of events on the specific calendar.

Unlike eventTransformer, the preProcessor would be applied to raw data format of events from the default calendar module or equivalent after receiving notification.

This is the better place to adjust the event itself to make it compatible with this module before the main logic of the module handle and regularize events.

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

### skip to draw
if an `evnet` has `.skip: true` attribute as a property, this event will not be rendered on the screen. However, it will remain in the data, so you can sort, filter or use that event. It will be especially useful in your custom `manipulateDateCell`.

For example; [you can paint a date cell background instead of showing a holiday event itself.](https://github.com/MMRIZE/MMM-CalendarExt3/wiki/Set-cell-background-instead-of-holiday-event), Or you can skip less-important events to save real-estate.

Generally, this attribute will not derived from the original calendar provider(e.g. default calendar module). You may need to assign the value by yourself with event-handling.

### using `iconify`.
Even though `fontawesome` is the default icon framework of MM, there are many needs of `iconify`. And I prefer it to font-awesome. Now you can use iconify icons by config value `useIconify: true`
```js
// In your calendar module config
defaultSymbolClassName: '', // <-- Important to identify iconify properly.
calendars: [
  {
    color: "red",
    symbol: "flag:us-4x3",
    url: "https://ics.calendarlabs.com/76/mm3137/US_Holidays.ics"
  },
  {
    color: "red",
    symbol: "fa fa-fw fa-flag",
    url: "https://ics.calendarlabs.com/76/mm3137/US_Holidays.ics"
  },
],
```

![image](https://github.com/MMRIZE/MMM-CalendarExt3/assets/1720610/6b46cf68-a04b-4733-aab6-a14404543e73)

**WARNING**
To use `iconify`, you should set `defaultSymbolClassName: '',` in your default calendar module. Usually, it is enough when you hide the original default calendar module to use with CX3. But if you want to use font-awesome icons together, you should add font-awesome class names (e.g `fa`, `fas`, ...) by yourself.

### `referenceDate` and `XXXindex` (since 1.8.0)
To specify the range of the calendar to be displayed, two elements can be used:

- `referenceDate`: The date that serves as the basis for the displayed calendar. If set to null or omitted, it defaults to the moment of now (today). If specified separately, it is used as the reference date.
= `monthIndex`, `weekIndex`, `dayIndex`: Specifies how much period before and after the reference date should be displayed in each view mode, with the reference date as the center.

For example;
```js
mode: "month",
referenceDate: "2024-12-25",
monthIndex: -1,
```
Will show the monthly calendar for `2024 November`.
> Your events provider(e.g. default calendar module) may need to serve enough events to display long-gapped period.


### dynamic maxEventLines by rows-of-weeks of the calendar (since 1.9.0)
Because each month may have a differnt rows(4, 5, 6) of the weeks, it is difficult to adjust the total height of the view with fixed `maxEventLines`.

Now `maxEventLines` could be an array or an object to define the different value by the weeks row.
- `maxEventLines: line` : When the value is fixed integer number, all the view has the same `maxEventLines`.
- `maxEventLines: [line, line, line, ...]` : (**zero-based array**) The first item(`maxEventLines[0]`) would imply the default value. From the next, the order of the value would be number of rows.
  - **Example** `maxEventLines: [2, 6, 5, 4, 3, 2]` : When the view has 1 weeks-rows, the `maxEventLines` would be **6**. When the view has 3 weeks-rows, the value would be **4**. When the view has 10 weeks-rows, the `maxEventLines` would be `2` because the default value is **2**
- `maxEventLines: { row: line, row: line, ... }` : You can define specific rows only. rowIndex `0` would become the default value.
  - **Example** `maxEventLines: { 0: 4, 5:3 }`: When the view has 5 weeks-rows, the value would be **3**. In other cases, the value would be **4** in all other views.

And the module content would have additional CSS selector to get the information of the current view.
```html
<div class="CX3 ..." data-mode="week" data-max-event-lines="3" ...>
```
So you can adjust the view more detailly.
```css
.CX3[data-max-event-lines="6"] {
  font-size: calc(var(--font-size) * 0.9); /* This is just a sample. The real applying would be more complex. */
  ...
}
```


### Weather forecast
When you are using MM's default `weather` forecasting, the weather icon will be displayed on the day cell.
```js
useWeather: true,
weatherLocationName: 'New York',
// Original weather module might have its location name with more details. (e.g. 'New York City, US'), but the partial text included would be acceptable for this attribute.
// When the location name would not match, warning messgage will be shown on dev console. Check it.
```



## Not the bug, but...
- The default `calendar` module cannot emit the exact starting time of `multidays-fullday-event which is passing current moment`. Always it starts from today despite of original event starting time. So this module displays these kinds of multidays-fullday-event weirdly.
- I'll add <del>`TimeLine`</del>([MMM-CalendarExt3Timeline](https://github.com/MMRIZE/MMM-CalendarExt3Timeline) and `TimeTable` views/extended modules in future.

## Latest Updates
### 1.9.4 (2024-12-26)
- **ADDED** : outgoing notification `CX3_DOM_UPDATED` with payload `{ instanceId }`
- **FIXED** : logical bug on counting weeks in the December


> [Full History](https://github.com/MMRIZE/MMM-CalendarExt3/wiki#history)

## More Info.
- Discussion board: https://github.com/MMRIZE/MMM-CalendarExt3/discussions
- Bug Report: https://github.com/MMRIZE/MMM-CalendarExt3/issues
- Examples, Tips, and other info WIKI: https://github.com/MMRIZE/MMM-CalendarExt3/wiki

## Siblings
- [MMM-CalendarExt3](https://github.com/MMRIZE/MMM-CalendarExt3)
- [MMM-CalendarExt3Agenda](https://github.com/MMRIZE/MMM-CalendarExt3Agenda)
- [MMM-CalendarExt3Timeline](https://github.com/MMRIZE/MMM-CalendarExt3Timeline)
- [MMM-CalendarExt3Journal](https://github.com/MMRIZE/MMM-CalendarExt3Journal)


## Author
- Seongnoh Yi (eouia0819@gmail.com)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y56IFLK)
