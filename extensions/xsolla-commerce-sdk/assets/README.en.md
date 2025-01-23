*This article can also be read in [Chinese](https://github.com/xsolla/commerce-cocos-sdk/blob/master/extensions/xsolla-commerce-sdk/assets/README.zh.md).*

Easily embed Xsolla services with this ready-to-use library for games developed using Cocos Creator.

The SDK simplifies integrating Xsolla products into your Cocos Creator project by providing out-of-the-box data structures and methods for working with Xsolla API.

After integration, you can use:

* [Login](https://developers.xsolla.com/doc/login/) to authenticate users and manage the friend system and user accounts.
* [In-Game Store](https://developers.xsolla.com/doc/in-game-store/) for managing in-game purchases and player inventory in your application.
* [Pay Station](https://developers.xsolla.com/doc/pay-station/) for setting up payments.
* [Subscriptions](https://developers.xsolla.com/doc/subscriptions/) to provide users with access to a package of services under specified conditions (subscription cost and duration).

[Learn more about supported features →](#features)

To get started with the SDK, you need to install this extension and set up a project in [Xsolla Publisher Account](https://publisher.xsolla.com/signup?store_type=sdk&utm_source=sdk&utm_medium=cocos-store).

[Go to the integration guide →](https://developers.xsolla.com/sdk/cocos/)

## Features

### Authentication

* [OAuth 2.0](https://oauth.net/2/) protocol-based authentication.
* Classic login via username/email and password.
* Social login.
* Login using a device ID.
* Passwordless login via a one-time code or a link sent via SMS or email.


### User management

* User attributes to manage additional information.
* User account.
* Friend system.
* Secure Xsolla storage for user data. Alternatively, you can connect PlayFab, Firebase, or your own custom storage.

**INFO:** You can also manage user accounts and access rights in Xsolla Publisher Account.

### Catalog

* Virtual currency:
    * Sell virtual currency in any amount or in packages (for real money or other virtual currency).
    * Sell hard currency (for real money only).
* Virtual items:
    * Set up a catalog of in-game items.
    * Sell virtual items for real and virtual currency.
* Bundles:
    * Sell bundles for real or virtual currency.
* Promotional campaigns:
    * Reward users with virtual currency packages, game keys, or virtual items for coupons.
    * Give users bonuses or discounts on items in the cart with promo codes.
* Sell items with one click or using the shopping cart.

**INFO:** You can add items in the catalog or manage campaigns with discounts, coupons, and promo codes via Xsolla Publisher Account.

### Subscriptions
* Selling subscriptions.
* Subscription renewal and cancelation.
* Subscription management from a user’s dashboard.

**INFO:** You can add and manage subscription plans via Xsolla Publisher Account.

### Item purchase

* Provide users with a convenient payment UI. The main features are:
    * 700+ payment methods in 200+ countries, including bank cards, digital wallets, mobile payments, cash kiosks, gift cards, and special offers.
    * 130+ currencies.
    * UI localized into 20+ languages.
    * Desktop and mobile versions.

**INFO:** Xsolla Publisher Account provides you with purchase analytics, transaction history, and other statistics.


### Player inventory

* Get and verify an inventory.
* Consume items according to the in-game logic.
* Spend virtual currency according to the in-game logic (for example, when opening a location or purchasing a level).
* Synchronize all purchases and premium rewards of the user across all platforms.


## Requirements


### System requirements

* 64-bit OS
* Windows 7 and higher
* macOS 13.6.6 and higher
* Minimum supported version of Cocos Creator — 3.3.1


### Target OS

* Android
* iOS
* HTML5

The SDK uses [Google Mobile Services](https://www.android.com/gms/) and doesn’t support builds for devices without Google Mobile Services, such as Huawei.

## Pricing

Xsolla offers the necessary tools to help you build and grow your gaming business, including personalized support at every stage. The terms of payment are determined by the contract that you can sign in Publisher Account.

Xsolla only charges 5% of the amount you receive for in-game purchases made through Xsolla Pay Station. If you don’t use Xsolla Pay Station in your application, but use other products, contact your Account Manager to clarify the terms and conditions.

Explore [legal information](https://xsolla.com/legal-agreements) that helps you work with Xsolla.


## License
See the [LICENSE](https://github.com/xsolla/commerce-cocos-sdk/blob/master/extensions/xsolla-commerce-sdk/LICENSE.txt) file.


## Contacts

* [Support team and feedback](https://xsolla.com/partner-support)
* [Integration team](mailto:integration@xsolla.com)


## Additional resources

* [Xsolla official website](https://xsolla.com/)
* [Developers documentation](https://developers.xsolla.com/sdk/cocos//?utm_source=sdk&utm_medium=cocos-store)
