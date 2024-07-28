const _ = require('lodash');
const fetch = require('node-fetch');

const { getCountryAlpha2Code } = require('./utils');

const BASE_URL = 'https://api-gracenote.nbcolympics.com';

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
    const response = await fetch(`${BASE_URL}/svc/games_v2.svc/json/GetMedalTable_Season?competitionSetId=1&season=2024&languageCode=2`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
        }
    });

    if (!response.ok) {
        throw new Error('failed to fetch medals');
    }

    const parsedResponse = await response.json();
    const countries = _.get(parsedResponse, 'MedalTableNOC');
    const sortedCountries = _.orderBy(
        countries,
        ['n_Gold', 'n_Silver', 'n_Bronze', 'c_NOCShort'],
        ['desc', 'desc', 'desc', 'asc']
    );
    const mappedCountries = _.map(sortedCountries, mapCountry);

    return mappedCountries;
}

module.exports = { getCountryMedals };
