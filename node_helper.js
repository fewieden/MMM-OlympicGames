/* Magic Mirror
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

/* eslint-env node */

const fetch = require('node-fetch');
const _ = require('lodash');

const NodeHelper = require('node_helper');
const Log = require('logger');

const { getCountryAlpha2Code } = require('./countries');

const DATA_URL = 'https://www.bloomberg.com/graphics/beijing-2022-olympics-data/current.json';

module.exports = NodeHelper.create({
    requiresVersion: '2.15.0',

    socketNotificationReceived(notification, payload) {
        if (notification === 'CONFIG') {
            this.getCountryMedals();
            setInterval(() => {
                this.getCountryMedals();
            }, payload.reloadInterval);
        }
    },

    mapCountry(entry = {}) {
        return {
            code: getCountryAlpha2Code(entry.noc),
            gold: entry.gold,
            silver: entry.silver,
            bronze: entry.bronze,
        };
    },

    setRank(entry, index, entries) {
        const previousEntry = entries[index - 1];
        if (_.isEqual(_.omit(previousEntry, ['code', 'rank']), _.omit(entry, ['code']))) {
            entry.rank = previousEntry.rank;
        } else {
            entry.rank = index + 1;
        }
    },

    async getCountryMedals() {
        try {
            const response = await fetch(DATA_URL, {
                headers: {
                    'Referer': 'https://www.bloomberg.com/graphics/beijing-2022-winter-olympics-medal-count/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
                }
            });

            if (!response.ok) {
                throw new Error('failed to fetch medals');
            }

            const parsedResponse = await response.json();
            const countries = _.get(parsedResponse, 'data.medals');
            const sortedCountries = _.orderBy(countries, ['gold', 'silver', 'bronze', 'noc'], ['desc', 'desc', 'desc', 'asc']);
            const mappedCountries = _.map(sortedCountries, this.mapCountry);
            const rankedCountries = _.each(mappedCountries, this.setRank);

            this.sendSocketNotification('COUNTRIES', rankedCountries);
        } catch (e) {
            Log.error('Error getting olympic game medals', e);
        }
    }
});
