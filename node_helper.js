/* MagicMirror²
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const Log = require("logger");
const providers = require("./providers");

module.exports = NodeHelper.create({
    requiresVersion: "2.15.0",

    socketNotificationReceived(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            this.getCountryMedals();
            setInterval(() => {
                this.getCountryMedals();
            }, this.config.reloadInterval);
        }
    },

    async getCountryMedals() {
        try {
            const provider = providers[this.config.provider];

            if (!provider) {
                throw new Error(
                    `Unsupported provider: ${this.config.provider}`
                );
            }

            const countries = await provider.getCountryMedals();

            this.sendSocketNotification("COUNTRIES", countries);
        } catch (e) {
            Log.error("Error getting olympic game medals", e);
        }
    }
});
