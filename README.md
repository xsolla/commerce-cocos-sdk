# Xsolla Commerce SDK for Cocos Creator

[![License](https://img.shields.io/github/license/xsolla/commerce-cocos-sdk)](https://github.com/xsolla/commerce-cocos-sdk/blob/master/extensions/xsolla-commerce-sdk/LICENSE.txt)
[![Cocos Creator 3.1+](https://img.shields.io/badge/Cocos%20Creator-3.1%2B-blue.svg)](https://www.cocos.com/en/creator)

*This article can also be read in [Chinese](https://github.com/xsolla/commerce-cocos-sdk/blob/master/extensions/xsolla-commerce-sdk/assets/README.zh.md).*

## Overview

A ready-to-use library for embedding Xsolla services into games built with Cocos Creator. It provides out-of-the-box data structures and methods for working with the Xsolla API, so you can integrate authentication, a store, payments, and subscriptions without building those flows yourself.

After integration you can use:

- **[Login](https://developers.xsolla.com/doc/login/)** — authenticate users, manage the friend system and user accounts
- **[In-Game Store](https://developers.xsolla.com/doc/in-game-store/)** — in-game purchases and player inventory
- **[Pay Station](https://developers.xsolla.com/doc/pay-station/)** — payments (700+ methods, 130+ currencies, 20+ UI languages)
- **[Subscriptions](https://developers.xsolla.com/doc/subscriptions/)** — recurring access to a package of services

## Requirements

- 64-bit OS — Windows 7+ or macOS 10.9+
- Cocos Creator 3.1.0 or later
- Target platforms: Android, iOS, HTML5

## Install

1. Go to the [Cocos Store listing](https://store.cocos.com/app/en/detail/3715)
2. Under **Creator Extension > Plugins**, choose Xsolla SDK and click **Get**
3. Click **Add To Project** to launch Cocos Dashboard
4. In Cocos Dashboard, click **Add To Project** and select your project
5. Click **Confirm** to download the SDK ZIP archive
6. Unzip the archive into your project's `assets` folder

Then set up a project in [Xsolla Publisher Account](https://publisher.xsolla.com/signup?store_type=sdk&utm_source=sdk&utm_medium=cocos-store).

## Usage

Once installed, call the SDK's modules (Login, In-Game Store, Pay Station, Subscriptions, inventory) from your Cocos Creator scripts. The full, step-by-step integration guide with code samples is here:

[Cocos integration guide → developers.xsolla.com/sdk/cocos/](https://developers.xsolla.com/sdk/cocos/)

## Documentation

- [Cocos SDK integration guide](https://developers.xsolla.com/sdk/cocos/)
- [Xsolla developer documentation](https://developers.xsolla.com/)
- [Xsolla official website](https://xsolla.com/)

## Support

- **GitHub Issues:** [github.com/xsolla/commerce-cocos-sdk/issues](https://github.com/xsolla/commerce-cocos-sdk/issues)
- **Support team and feedback:** [xsolla.com/partner-support](https://xsolla.com/partner-support)
- **Integration team:** integration@xsolla.com

## License

See the LICENSE file in the repo: [extensions/xsolla-commerce-sdk/LICENSE.txt](https://github.com/xsolla/commerce-cocos-sdk/blob/master/extensions/xsolla-commerce-sdk/LICENSE.txt).
