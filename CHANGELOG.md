# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.11.3](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.11.2...v1.11.3) (2026-02-14)


### Fixed

* correct typo in defaultNotifications object ([90c3692](https://github.com/MMRIZE/MMM-CalendarExt3/commit/90c3692d5ab8ebca79f26f5097879aa4bc49a3f2))


### Documentation

* align README defaults with actual module config ([1d08119](https://github.com/MMRIZE/MMM-CalendarExt3/commit/1d08119ea672c4ac0723c13ccf712724bfcd8fb8))


### Chores

* add automated testing workflow ([bbe48fd](https://github.com/MMRIZE/MMM-CalendarExt3/commit/bbe48fd3a94c8c7f50b34ebadb4d018b8daf79e3))
* remove deprecated notifications (CX3_SET_DATE, CX3_MOVE_CALENDAR, CX3_GLANCE_CALENDAR) ([070961c](https://github.com/MMRIZE/MMM-CalendarExt3/commit/070961cb0e40a66504e5ab737991ffdf0a847245))
* reorder test script to run lint before unit tests ([fead5d1](https://github.com/MMRIZE/MMM-CalendarExt3/commit/fead5d1bb38b5bf7b72afad03188a02a976a527d))
* update devDependencies + ESLint config ([11510d9](https://github.com/MMRIZE/MMM-CalendarExt3/commit/11510d980a6681c601ced4a295c0d2e3b6ff0b3b))
* update subproject commit reference in CX3_Shared ([fc863de](https://github.com/MMRIZE/MMM-CalendarExt3/commit/fc863de6d29b362b0036a25f0429876edc0805c5))


### Code Refactoring

* remove unused function parameters in event handling ([a667d2f](https://github.com/MMRIZE/MMM-CalendarExt3/commit/a667d2f648c8f2b345465f6b56db4a0f3d745c47))
* simplify event payload cloning with structuredClone ([5295dd6](https://github.com/MMRIZE/MMM-CalendarExt3/commit/5295dd62f11bea5192c650189b966cdf08e2ba54))
* use deterministic DOM IDs instead of timestamps ([5611e77](https://github.com/MMRIZE/MMM-CalendarExt3/commit/5611e77b8370269a9012eb5c0c3e5d1593e2a073))


### Tests

* add unit tests ([4edbcfe](https://github.com/MMRIZE/MMM-CalendarExt3/commit/4edbcfe9bc5af9f8a2ebec5853ae0c9b4829dc7c))

## [1.11.2](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.11.1...v1.11.2) (2026-01-26)


### Performance Improvements

* optimize marquee animation performance ([d6ea9b3](https://github.com/MMRIZE/MMM-CalendarExt3/commit/d6ea9b3a15de3a91cf0c4d2c363f109bbda460ae))


### Chores

* update CX3_Shared submodule to latest version ([1660433](https://github.com/MMRIZE/MMM-CalendarExt3/commit/1660433e0f74ea7e35f7483ce3a975b7c6f61e81))
* update devDependencies ([bd929e8](https://github.com/MMRIZE/MMM-CalendarExt3/commit/bd929e8ec2e165f2e24060625bc91c01bb206bbe))
* update devDependencies ([6e5f31f](https://github.com/MMRIZE/MMM-CalendarExt3/commit/6e5f31fe5c276d015ccb75a5eb5a32a1211fbf52))

## [1.11.1](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.11.0...v1.11.1) (2026-01-04)


### Fixed

* ensure consistent maxEventLines behavior across all days ([#248](https://github.com/MMRIZE/MMM-CalendarExt3/issues/248)) ([6095abb](https://github.com/MMRIZE/MMM-CalendarExt3/commit/6095abb932adcb67b01496bc10288618d2777bb8)), closes [#226](https://github.com/MMRIZE/MMM-CalendarExt3/issues/226)


### Chores

* add demo config and script ([fbca66d](https://github.com/MMRIZE/MMM-CalendarExt3/commit/fbca66dc521e8ae8fb9a502b4c8f532d897962a8))
* add global ignores for CX3_Shared in ESLint config ([eb3b40f](https://github.com/MMRIZE/MMM-CalendarExt3/commit/eb3b40f6cc0fde2b64d1bf8e4c43290059a107b9))
* add release script ([aa181b7](https://github.com/MMRIZE/MMM-CalendarExt3/commit/aa181b7438a90932db2e0d3eff5cd3db0760fdee))
* update devDependencies ([56bc727](https://github.com/MMRIZE/MMM-CalendarExt3/commit/56bc72702d0080861a26a4a48727fdc7c119dcbf))


### Code Refactoring

* improve date calculation clarity in calendar grid ([8ef7846](https://github.com/MMRIZE/MMM-CalendarExt3/commit/8ef7846301554c43f2a58888e507672929c67009))
* simplify end column calculation for event display ([a9cc827](https://github.com/MMRIZE/MMM-CalendarExt3/commit/a9cc827ace536cb8817f04590a12cd1f87d3b34d))

## [1.11.0](https://github.com/MMRIZE/MMM-CalendarExt3/compare/v1.10.2...v1.11.0) - 2025-11-28

### Added

- feat: add `showWeekNumber` option to hide CW number (#246)

### Changed

- docs: optimize description and change screenshot link in README
- chore: add stylistic rules to ESLint and lint code
- chore: update devDependencies

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
