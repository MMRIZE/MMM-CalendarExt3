const NodeHelper = require("node_helper")
const path = require("node:path")
const fs = require("node:fs")

module.exports = NodeHelper.create({
  start() {
    // MagicMirror revives config functions from source strings, but without closure scope.
    // This helper restores referenced top-level config variables by injecting the config preamble.
    this.functionConfigs = []
    this.variablePreamble = ""
    this.identifierFunctions = new Map()
    this.loadFunctionConfigs()
  },

  /**
   * Extract variable declarations from config.js (everything before "let config = {").
   * These variables are needed as closure context for callback functions
   * that reference them (eventTransformer, eventFilter, etc.).
   *
   * Example:
   *   let myVar = {key: "value"}
   *   const helpers = { ... }
   *   let config = { modules: [...] }
   *
   * Returns the preamble: "let myVar = {key: \"value\"}\nconst helpers = { ... }"
   */
  extractVariablePreamble() {
    try {
      const configPath = path.resolve(
        global.root_path,
        process.env.MM_CONFIG_FILE || "config/config.js"
      )
      const configContent = fs.readFileSync(configPath, "utf-8")

      // Find where the config object starts (let/var/const config = {)
      const configMatch = configContent.match(/(let|var|const)\s+config\s*=/)
      if (!configMatch) {
        return ""
      }

      const configStartIndex = configMatch.index
      // Get everything before the config declaration (the variable preamble)
      const preamble = configContent.substring(0, configStartIndex).trim()
      return preamble
    } catch (error) {
      console.warn(
        `[${this.name}] Could not extract variable preamble:`,
        error.message
      )
      return ""
    }
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
   *
   * Also extracts the variable preamble so that closure variables
   * (e.g., myVariable in eventTransformer) are available to the functions.
   */
  loadFunctionConfigs() {
    const functionKeys = [
      "preProcessor",
      "eventTransformer",
      "eventFilter",
      "eventSorter",
      "manipulateDateCell",
      "customHeader",
      "eventPayload",
      "weatherPayload"
    ]

    // Extract variable preamble once (used for all module instances)
    this.variablePreamble = this.extractVariablePreamble()

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
      const { identifier } = payload
      // On first registration of a given identifier, assign the next functionConfig in order
      // (MagicMirror initializes modules sequentially, preserving config.modules order).
      // Subsequent registrations from the same identifier (reconnects, multi-browser) reuse
      // the cached functions so they always get the correct config.
      if (!this.identifierFunctions.has(identifier)) {
        const index = this.identifierFunctions.size
        this.identifierFunctions.set(identifier, this.functionConfigs[index] || {})
      }
      this.sendSocketNotification("CX3_FUNCTIONS_RESTORED", {
        identifier,
        variablePreamble: this.variablePreamble,
        functions: this.identifierFunctions.get(identifier)
      })
    }
  }
})
