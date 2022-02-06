const _ = require('lodash');
const fetch = require('node-fetch');

const { getCountryAlpha2Code } = require('./utils');

const BASE_URL = 'https://www.bloomberg.com/graphics';

function mapCountry(entry = {}) {
    return {
        code: getCountryAlpha2Code(entry.noc),
        gold: entry.gold,
        silver: entry.silver,
        bronze: entry.bronze,
    };
}

function setRank(entry, index, entries) {
    const previousEntry = entries[index - 1];
    if (_.isEqual(_.omit(previousEntry, ['code', 'rank']), _.omit(entry, ['code']))) {
        entry.rank = previousEntry.rank;
    } else {
        entry.rank = index + 1;
    }
}

async function getCountryMedals() {
    const response = await fetch(`${BASE_URL}/beijing-2022-olympics-data/current.json`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
        }
    });

    if (!response.ok) {
        throw new Error('failed to fetch medals');
    }

    const parsedResponse = await response.json();
    const countries = _.get(parsedResponse, 'data.medals');
    const sortedCountries = _.orderBy(countries, ['gold', 'silver', 'bronze', 'noc'], ['desc', 'desc', 'desc', 'asc']);
    const mappedCountries = _.map(sortedCountries, mapCountry);
    const rankedCountries = _.each(mappedCountries, setRank);

    return rankedCountries;
}

module.exports = { getCountryMedals };
