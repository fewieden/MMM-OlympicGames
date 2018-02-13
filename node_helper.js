/* Magic Mirror
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

/* eslint-env node */

const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start() {
        console.log(`Starting module: ${this.name}`);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
            this.getData({ url: 'https://www.bloomberg.com/graphics/2018-pyeongchang-olympics-medal-counter/live-data/total.json' });
            setInterval(() => {
                this.getData({ url: 'https://www.bloomberg.com/graphics/2018-pyeongchang-olympics-medal-counter/live-data/total.json' });
            }, this.config.reloadInterval);
        }
    },

    getData(options) {
        request(options, (error, response, body) => {
            if (response.statusCode === 200) {
                let parsedBody = JSON.parse(body);
                parsedBody.forEach((entry, index) => {
                    entry.place = index;
                });
                parsedBody.shift();
                this.sendSocketNotification('MEDALS', parsedBody);
            } else {
                console.log(`Error getting olympic games medals ${response.statusCode}`);
            }
        });
    }
});
