# Changelog

## [0.7.0] - 2023-11-30

### Added
- Centrifugo integration. Doesn’t establish web socket connection for Android and iOS builds, short polling is used instead


### Changed
- `authWithXsollaWidget` SDK method moved to `XsollaAuth`
- `authSocial` SDK method moved to `XsollaAuth` class
- `linkSocialNetwork` SDK method moved to `XsollaUserAccount` class
- `openPurchaseUI` SDK method: moved to `XsollaPayments` class, added `onClose` callback parameter (optional)
- SDK methods for cart management. The following methods operate with the cart with specified ID or with the cart of current user if ID is not specified: `getCart`, `clearCart`, `fillCart`, `updateItemInCart`, `removeItemFromCart`


### Removed
- `getCartById` SDK method , use `getCart` instead
- `clearCartById` SDK method , use `clearCart` instead
- `fillCartById` SDK method , use `fillCart` instead
- `updateItemInCartById` SDK method , use `updateItemInCart` instead
- `removeItemFromCartById` SDK method , use `removeItemFromCart` instead

### Fixed
- Minor bugs

## [0.6.0] - 2023-09-14

### Added
- `authWithXsollaWidget` NativeUtil method. Allows to open Xsolla Login widget on mobile platforms
- Code samples for most common user scenarios.

### Updated
`XsollaSettingsManager` class:
- Added `FacebookClientToken` parameter for project settings. Allows to set up native user authentication via Facebook Android application
- `paymentInterfaceThemeWebGL` renamed to `paymentInterfaceThemeIdWebGL`
- `paymentInterfaceThemeAndroid` renamed to `paymentInterfaceThemeIdAndroid`
- `paymentInterfaceThemeIOS` renamed to `paymentInterfaceThemeIdIOS`

## [0.5.0] - 2023-06-28

### Changed
- `fetchPaymentToken` and `fetchCartPaymentToken` SDK methods. Added the `externalId` parameter
- `XsollaSettingsManager` class. The `paymentInterfaceThemeWebGL`, `paymentInterfaceThemeAndroid`, `paymentInterfaceThemeIOS` are converted to `string`
- SDK methods for getting catalog (`XsollaCatalog` class). Added the `limits` parameter for items
- Payment UI theme is `default_dark` by default
- `CurrencyFormatter` class moved from `xsolla-commerce-sdk` extension to demo project
- `XsollaSettingsManager` class moved from demo project to `xsolla-commerce-sdk` extension
- `checkPendingOrder` method moved from demo project to `xsolla-commerce-sdk` extension

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
