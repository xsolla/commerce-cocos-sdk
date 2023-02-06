# Changelog

## [0.4.0] - 2023-02-07

### Added
- SDK methods for ordering free items (`createOrderWithSpecifiedFreeItem` and `createOrderWithFreeCart` SDK methods)

### Changed
- Refinement of the payment status check (10 minutes for shortpolling and recreate websocket connection if time expired)

## [0.3.0] - 2022-08-30

### Added
- SDK methods for working with subscriptions (`XsollaSubscriptions` class)

### Changed
- SDK methods for working with catalog (`XsollaCatalog` class). They support catalog personalization

## [0.2.0] - 2022-06-01

### Added
- Ability to open payment UI via build-in browser on mobile devices. Custom Tabs are used for Android and WebView is used for iOS

### Changed
- `XsollaInventory.getSubscriptions()` SDK method. The method was renamed to `XsollaInventory.getTimeLimitedItems()`
