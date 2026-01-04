let config = {
  address: "0.0.0.0",
  ipWhitelist: [],
  logLevel: ["INFO", "LOG", "WARN", "ERROR", "DEBUG"],
  language: "de",
  locale: "de-DE",
  timeFormat: 24,
  units: "metric",
  modules: [
    {
      module: "clock",
      position: "top_left",
      config: {
        displaySeconds: false,
        showDate: true
      }
    },
    {
      module: "calendar",
      position: "top_left",
      header: "Calendar",
      config: {
        broadcastPastEvents: true,
        calendars: [
          {
            name: "Holidays DE",
            url: "https://calendar.google.com/calendar/ical/en.german%23holiday%40group.v.calendar.google.com/public/basic.ics",
            symbol: "calendar"
          },
          {
            // Static test calendar (Jan 2030) for testing maxEventLines behavior
            name: "MaxEventLines Test",
            url: "http://localhost:8080/modules/MMM-CalendarExt3/test-calendar-static.ics",
            symbol: "flask",
            color: "#00ccff"
          }
        ]
      }
    },
    {
      module: "MMM-CalendarExt3",
      position: "bottom_bar",
      header: "Week View - January 2026",
      config: {
        mode: "week",
        instanceId: "weekCalendar",
        locale: "de-DE",
        firstDayOfWeek: 1,
        weeksInView: 3,
        maxEventLines: 5,
        displayLegend: true,
        useMarquee: true,
        showWeekNumber: true,
        referenceDate: 1767571200000, // Jan 5, 2026 (Monday)
        calendarSet: []
      }
    },
    {
      module: "MMM-CalendarExt3",
      position: "top_right",
      header: "Month View - Current Month",
      config: {
        mode: "month",
        instanceId: "monthCalendar",
        locale: "de-DE",
        firstDayOfWeek: 1,
        maxEventLines: 4,
        displayLegend: false,
        fontSize: "14px",
        eventHeight: "18px",
        calendarSet: []
      }
    }
  ]
}

/** ************* DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config }
