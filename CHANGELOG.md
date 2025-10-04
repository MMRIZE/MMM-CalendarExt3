# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.2](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.10.1...v1.10.2) - 2025-10-04

### Added

- chore: update dependabot schedule to quarterly for GitHub Actions and npm
- docs: add Code of Conduct
- feat: add comprehensive bug report template for improved issue tracking
- feat: add polyfill for Intl.Locale.getWeekInfo() to support Firefox compatibility

### Changed

- chore: reorder fields in package.json in the npm standard way
- chore: update devDependencies
- refactor: use getWeekInfo() instead of weekInfo (#237)

### Fixed

- chore: update CX3_Shared submodule with ensureString() fix

## [1.10.1](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.10.0...v1.10.1) - 2025-08-31

### Changed

- chore: add dependabot configuration for GitHub Actions and npm updates
- chore: update devDependencies
- chore: update subproject commit reference in CX3_Shared
- docs: format README and switch to `npm ci`

## Fixed

- fix: set `line-height` to prevent overflow of the icon number positioning (#224)

## [1.10.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.9.6...v1.10.0) - 2025-08-09

### Added

- chore: add "type" field to `package.json`
- feat: new option `showHeader` (#221)

### Changed

- chore: sort scripts in package.json for clarity
- chore: update devDependencies

## [1.9.6](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.9.5...v1.9.6) - 2025-07-25

### Changed

- chore: add changelog
- chore: remove unused CSS variable `--totalheight`
  This fixes issue [#217](https://github.com/MMRIZE/MMM-CalendarExt3/issues/217)
- chore: update devDependencies
- chore: update script command

## [1.9.5](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.9.4...v1.9.5) - 2025-07-20

- release 1.9.5 ([d33703e](https://github.com/MMRIZE/MMM-CalendarExt3/commit/d33703e))
- Merge pull request #218 from MMRIZE/1.9.5

## [1.9.4](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.9.3...v1.9.4) - 2024-12-26

- **ADDED** : outgoing notification `CX3_DOM_UPDATED` with payload `{ instanceId }`
- **FIXED** : logical bug on counting weeks in the December 

## [1.9.3](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.9.2...v1.9.3) - 2024-12-10

- **FIXED**: Date/Time format of the `popover` will respect the module's locale
- **CHANGED**: newer `CX3_Shared`

## [1.9.2](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.9.1...v1.9.2) - 2024-11-30

- **FIXED**: Urgent fix for popover of the event.

## [1.9.1](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.9.0...v1.9.1) - 2024-11-29

- **FIXED**: Checking `popover` feature properly. (#173)
- **FIXED**: Error on touch/click event on the wrong position.

## [1.9.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.8.3...v1.9.0) - 2024-09-25

- **ADDED** : Multi `maxEventLines` by number of weeks in the month.
- **ADDED** : CSS attribute for number of weeks
- **FIXED** : `eoc` bug on `mode: "day"`
- **ADDED** : `customHeader`
- **CHANGED** : behaviour of displaying `header`

## [1.8.3](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.8.2...v1.8.3) - 2024-04-28

- **FIXED** : MM's repeated singleday timezone issue
- **FIXED** : hide time on multiday-fullday event
- **UPDATED** : more stable CX3_Shared structure

## [1.8.2](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.8.1...v1.8.2) - 2024-04-08

- Merge pull request #141 from MMRIZE/dev-1.8.2

## [1.8.1](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.8.0...v1.8.1) - 2024-02-13

- **CHANGED** Customizable literal text on popover template (through CSS)

## [1.8.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.7.1...v1.8.0) - 2023-12-20

- **CHANGED** Some refactoring
- **CHANGED** Some behaviour for the usage of notifications to control the module.
- **REMOVED** `CX3_GLANCE_CALENDAR` notification was removed.
- **REMOVED** `CX3_SET_DATE` notification also was removed.
- **ADDED** `CX3_SET_CONFIG`, `CX3_GET_CONFIG`, `CX3_RESET` notifications are added, instead.
- **ADDED** config property `skipDuplicated` is added.
- **ADDED** config property `monthIndex` is added. Now you can assign relative month view from today or `referenceDate`
- **ADDED** config property `referenceDate` is added.

## [1.7.1](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.7.0...v1.7.1) - 2023-11-17

- **ADDED** `useMarquee` config filed and `noMarquee` event object property

## [1.7.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.6.1...v1.7.0) - 2023-11-13

See the notes. ([About 1.7.0](https://github.com/MMRIZE/MMM-CalendarExt3/wiki/About-1.7.0))
- **ADDED** `skip` of event Object property
- **ADDED** `skipPassedEventToday` of config
- **FIXED** eventTime color in multiday event
- **ADDED** end-eventTime of multiday event (if not fullday event)
- **ADDED** `more`, `morePopover` feature.
- **ADDED** Support `iconify`
- **ADDED** auto-detect `firstDayOfWeek` and `minimalDaysOfNewYear`

## [1.6.1](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.6.0...v1.6.1) - 2023-10-19

- **FIXED** A bug of missing events of last day in `day` view.

## [1.6.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.5.0...v1.6.0) - 2023-10-04

- **ADDED** `animateIn` and `animateOut` for animation effect (Since MM 2.25)
- **ADDED** A fallback of `HTMLElement` check. (For MMM-Remote-Control or Not-Browser environment)

## [1.5.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.4.0...v1.5.0) - 2023-08-29

- **ADDED** `day` view implemented. (calendar starts from today)

## [1.4.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.3.2...v1.4.0) - 2023-06-04

![popover](https://raw.githubusercontent.com/MMRIZE/public_ext_storage/main/MMM-CalendarExt3/CX3_1.4.0.png)
- **ADDED** **(Experimental)** Show popover of event details on click/touch (Chrome 114 or Electron 25 needed)
> See https://github.com/MMRIZE/MMM-CalendarExt3/discussions/80
- **FIXED** Clarify code for using MMM-GoogleCalendar module #78 (Thanks to @jcherniak)
- **UPDATED** Updated CX3_Shared submodule #76 / More robust `oppositeColor` calculation. (Thanks to @btastic)

## [1.3.2](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.3.1...v1.3.2) - 2023-05-30

- **CHANGED** : Not to be too strict to other module's DOM creation failure.

## [1.3.1](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.3.0b...v1.3.1) - 2023-05-02

- **CHANGED**: Refactoring some codes, the structure of the events, CSS.
- **ADDED**: `displayEndTime: true` => Show end time of the event. (hidden by default) (Requested from @zelmo)
- **ADDED**: `displayWeatherTemp: true` => Show max/min temperature of the forecasted days.
<img width="1637" alt="CX3_1 3 1" src="https://user-images.githubusercontent.com/1720610/235691244-0eb98d9b-0337-4855-9057-15a82fc6ca2e.png">

## [1.3.0b](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.2.6...v1.3.0b) - 2023-04-17

- **CHANGED**: Shared library to fix many issues.
- **FIXED**: some typo.
- **FIXED**: flickering for many reasons (logic error to treat notifications)
- **ADDED**: `CX3_RESET` notification (to reset instantly from glancing)
- **ADDED**: `MMM-TelegramBot` user implementation example
- **ADDED**: `preProcessor` for better handling of raw-data priorly
- **ADDED**: `manipulateDateCell` to manipulate date cell DOM after drawing
- **CHANGED**: Timing of `eventFilter` and `eventTransformer` is delayed for better-handling event data after regularized

## [1.2.6](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.2.5...v1.2.6) - 2022-12-05

- **Added** `useWeather` option. (true/false)
- **Added** `weatherLocationName` option (some partial text to distinguish location)

## [1.2.5](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.2.4...v1.2.5) - 2022-08-30

- **Added** Display legend of the calendar (`displayLegend: true` and when you set the calendar name on `calendar` module)
- **Fixed** Some CSS fixture

## [1.2.4](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.2.3...v1.2.4) - 2022-08-30

- **Fixed** Urgent fix for `useSymbol` issue since #1.2.2
- **Fixed** `symbol:null` issue resolved

## [1.2.3](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.2.2...v1.2.3) - 2022-08-29

- **Fixed** Move `eventFormatter` to prior to get compatibility with other calendar module (e.g GoogleCalendar module)

## [1.2.2](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.2.1...v1.2.2) - 2022-08-27

- **Added** Multi icons
- **Added** Font-awesome 'brands' icons

## [1.2.1](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.2.0...v1.2.1) - 2022-08-25

- **Added** Magic opposite color for the full-day event (This feature could solve the issue of no-color assigned.)
- **Fixed** CSS file renamed (module.css => MMM-CalendarExt3.css)

## [1.2.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.1.0...v1.2.0) - 2022-06-15

- Support multi notifications from multi-calendar providers. (It will prevent events reset.)

## [1.1.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.0.0...v1.1.0) - 2022-05-29

- https://github.com/MMRIZE/MMM-CalendarExt3/issues/4
![1.1.0](https://raw.githubusercontent.com/MMRIZE/public_ext_storage/main/MMM-CalendarExt3/cx3_110_2.png)

## [1.0.0](https://github.com/MMRIZE/MMM-CalendarExt3/releases/tag/v1.0.0) - 2022-04-24

- Release 1.0.0
