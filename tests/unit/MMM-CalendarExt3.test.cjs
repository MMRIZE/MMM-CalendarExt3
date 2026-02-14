const test = require("node:test")
const assert = require("node:assert/strict")

const loadModuleDefinition = ({ mmConfig } = {}) => {
  delete require.cache[require.resolve("../../MMM-CalendarExt3.js")]

  let registered

  global.HTMLElement = class HTMLElement {}
  global.config = mmConfig ?? { language: "en" }
  global.Module = {
    register: (_name, definition) => {
      registered = definition
    }
  }

  require("../../MMM-CalendarExt3.js")

  assert.ok(registered, "Module should be registered")
  return registered
}

const createInstance = ({ mmConfig } = {}) => {
  const definition = loadModuleDefinition({ mmConfig })
  return {
    ...definition,
    identifier: "TEST_INSTANCE",
    config: {},
    notifications: {},
    activeConfig: null,
    originalConfig: null,
    updateAnimate: () => {}
  }
}

test("uses default notifications fallback when options are missing", () => {
  const instance = createInstance({ mmConfig: { language: "en" } })

  const options = instance.regularizeConfig({ ...instance.defaults })

  assert.equal(options.instanceId, "TEST_INSTANCE")
  assert.equal(instance.notifications.eventNotification, "CALENDAR_EVENTS")
  assert.equal(instance.notifications.weatherNotification, "WEATHER_UPDATED")
})

test("normalizes mode dependent indexes", () => {
  const instance = createInstance({ mmConfig: { language: "en" } })

  const monthOptions = instance.regularizeConfig({
    ...instance.defaults,
    mode: "month",
    weekIndex: 8,
    dayIndex: 4,
    monthIndex: 2
  })

  assert.equal(monthOptions.weekIndex, 0)
  assert.equal(monthOptions.weeksInView, 6)
  assert.equal(monthOptions.dayIndex, 0)
  assert.equal(monthOptions.monthIndex, 2)

  const dayOptions = instance.regularizeConfig({
    ...instance.defaults,
    mode: "day",
    dayIndex: 3
  })

  assert.equal(dayOptions.dayIndex, 3)
})

test("applies and resets config via notifications", () => {
  const instance = createInstance({ mmConfig: { language: "en" } })
  let animationCalls = 0
  instance.updateAnimate = () => {
    animationCalls++
  }

  instance.activeConfig = instance.regularizeConfig({ ...instance.defaults, instanceId: "A", mode: "week", weekIndex: 0 })
  instance.originalConfig = { ...instance.activeConfig }

  instance.notificationReceived("CX3_SET_CONFIG", { instanceId: "B", mode: "day", dayIndex: 2 }, null)
  assert.equal(instance.activeConfig.mode, "week")

  instance.notificationReceived("CX3_SET_CONFIG", { instanceId: "A", mode: "day", dayIndex: 2 }, null)
  assert.equal(instance.activeConfig.mode, "day")
  assert.equal(instance.activeConfig.dayIndex, 2)

  instance.notificationReceived("CX3_RESET", { instanceId: "A" }, null)
  assert.equal(instance.activeConfig.mode, instance.originalConfig.mode)
  assert.equal(instance.activeConfig.weekIndex, instance.originalConfig.weekIndex)
  assert.equal(animationCalls, 2)
})

test("computes moment by mode and referenceDate", () => {
  const instance = createInstance({ mmConfig: { language: "en" } })

  const dayMoment = instance.getMoment({
    mode: "day",
    referenceDate: "2026-01-15T12:00:00",
    dayIndex: 2,
    weekIndex: 0,
    monthIndex: 0
  })
  assert.equal(dayMoment.getDate(), 17)

  const monthMoment = instance.getMoment({
    mode: "month",
    referenceDate: "2026-01-15T12:00:00",
    dayIndex: 0,
    weekIndex: 0,
    monthIndex: 1
  })
  assert.equal(monthMoment.getFullYear(), 2026)
  assert.equal(monthMoment.getMonth(), 1)
  assert.equal(monthMoment.getDate(), 1)

  const weekMoment = instance.getMoment({
    mode: "week",
    referenceDate: "2026-01-15T12:00:00",
    dayIndex: 0,
    weekIndex: -1,
    monthIndex: 0
  })
  assert.equal(weekMoment.getDate(), 8)
})

test("getHeader returns explicit header and month fallback", () => {
  const instance = createInstance({ mmConfig: { language: "en-US" } })

  instance.data = { header: "Custom Header" }
  instance.activeConfig = instance.regularizeConfig({
    ...instance.defaults,
    mode: "month",
    customHeader: false,
    referenceDate: "2026-02-15T10:00:00.000Z",
    locale: "en-US"
  })

  assert.equal(instance.getHeader(), "Custom Header")

  instance.data = { header: "   " }
  const fallbackHeader = instance.getHeader()
  assert.equal(typeof fallbackHeader, "string")
  assert.ok(fallbackHeader.length > 0)
})
