const NodeHelper = require("node_helper")
const path = require("node:path")

module.exports = NodeHelper.create({
  start() {
    this.functionConfigs = []
    this.registrationCount = 0
    this.loadFunctionConfigs()
  },

  /**
   * Read config.js on the server side where functions are preserved.
   * Extract function properties from each MMM-CalendarExt3 instance
   * and convert them to strings for sending to the frontend.
   *
   * Background: Since MagicMirror v2.35.0, config.js is no longer loaded
   * as a script tag in the browser. Instead, the browser fetches the config
   * via JSON (/config endpoint), which strips all function properties.
   * This node_helper restores those functions by reading the original
   * config.js file server-side (respecting MM_CONFIG_FILE) and sending
   * the function source code to the frontend for reconstruction.
   */
  loadFunctionConfigs() {
    const functionKeys = [
      "eventTransformer",
      "eventFilter",
      "eventSorter",
      "manipulateDateCell",
      "customHeader",
      "eventPayload",
      "weatherPayload"
    ]

    try {
      const configPath = path.resolve(
        global.root_path,
        process.env.MM_CONFIG_FILE || "config/config.js"
      )
      delete require.cache[require.resolve(configPath)]
      const userConfig = require(configPath)

      for (const mod of userConfig.modules || []) {
        if (mod.module !== this.name || !mod.config) continue

        const fnStrings = {}
        for (const key of functionKeys) {
          if (typeof mod.config[key] === "function") {
            fnStrings[key] = mod.config[key].toString()
          }
        }
        this.functionConfigs.push(fnStrings)
      }
    } catch (error) {
      console.warn(
        `[${this.name}] Could not load config functions:`,
        error.message
      )
    }
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "CX3_REGISTER") {
      // registrationCount maps to the index in functionConfigs because MagicMirror
      // initializes modules sequentially in config order, so the nth CX3_REGISTER
      // corresponds to the nth MMM-CalendarExt3 entry in config.modules.
      const index = this.registrationCount++
      this.sendSocketNotification("CX3_FUNCTIONS_RESTORED", {
        identifier: payload.identifier,
        functions: this.functionConfigs[index] || {}
      })
    }
  }
})
