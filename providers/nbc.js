const _ = require('lodash');
const fetch = require('node-fetch');

const { getCountryAlpha2Code } = require('./utils');

const BASE_URL = 'https://api-gracenote.nbcolympics.com/svc/games_v2.svc/json';

function mapCountry(entry = {}) {
    return {
        rank: entry.n_RankGold,
        code: getCountryAlpha2Code(entry.c_NOCShort),
        gold: entry.n_Gold,
        silver: entry.n_Silver,
        bronze: entry.n_Bronze,
    };
}

async function getCountryMedals() {
    const response = await fetch(`${BASE_URL}/GetMedalTable_Season?competitionSetId=2&season=20212022&languageCode=2`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
        }
    });

    if (!response.ok) {
        throw new Error('failed to fetch medals');
    }

    const parsedResponse = await response.json();
    const countries = _.get(parsedResponse, 'MedalTableNOC');
    const sortedCountries = _.orderBy(countries, ['n_Gold', 'n_Silver', 'n_Bronze', 'c_NOCShort'], ['desc', 'desc', 'desc', 'asc']);
    const mappedCountries = _.map(sortedCountries, mapCountry);

    return mappedCountries;
}

module.exports = { getCountryMedals };
