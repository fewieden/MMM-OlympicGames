/* global Module Log config */

/* MagicMirror²
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

Module.register('MMM-OlympicGames', {
    defaults: {
        maxRows: 10,
        highlight: false,
        title: 'Paris Summer Games 2024',
        reloadInterval: 30 * 60 * 1000, // every 30 minutes
        provider: 'nbc',
        countryList: false
    },

    getTranslations() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json',
            fr: 'translations/fr.json',
        };
    },

    getStyles() {
        return ['MMM-OlympicGames.css'];
    },

    getTemplate() {
        return `templates/${this.name}.njk`;
    },

    filterCountryList() {
        if (!Array.isArray(this.config.countryList)) {
            return this.countries;
        }

        return this.countries.filter(country => this.config.countryList.includes(country.code));
    },

    getCountriesToDisplay() {
        const filteredCountries = this.filterCountryList();
        const slicedCountries = filteredCountries.slice(0, this.config.maxRows);

        if (this.config.highlight) {
            const highlightedIndex = this.countries.findIndex(country => country.code === this.config.highlight);

            if (highlightedIndex >= this.config.maxRows) {
                slicedCountries[this.config.maxRows - 1] = this.countries[highlightedIndex];
            }
        }

        return slicedCountries;
    },

    getTemplateData() {
        if (!Array.isArray(this.countries)) {
            return { config: this.config };
        }

        return {
            config: this.config,
            countries: this.getCountriesToDisplay()
        };
    },

    start() {
        Log.info(`Starting module: ${this.name}`);

        if (Array.isArray(this.config.countryList)) {
            this.config.maxRows = this.config.countryList.length;
        }

        this.sendSocketNotification('CONFIG', this.config);
    },

    setCountryNames(countries) {
        const regionNames = new Intl.DisplayNames(config.locale, { type: 'region' });
        return countries.map(country => {
            const name = country.code.length === 2
                ? regionNames.of(country.code)
                : this.translate(country.code);

            return { ...country, name };
        });
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'COUNTRIES') {
            this.countries = this.setCountryNames(payload);
            this.updateDom(300);
        }
    }
});
