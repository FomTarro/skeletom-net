const { AppConfig } = require("../../../app.config");
const { Version } = require("./version");


class VersionChecker {
    /**
     * 
     * @param {AppConfig} appConfig 
     */
    constructor(appConfig) {
        /**
         * Indexed by login name
         * @type {Map<string, Version>}
         */
        this.versionTable = new Map([
            ["vts-heartrate", {
                version: appConfig.VTS_HEARTRATE_VERSION,
                date: appConfig.VTS_HEARTRATE_DATE,
                url: appConfig.VTS_HEARTRATE_URL
            }],
            ["vts-midi", {
                version: appConfig.VTS_MIDI_VERSION,
                date: appConfig.VTS_MIDI_DATE,
                url: appConfig.VTS_MIDI_URL
            }],
            ["amiyamiga", {
                version: appConfig.AMIYAMIGA_VERSION,
                date: appConfig.AMIYAMIGA_DATE,
                url: appConfig.AMIYAMIGA_URL
            }],
            ["mintfantome-desktop", {
                version: appConfig.MINT_DESKTOP_VERSION,
                date: appConfig.MINT_DESKTOP_DATE,
                url: appConfig.MINT_DESKTOP_URL
            }],
            ["kkcyber-desktop", {
                version: appConfig.KK_DESKTOP_VERSION,
                date: appConfig.KK_DESKTOP_DATE,
                url: appConfig.KK_DESKTOP_URL
            }],
            ["word-salad", {
                version: appConfig.WORD_SALAD_VERSION,
                date: appConfig.WORD_SALAD_DATE,
                url: appConfig.WORD_SALAD_URL
            }],
            ["vts-counter", {
                version: appConfig.VTS_COUNTER_VERSION,
                date: appConfig.VTS_COUNTER_DATE,
                url: appConfig.VTS_COUNTER_URL
            }]
        ]);
    }

    /**
     * 
     * @param {string} appName 
     * @returns {Version | undefined} 
     */
    getLatestVersion = (appName) => {
        console.log(`Checking for latest version of ${appName}...`);
        if (this.versionTable.has(appName)) {
            console.log(`Latest version of ${appName} found!`)
            return this.versionTable.get(appName);
        }
        return undefined;
    }
}

module.exports.VersionChecker = VersionChecker;
