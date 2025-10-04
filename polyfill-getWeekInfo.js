/**
 * Polyfill for Intl.Locale.prototype.getWeekInfo()
 * 
 * This polyfill adds support for the getWeekInfo() method to browsers that don't support it natively,
 * particularly Firefox (as of October 2025).
 * 
 * ⚠️ TODO: REMOVE THIS FILE WHEN FIREFOX SUPPORTS Intl.Locale.prototype.getWeekInfo() NATIVELY
 * 
 * Check browser support at: https://caniuse.com/mdn-javascript_builtins_intl_locale_getweekinfo
 * 
 * This implementation is based on Unicode CLDR (Common Locale Data Repository) data.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo
 * @see https://github.com/tc39/proposal-intl-locale-info
 */

(function() {
  'use strict';

  // Only apply polyfill if getWeekInfo is not natively supported
  if (typeof Intl !== 'undefined' && 
      Intl.Locale && 
      typeof Intl.Locale.prototype.getWeekInfo === 'function') {
    // Native support exists, no polyfill needed
    console.info('[CX3 Polyfill] Intl.Locale.getWeekInfo() is natively supported. Polyfill not applied.');
    return;
  }

  console.info('[CX3 Polyfill] Applying Intl.Locale.getWeekInfo() polyfill for Firefox compatibility.');

  /**
   * Week information data based on Unicode CLDR
   * 
   * Structure:
   * - firstDay: First day of the week (1=Monday, 2=Tuesday, ..., 6=Saturday, 7=Sunday)
   * - weekend: Array of weekend days (using same numbering)
   * - minimalDays: Minimum number of days required in the first week of the year
   * 
   * ISO 8601 standard: firstDay=1 (Monday), minimalDays=4
   */
  const weekInfoData = {
    // Default: ISO 8601 standard (used by most European countries and internationally)
    default: { firstDay: 1, weekend: [6, 7], minimalDays: 4 },
    
    // ========================================
    // SUNDAY-START COUNTRIES (firstDay: 7)
    // ========================================
    
    // Americas (Sunday start)
    AG: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Antigua and Barbuda
    AS: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // American Samoa
    BR: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Brazil
    BS: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Bahamas
    BZ: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Belize
    CA: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Canada
    CO: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Colombia
    DM: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Dominica
    DO: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Dominican Republic
    GT: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Guatemala
    GU: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Guam
    HN: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Honduras
    JM: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Jamaica
    MH: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Marshall Islands
    MX: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Mexico
    NI: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Nicaragua
    PA: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Panama
    PE: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Peru
    PH: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Philippines
    PR: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Puerto Rico
    PT: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Portugal
    PY: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Paraguay
    SV: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // El Salvador
    TT: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Trinidad and Tobago
    UM: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // U.S. Minor Outlying Islands
    US: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // United States
    VE: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Venezuela
    VI: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // U.S. Virgin Islands
    WS: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Samoa
    
    // Asia/Pacific (Sunday start)
    AU: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Australia
    BT: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Bhutan
    CN: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // China
    HK: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Hong Kong
    ID: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Indonesia
    IL: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Israel
    IN: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // India
    JP: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Japan
    KH: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Cambodia
    KR: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // South Korea
    LA: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Laos
    MM: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Myanmar
    MO: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Macau
    MT: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Malta
    NP: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Nepal
    NZ: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // New Zealand
    PK: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Pakistan
    SG: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Singapore
    TH: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Thailand
    TW: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Taiwan
    
    // Africa (Sunday start)
    BW: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Botswana
    ET: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Ethiopia
    KE: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Kenya
    MZ: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Mozambique
    ZA: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // South Africa
    ZW: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Zimbabwe
    
    // Middle East (Sunday start with special weekends)
    SA: { firstDay: 7, weekend: [6, 7], minimalDays: 1 }, // Saudi Arabia
    
    // ========================================
    // SATURDAY-START COUNTRIES (firstDay: 6)
    // ========================================
    
    // Middle East (Saturday start, Friday-Saturday weekend)
    AE: { firstDay: 6, weekend: [6, 7], minimalDays: 1 }, // United Arab Emirates
    BH: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Bahrain
    DJ: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Djibouti
    DZ: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Algeria
    EG: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Egypt
    IQ: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Iraq
    JO: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Jordan
    KW: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Kuwait
    LY: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Libya
    OM: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Oman
    QA: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Qatar
    SD: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Sudan
    SY: { firstDay: 6, weekend: [5, 6], minimalDays: 1 }, // Syria
    
    // Special cases
    AF: { firstDay: 6, weekend: [4, 5], minimalDays: 1 }, // Afghanistan (Thu-Fri weekend)
    IR: { firstDay: 6, weekend: [5, 5], minimalDays: 1 }, // Iran (Friday only)
    
    // ========================================
    // FRIDAY-START COUNTRIES (firstDay: 5)
    // ========================================
    
    MV: { firstDay: 5, weekend: [5, 5], minimalDays: 1 }  // Maldives (Friday only)
  };

  /**
   * Polyfill implementation of Intl.Locale.prototype.getWeekInfo()
   * 
   * @returns {Object} Week information for the locale
   *   - firstDay: Number (1-7, where 1=Monday, 7=Sunday)
   *   - weekend: Array of Numbers (weekend days)
   *   - minimalDays: Number (minimal days in first week)
   */
  Intl.Locale.prototype.getWeekInfo = function() {
    // Extract the region code from the locale
    // E.g., 'en-US' -> 'US', 'de-DE' -> 'DE', 'fr' -> 'FR' (from language)
    const region = this.region || this.language?.toUpperCase() || '';
    
    // Return region-specific data, or fall back to ISO 8601 default
    return weekInfoData[region] || weekInfoData.default;
  };

  console.info('[CX3 Polyfill] Successfully applied Intl.Locale.getWeekInfo() polyfill.');
})();
