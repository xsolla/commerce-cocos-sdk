*本文亦提供[英文版本](https://github.com/xsolla/commerce-cocos-sdk/blob/master/extensions/xsolla-commerce-sdk/assets/README.en.md)。*

通过此现成库轻松将艾克索拉服务嵌入使用Cocos Creator开发的游戏。

本SDK提供与艾克索拉API交互的现成可用的数据结构和方法，简化将艾克索拉产品集成到Cocos Creator项目的过程。

集成后，您可以：

* 使用[登录管理器](https://developers.xsolla.com/zh/doc/login/)认证用户身份及管理好友系统和用户帐户。
* 使用[游戏内商店](https://developers.xsolla.com/zh/doc/in-game-store/)在您的应用程序中管理游戏内购买和玩家物品库。
* 使用[支付中心](https://developers.xsolla.com/zh/doc/pay-station/)设置支付流程。
* 使用[订阅](https://developers.xsolla.com/zh/doc/subscriptions/)在指定条件下（即订阅价格和有效时间）向用户提供对
  服务套餐的访问权限。

[了解支持功能的详细信息 →](#features)

要开始使用SDK，需安装此扩展并在[艾克索拉发布商项目](https://publisher.xsolla.com/signup?store_type=sdk&utm_source=sdk&utm_medium=cocos-store)中设置项目。

[前往集成指南 →](https://developers.xsolla.com/zh/sdk/cocos/integrate-complete-solution/?utm_source=sdk&utm_medium=cocos-store)

## 功能

### 用户认证

* 基于[OAuth 2.0](https://oauth.net/2/)协议的认证。
* 通过用户名/邮箱和密码进行的经典登录。
* 社交网络登录。
* 通过设备ID登录。
* 通过短信或邮件发送的一次性验证码或链接进行免密登录。


### 用户管理

* 通过用户属性管理补充信息。
* 用户帐户。
* 好友系统。
* 安全的艾克索拉数据存储。您也可以连接PlayFab、Firebase或自定义存储。

 **信息提示：** 您也可以在艾克索拉发布商帐户中管理用户帐户和访问权限。 

### 目录

* 虚拟货币：
  * 以任意金额或以套餐形式销售虚拟货币（可用真实货币或其他虚拟货币进行购买）。
  * 销售硬货币（只能用真实货币购买）。
* 虚拟物品：
  * 设置游戏内商品的目录。
  * 以真实货币和虚拟货币的形式销售虚拟物品。
* 捆绑包：
  * 以真实货币或虚拟货币的形式销售捆绑包。
* 促销活动：
  * 通过优惠券给予用户虚拟货币套餐、游戏密钥或虚拟物品的奖励。
  * 通过促销码给予用户奖励或购物车商品折扣。
* 一键购买商品或通过购物车购买。

**信息提示：** 您可以通过艾克索拉发布商帐户在目录中添加商品及管理折扣、优惠券和促销码活动。

### 订阅
* 销售订阅。
* 订阅续订和取消。
* 在用户仪表板中管理订阅。

**信息:** 您可以通过艾克索拉发布商帐户添加和管理订阅计划。

### 商品购买

* 为玩家提供便捷的支付UI。主要功能有：
  * 200多个国家/地区的700多种付款方式，包括银行卡、电子钱包、移动支付、自助终端机、礼品卡以及特别奖励等。
  * 130多种货币。
  * 20多种语言的本地化UI。
  * 桌面和移动版本。

**信息提示：** 艾克索拉发布商帐户为您提供购买分析、交易历史记录及其他统计数据。


### 玩家物品库

* 获取并验证物品库。
* 根据游戏逻辑消耗物品。
* 根据游戏内逻辑消耗虚拟货币（例如通过支付货币解锁某个地点或购买关卡时）。
* 跨所有平台同步用户购买的商品和付费奖励。


## 要求


### 系统要求

* 64位操作系统
* Windows 7及更高版本
* macOS 10.9及更高版本
* 支持的最低Cocos Creator版本 — 3.1.0


### 终端操作系统

* Android
* iOS
* HTML5

本SDK使用[Google移动服务](https://www.android.com/gms/)，不支持在没有Google移动服务的设备（如华为等）上使用的编译
版本。

## 定价

艾克索拉提供必要的工具来帮助您建立和发展您的游戏业务，包括在每个阶段提供个性化的支持。付款条件由在发布商帐户中签署的合同决定。

艾克索拉只收取通过艾克索拉支付中心进行的游戏内交易所得的5%作为费用。如果您在应用程序中使用的不是艾克索拉支付中心而是其他产品，请联系您的帐户经理澄清相关条款和
条件。

浏览帮助您与艾克索拉顺利合作的[法律信息](https://xsolla.com/legal-agreements)。


## 许可证
请参阅[许可证](https://github.com/xsolla/commerce-cocos-sdk/blob/master/extensions/xsolla-commerce-sdk/LICENSE.txt)文件。


## 联系方式

* [支持团队和反馈](https://xsolla.com/partner-support)
* [集成团队](mailto:integration@xsolla.com)


## 其他资源

* [艾克索拉官方网站](https://xsolla.com/)
* [开发者文档](https://developers.xsolla.com/zh/sdk/cocos/?utm_source=sdk&utm_medium=cocos-store)
