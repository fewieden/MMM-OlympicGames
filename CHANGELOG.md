# MMM-OlympicGames Changelog

## [Unreleased]

### Fixed

### Added

### Changed

### Removed

## [1.4.0]

### Added

* Data provider: `paralympic`

### Changed

* Default provider: `paralympic`
* Default title: `Paralympic Winter Games 2022`

## [1.3.0]

### Added

* Added option for user to input list of countries to display, see config option `countryList`.
* Added French language translations.

### Changed

* Uniform spelling for MagicMirror²
* Upgraded development dependencies
* Updated preview images

## [1.2.0]

### Added

* Added another data source, see new config option `provider`.

### Changed

* Countries with same medals share the same rank

## [1.1.0]

MagicMirror² version >= 2.15.0 required.

### Fixed

* Installation instructions

### Added

* Nunjuck template
* Dependency: `node-fetch`
* Dependency: `lodash`
* Github actions: `build` and `changelog`
* Github config files

### Changed

* Data source
* Preview image
* Config options
* Country names are now translated with the `Intl` object
* Translations

### Removed

* Dependency: `request`
* Travis-CI integration

## [1.0.0]

Initial version
