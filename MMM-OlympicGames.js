/* global Module Log */

/* Magic Mirror
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

Module.register('MMM-OlympicGames', {

    defaults: {
        maxRows: 10,
        highlight: false,
        title: 'Olympic Winter Games 2018',
        reloadInterval: 30 * 60 * 1000       // every 30 minutes
    },

    getTranslations() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json'
        };
    },

    getStyles() {
        return ['MMM-OlympicGames.css'];
    },

    start() {
        Log.info(`Starting module: ${this.name}`);
        this.sendSocketNotification('CONFIG', this.config);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'MEDALS') {
            this.medals = payload;
            this.updateDom();
        }
    },

    getDom() {
        const wrapper = document.createElement('div');
        const header = document.createElement('header');
        header.innerHTML = this.translate(this.config.title);
        wrapper.appendChild(header);

        if (!this.medals) {
            const text = document.createElement('div');
            text.innerHTML = this.translate('LOADING');
            text.classList.add('dimmed', 'light');
            wrapper.appendChild(text);
        } else {
            const table = document.createElement('table');
            table.classList.add('small', 'table');

            table.appendChild(this.createLabelRow());

            let included = false;

            for (let i = 0; i < this.medals.length; i += 1) {
                if (i < this.config.maxRows) {
                    if (this.medals[i].country === this.config.highlight) {
                        included = true;
                    }
                    table.appendChild(this.createDataRow(this.medals[i]));
                } else if (this.medals[i].country === this.config.highlight && !included) {
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
                    country: this.config.highlight,
                    gold: 0,
                    silver: 0,
                    bronze: 0
                }));
            }

            wrapper.appendChild(table);
        }

        return wrapper;
    },

    createLabelRow() {
        const labelRow = document.createElement('tr');

        const placeLabel = document.createElement('th');
        placeLabel.innerHTML = '#';
        labelRow.appendChild(placeLabel);

        const countryLabel = document.createElement('th');
        countryLabel.innerHTML = this.translate('COUNTRY');
        labelRow.appendChild(countryLabel);

        const goldLabel = document.createElement('th');
        goldLabel.innerHTML = this.translate('GOLD');
        labelRow.appendChild(goldLabel);

        const silverLabel = document.createElement('th');
        silverLabel.innerHTML = this.translate('SILVER');
        labelRow.appendChild(silverLabel);

        const bronzeLabel = document.createElement('th');
        bronzeLabel.innerHTML = this.translate('BRONZE');
        labelRow.appendChild(bronzeLabel);

        return labelRow;
    },

    createDataRow(data) {
        const row = document.createElement('tr');
        if (this.config.highlight === data.country) {
            row.classList.add('bright');
        }

        const place = document.createElement('td');
        place.innerHTML = data.place;
        row.appendChild(place);

        const country = document.createElement('td');
        country.innerHTML = data.country;
        row.appendChild(country);

        const gold = document.createElement('td');
        gold.innerHTML = data.gold;
        row.appendChild(gold);

        const silver = document.createElement('td');
        silver.innerHTML = data.silver;
        row.appendChild(silver);

        const bronze = document.createElement('td');
        bronze.innerHTML = data.bronze;
        row.appendChild(bronze);

        return row;
    }
});
