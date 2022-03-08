const _ = require('lodash');
const fetch = require('node-fetch');

const { getCountryAlpha2Code } = require('./utils');

const BASE_URL = 'https://appipcparabei.ovpobs.tv/api';

function mapCountry(entry) {
    return {
        rank: _.get(entry, 'attributes.statistics.goldRank'),
        code: getCountryAlpha2Code(_.get(entry, 'attributes.externalId')),
        gold: _.get(entry, 'attributes.statistics.gold'),
        silver: _.get(entry, 'attributes.statistics.silver'),
        bronze: _.get(entry, 'attributes.statistics.bronze'),
    };
}

async function getCountryMedals() {
    const response = await fetch(`${BASE_URL}/organisations?page[size]=399&sort=statistics.goldRank,externalId`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
            'x-obs-app-token': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY2OGMxYzRkYTVlYTNiODFkYmEwM2E4YzkzNmY3ZmEyIn0.eyJpc3MiOiJodHRwczovL2FwcG92cGJlaS5vdnBvYnMudHYvYXBpL2lkZW50aXR5Iiwic3ViIjoiNTE0YjM0NjAtYmFiZC00ODNiLThmNmYtZGIzZWQxY2YzMmNhIiwiYXVkIjoiOGUyMTY3M2E3OWRmNDA4Mzk3MDM5MmE0YjI4ZmJhYjUiLCJleHAiOjE2NzQ5MTczNjgsImlhdCI6MTY0MzM4MTM2OCwiYXV0aF90aW1lIjoxNjIxNTA1MzM2LCJhdF9oYXNoIjoibnJXUE9NYy1kWW5ISzVwcnd6aGU2QSIsImVtYWlsIjoiaXBjLWFwaXVzZXJAaWRlbnRpdHkuYXBpZ3cuaGFpa3Uuem9uZSIsIm5pY2tuYW1lIjoiaXBjLWFwaXVzZXIiLCJncm91cHMiOlsiT1ZQL0lQQy91c2VyIl0sIm90cF92ZXJpZmllZCI6ZmFsc2UsIm90cF9zZXR1cCI6ZmFsc2UsInBvbCI6IjYxYzFiZDlhNWJiOGM4MGQ1YmIxNzNlOCIsImh0dHBzOi8vb3Zwb2JzLnR2L2NvbXBldGl0aW9uIjoicGFyYWJlaSIsImh0dHBzOi8vb3Zwb2JzLnR2L3JoYklkIjoiMjUiLCJodHRwczovL292cG9icy50di9yaGJfaWQiOiIyNSIsImh0dHBzOi8vb3Zwb2JzLnR2L2xldmVsIjoiYW5vbnltb3VzIiwiaHR0cHM6Ly9vdnBvYnMudHYvbWluaW11bV9sZXZlbCI6ImFub255bW91cyIsImh0dHBzOi8vb3Zwb2JzLnR2L3JoYiI6ImlwYyIsInJoYl9pZCI6ImlwYyIsInVzZXJuYW1lIjoiaXBjLWFwaXVzZXIiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIGdyb3VwcyBvdHAgcG9sIHJoYl9pZCB1c2VybmFtZSBzY29wZSBicm9hZGNhc3Qgc3BvcnRzIiwidHlwZSI6IndlYiJ9.emCV2YmXL7ClU72gVdXdPVIlFniZnwR3yebBgolWfWFXjqGEjfKRk9o6tWHNh72Gzr-l1f06hmNWODoAfZPwadl0gCDWtz3HElrdnq3eaJtQFLId7l5vM8qqnqJiWbDFAQxO6H9mLkZAQBCJyWLeE5l_jpzggUymn12jDdjjf3ChgbTX5gQ4c2t-KJdRtL8Z9qhTa6FT6Vz97aBlqt0ZPWstGqhL0o_fKEFInzcCAO-zlRvb6Pirr1iwsgUZHiDyaYzB2q6PPnZK4Uhh5rqfA3xH__8APhv6V9aH0gchjghdlosgGHiP6-H-Mat7Kcna7H1wp_u9587QtkzMfvkIow'
        }
    });

    if (!response.ok) {
        throw new Error('failed to fetch medals');
    }

    const parsedResponse = await response.json();
    const countries = _.get(parsedResponse, 'data');
    const mappedCountries = _.map(countries, mapCountry);

    return mappedCountries;
}

module.exports = { getCountryMedals };
