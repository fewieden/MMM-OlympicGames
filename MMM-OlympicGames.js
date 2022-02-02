/* global Module Log config */

/* MagicMirror²
 * Module: MMM-OlympicGames
 *
 * By fewieden https://github.com/fewieden/MMM-OlympicGames
 * MIT Licensed.
 */

Module.register("MMM-OlympicGames", {
    defaults: {
        maxRows: 10,
        highlight: false,
        title: "Olympic Winter Games 2022",
        reloadInterval: 30 * 60 * 1000 // every 30 minutes
    },

    getTranslations() {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
        };
    },

    getStyles() {
        return ["MMM-OlympicGames.css"];
    },

    getTemplate() {
        return `templates/${this.name}.njk`;
    },

    getCountriesToDisplay() {
        const countries = this.countries.slice(0, this.config.maxRows);

        if (this.config.highlight) {
            const highlightedIndex = this.countries.findIndex(
                (country) => country.code === this.config.highlight
            );
            if (highlightedIndex >= this.config.maxRows) {
                countries[this.config.maxRows - 1] =
                    this.countries[highlightedIndex];
            }
        }

        return countries;
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
        this.sendSocketNotification("CONFIG", this.config);
    },

    setCountryNames(countries) {
        const regionNames = new Intl.DisplayNames(config.locale, {
            type: "region"
        });
        return countries.map((country) => {
            const name =
                country.code.length === 2
                    ? regionNames.of(country.code)
                    : this.translate(country.code);

            return { ...country, name };
        });
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "COUNTRIES") {
            this.countries = this.setCountryNames(payload);
            this.updateDom(300);
        }
    }
});
