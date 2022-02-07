/* Magic Mirror
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

/* eslint-env node */

const NodeHelper = require('node_helper');
const Log = require('logger');

const providers = require('./providers');

module.exports = NodeHelper.create({
    requiresVersion: '2.15.0',

    socketNotificationReceived(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
            this.getCountryMedals(this.config);
            setInterval(() => {
                this.getCountryMedals(this.config);
            }, this.config.reloadInterval);
        }
    },

    formatResults(payload, countries) {
        const ret = [];
        const cntr = payload;
        const countryData = countries;
        if (cntr.countryList) {
            for (const key in countryData) {
                const value = countryData[key];
                if (cntr.countryList.indexOf(value[countryData.code]) !== -1) {
                    ret.push(value);
                }
            }
            this.sendSocketNotification('COUNTRIES', ret);
        } else {
            this.sendSocketNotification('COUNTRIES', countryData);
        }
    },

    async getCountryMedals(payload) {
        try {
            const provider = providers[this.config.provider];

            if (!provider) {
                throw new Error(`Unsupported provider: ${this.config.provider}`);
            }

            const countries = await provider.getCountryMedals();
            this.formatResults(payload, countries);
        } catch (e) {
            Log.error('Error getting olympic game medals', e);
        }
    }
});
