# Changelog

## [0.4.0] - 2023-02-07

### Added
- Ability to order free items. Use `createOrderWithSpecifiedFreeItem` and `createOrderWithFreeCart` SDK methods to implement it. The `fetchCartPaymentToken` SDK method also supports free items

### Changed
- Tracking order status logic. Order status is requested via a web socket. After 5 minutes, the web socket connection is re-created. If the web socket returned an error, the status is requested with a short-polling. Short-polling is expired after 10 minutes

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
