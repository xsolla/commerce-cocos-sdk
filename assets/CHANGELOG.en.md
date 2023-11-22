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
- `MoreLoginOptions` screen. Allows to see all possible authentication options in demo project
- `LOG IN WITH XSOLLA WIDGET` button on mobile platforms. Allows to open Xsolla Login widget

## [0.5.0] - 2023-06-28

### Changed
- `CurrencyFormatter` class moved from `xsolla-commerce-sdk` extension to demo project
- `XsollaSettingsManager` class moved from demo project to `xsolla-commerce-sdk` extension
- `checkPendingOrder` method moved from demo project to `xsolla-commerce-sdk` extension

### Removed
- `XsollaAndroid` class

## [0.4.0] - 2023-02-07

### Added
- Settings validation

## [0.3.0] - 2022-08-30

### Added
- Demo user generation
