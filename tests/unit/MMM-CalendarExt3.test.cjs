const test = require("node:test")
const assert = require("node:assert/strict")

const loadModuleDefinition = ({ mmConfig } = {}) => {
  delete require.cache[require.resolve("../../MMM-CalendarExt3.js")]

  let registered

  global.HTMLElement = class HTMLElement {}
  global.config = mmConfig ?? { language: "en" }
  global.Log = { warn: () => {}, error: () => {}, log: () => {} }
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

test("normalizes dynamicWeekHeight to strict boolean", () => {
  const instance = createInstance({ mmConfig: { language: "en" } })

  const enabled = instance.regularizeConfig({
    ...instance.defaults,
    dynamicWeekHeight: true
  })
  assert.equal(enabled.dynamicWeekHeight, true)

  const disabled = instance.regularizeConfig({
    ...instance.defaults,
    dynamicWeekHeight: "yes"
  })
  assert.equal(disabled.dynamicWeekHeight, false)
})

test("applies and resets config via notifications", async () => {
  const instance = createInstance({ mmConfig: { language: "en" } })
  let animationCalls = 0
  instance.updateAnimate = () => {
    animationCalls++
  }
  instance._ready = true

  instance.activeConfig = instance.regularizeConfig({ ...instance.defaults, instanceId: "A", mode: "week", weekIndex: 0 })
  instance.originalConfig = { ...instance.activeConfig }

  instance.notificationReceived("CX3_SET_CONFIG", { instanceId: "B", mode: "day", dayIndex: 2 }, null)
  assert.equal(instance.activeConfig.mode, "week")

  instance.notificationReceived("CX3_SET_CONFIG", { instanceId: "A", mode: "day", dayIndex: 2 }, null)
  assert.equal(instance.activeConfig.mode, "day")
  assert.equal(instance.activeConfig.dayIndex, 2)

  instance.notificationReceived("CX3_RESET", { instanceId: "A" }, null)
  await Promise.resolve()
  assert.equal(instance.activeConfig.mode, instance.originalConfig.mode)
  assert.equal(instance.activeConfig.weekIndex, instance.originalConfig.weekIndex)
  assert.equal(animationCalls, 1)
})

test("renders once for synchronous state changes after startup", async () => {
  const instance = createInstance({ mmConfig: { language: "en" } })
  let animationCalls = 0
  instance.updateAnimate = () => {
    animationCalls++
  }
  instance._ready = true
  instance.eventPool = new Map()
  instance.notifications = { eventNotification: "CALENDAR_EVENTS", eventPayload: payload => payload }

  instance.notificationReceived("CALENDAR_EVENTS", [{ title: "First" }], { identifier: "CALENDAR_A" })
  instance.notificationReceived("CALENDAR_EVENTS", [{ title: "Second" }], { identifier: "CALENDAR_B" })

  assert.equal(animationCalls, 0)
  await Promise.resolve()

  assert.equal(animationCalls, 1)
  assert.deepEqual(instance.eventPool.get("CALENDAR_A"), [{ title: "First" }])
  assert.deepEqual(instance.eventPool.get("CALENDAR_B"), [{ title: "Second" }])
})

test("does not refresh before startup is ready", async () => {
  const instance = createInstance({ mmConfig: { language: "en" } })
  let animationCalls = 0
  instance.updateAnimate = () => {
    animationCalls++
  }
  instance.eventPool = new Map()
  instance.notifications = {
    eventNotification: "CALENDAR_EVENTS",
    eventPayload: payload => payload
  }

  instance.notificationReceived("CALENDAR_EVENTS", [], { identifier: "CALENDAR_A" })
  await Promise.resolve()

  assert.equal(animationCalls, 0)
})

test("computes focus date by mode and referenceDate", () => {
  const instance = createInstance({ mmConfig: { language: "en" } })

  const dayFocusDate = instance.getMoment({
    mode: "day",
    referenceDate: "2026-01-15T12:00:00",
    dayIndex: 2,
    weekIndex: 0,
    monthIndex: 0
  })
  assert.equal(dayFocusDate.getDate(), 17)

  const monthFocusDate = instance.getMoment({
    mode: "month",
    referenceDate: "2026-01-15T12:00:00",
    dayIndex: 0,
    weekIndex: 0,
    monthIndex: 1
  })
  assert.equal(monthFocusDate.getFullYear(), 2026)
  assert.equal(monthFocusDate.getMonth(), 1)
  assert.equal(monthFocusDate.getDate(), 1)

  const weekFocusDate = instance.getMoment({
    mode: "week",
    referenceDate: "2026-01-15T12:00:00",
    dayIndex: 0,
    weekIndex: -1,
    monthIndex: 0
  })
  assert.equal(weekFocusDate.getDate(), 8)
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

test("getDom returns empty dom when module is not ready (_ready = false)", () => {
  // Regression test for: MM v2.36.0 calls getDom() before _functionsRestored resolves,
  // causing draw() to run with closure-less functions from MM's reviver.
  // Guard: !this._ready must prevent draw() from being called.
  let drawCalled = false

  const classList = { add: () => {} }
  const dom = {
    classList,
    style: { setProperty: () => {} },
    innerHTML: ""
  }

  global.document = {
    createElement: () => dom
  }

  const instance = createInstance()
  instance.activeConfig = instance.regularizeConfig({ ...instance.defaults })
  instance._ready = false
  instance.library = { loaded: true }
  instance.draw = () => {
    drawCalled = true
    return dom
  }

  instance.getDom()

  assert.equal(drawCalled, false, "draw() must not be called before module is ready")

  delete global.document
})

test("socketNotificationReceived restores all known config function keys including preProcessor", () => {
  // Contract test: every key that node_helper serializes must also be handled on the frontend.
  // If a key is added to node_helper but missing from configKeys here, the assertion fails.
  const allConfigKeys = ["preProcessor", "eventTransformer", "eventFilter", "eventSorter", "manipulateDateCell", "customHeader"]

  const moduleDef = loadModuleDefinition()
  const ctx = {
    identifier: "TEST_INSTANCE",
    activeConfig: {},
    originalConfig: {},
    notifications: {},
    _ready: false,
    _functionsReady: () => {},
    updateDom: () => {}
  }

  const functions = {}
  for (const key of allConfigKeys) {
    functions[key] = `() => "${key}"`
  }

  moduleDef.socketNotificationReceived.call(ctx, "CX3_FUNCTIONS_RESTORED", {
    identifier: "TEST_INSTANCE",
    variablePreamble: "",
    functions
  })

  for (const key of allConfigKeys) {
    assert.equal(typeof ctx.activeConfig[key], "function", `${key} must be restored in activeConfig`)
    assert.equal(typeof ctx.originalConfig[key], "function", `${key} must be restored in originalConfig`)
  }
})

test("socketNotificationReceived restores functions with injected closure variables", () => {
  const moduleDef = loadModuleDefinition()
  const ctx = {
    identifier: "TEST_INSTANCE",
    activeConfig: {},
    originalConfig: {},
    notifications: {},
    _ready: false,
    _functionsReady: () => {},
    updateDom: () => {}
  }

  moduleDef.socketNotificationReceived.call(ctx, "CX3_FUNCTIONS_RESTORED", {
    identifier: "TEST_INSTANCE",
    variablePreamble: "const sharedLabel = 'from preamble'",
    functions: {
      eventTransformer: "(event) => ({ ...event, title: sharedLabel })"
    }
  })

  const transformed = ctx.activeConfig.eventTransformer({ title: "original" })

  assert.equal(transformed.title, "from preamble")
  assert.equal(ctx.originalConfig.eventTransformer({}).title, "from preamble")
})
