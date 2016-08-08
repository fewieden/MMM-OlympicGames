/* Magic Mirror
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

Module.register("MMM-OlympicGames", {

    defaults: {
        maxRows: 10,
        highlight: false,
        title: 'Olympic Games Rio 2016',
        reloadInterval: 30 * 60 * 1000       // every 30 minutes
    },

    getTranslations: function () {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
        };
    },

    getStyles: function () {
        return ["MMM-OlympicGames.css"];
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "MEDALS") {
            this.medals = payload;
            this.updateDom();
        }
    },

    getDom: function () {

        var wrapper = document.createElement("div");
        var header = document.createElement("header");
        header.innerHTML = this.translate(this.config.title);
        wrapper.appendChild(header);

        if (!this.medals) {
            var text = document.createElement("div");
            text.innerHTML = this.translate("LOADING");
            text.classList.add("dimmed", "light");
            wrapper.appendChild(text);
        } else {
            var table = document.createElement("table");
            table.classList.add("small", "table");

            table.appendChild(this.createLabelRow());

            var included = false;

            for (var i = 0; i < this.medals.length; i++) {
                if (i < this.config.maxRows) {
                    if (this.medals[i].country_name === this.config.highlight) {
                        included = true;
                    }
                    table.appendChild(this.createDataRow(this.medals[i]));
                } else if (this.medals[i].country_name === this.config.highlight && !included) {
                    included = true;
                    table.removeChild(table.lastChild);
                    table.appendChild(this.createDataRow(this.medals[i]));
                    break;
                }
            }

            if (!included && this.config.highlight) {
                if (table.children.length >= this.config.maxRows + 1) {
                    table.removeChild(table.lastChild);
                }
                table.appendChild(this.createDataRow({
                    place: this.medals.length,
                    country_name: this.config.highlight,
                    gold_count: 0,
                    silver_count: 0,
                    bronze_count: 0
                }));
            }

            wrapper.appendChild(table);
        }

        return wrapper;
    },

    createLabelRow: function () {
        var labelRow = document.createElement("tr");

        var placeLabel = document.createElement("th");
        placeLabel.innerHTML = "#";
        labelRow.appendChild(placeLabel);

        var countryLabel = document.createElement("th");
        countryLabel.innerHTML = this.translate("COUNTRY");
        labelRow.appendChild(countryLabel);

        var goldLabel = document.createElement("th");
        goldLabel.innerHTML = this.translate("GOLD");
        labelRow.appendChild(goldLabel);

        var silverLabel = document.createElement("th");
        silverLabel.innerHTML = this.translate("SILVER");
        labelRow.appendChild(silverLabel);

        var bronzeLabel = document.createElement("th");
        bronzeLabel.innerHTML = this.translate("BRONZE");
        labelRow.appendChild(bronzeLabel);

        return labelRow;
    },

    createDataRow: function (data) {
        var row = document.createElement("tr");
        if (this.config.highlight === data.country_name) {
            row.classList.add("bright");
        }

        var place = document.createElement("td");
        place.innerHTML = data.place;
        row.appendChild(place);

        var country = document.createElement("td");
        country.innerHTML = data.country_name;
        row.appendChild(country);

        var gold = document.createElement("td");
        gold.innerHTML = data.gold_count;
        row.appendChild(gold);

        var silver = document.createElement("td");
        silver.innerHTML = data.silver_count;
        row.appendChild(silver);

        var bronze = document.createElement("td");
        bronze.innerHTML = data.bronze_count;
        row.appendChild(bronze);

        return row;
    }
});