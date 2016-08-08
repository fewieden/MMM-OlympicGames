/* Magic Mirror
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

const request = require('request');
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if(notification === 'CONFIG'){
            this.config = payload;
            this.getData({url: "http://www.medalbot.com/api/v1/medals"});
            setInterval(() => {
                this.getData({url: "http://www.medalbot.com/api/v1/medals"});
            }, this.config.reloadInterval);
        }
    },

    getData: function(options) {
        request(options, (error, response, body) => {
            if (response.statusCode === 200) {
                this.sendSocketNotification("MEDALS", JSON.parse(body));
            } else {
                console.log("Error getting olympic games medals " + response.statusCode);
            }
        });
    }
});