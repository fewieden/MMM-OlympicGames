/* MagicMirror²
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

const fetch = (...args) =>
    // eslint-disable-next-line no-shadow
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const _ = require("lodash");

const NodeHelper = require("node_helper");
const Log = require("logger");

const { getCountryAlpha2Code } = require("./countries");

const DATA_URL =
    "https://www.bloomberg.com/graphics/beijing-2022-olympics-data/current.json";

module.exports = NodeHelper.create({
    requiresVersion: "2.15.0",

    socketNotificationReceived(notification, payload) {
        if (notification === "CONFIG") {
            this.getCountryMedals();
            setInterval(() => {
                this.getCountryMedals();
            }, payload.reloadInterval);
        }
    },

    mapCountry(entry = {}, index) {
        return {
            rank: index + 1,
            code: getCountryAlpha2Code(entry.noc),
            gold: entry.gold,
            silver: entry.silver,
            bronze: entry.bronze
        };
    },

    async getCountryMedals() {
        try {
            const response = await fetch(DATA_URL, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36"
                }
            });

            if (!response.ok) {
                throw new Error("failed to fetch medals");
            }

            const parsedResponse = await response.json();
            const countries = _.get(parsedResponse, "data.medals");
            const sortedCountries = _.orderBy(
                countries,
                ["gold", "silver", "bronze", "noc"],
                ["desc", "desc", "desc", "asc"]
            );
            const mappedCountries = _.map(sortedCountries, this.mapCountry);

            this.sendSocketNotification("COUNTRIES", mappedCountries);
        } catch (e) {
            Log.error("Error getting olympic game medals", e);
        }
    }
});
