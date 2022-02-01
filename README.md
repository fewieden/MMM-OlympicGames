# MMM-OlympicGames [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/fewieden/MMM-OlympicGames/master/LICENSE) [![Build Status](https://travis-ci.org/fewieden/MMM-OlympicGames.svg?branch=master)](https://travis-ci.org/fewieden/MMM-OlympicGames) [![Code Climate](https://codeclimate.com/github/fewieden/MMM-OlympicGames/badges/gpa.svg?style=flat)](https://codeclimate.com/github/fewieden/MMM-OlympicGames) [![Known Vulnerabilities](https://snyk.io/test/github/fewieden/mmm-olympicgames/badge.svg)](https://snyk.io/test/github/fewieden/mmm-olympicgames)

Olympic Games Module for MagicMirror<sup>2</sup>

## Example

![](.github/medals.png)

## Dependencies

* An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
* npm
* [request](https://www.npmjs.com/package/request)

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
1. Configure your `~/MagicMirror/config/config.js`:

    ```
    {
        module: 'MMM-OlympicGames',
        position: 'top_right',
        config: {
            ...
        }
    }
    ```

1. Run command `npm install --productive` in `~/MagicMirror/modules/MMM-OlympicGames` directory.

## Config Options

| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `highlight` | `false` | Which country should be highlighted 'COUNTRYNAME'. |
| `maxRows` | `10` | How many countries should be displayed. |
| `title` | `'Olympic Winter Games 2018'` | The title above the medal table |
| `reloadInterval` | `1800000` (30 mins) | How often should the data be fetched |
