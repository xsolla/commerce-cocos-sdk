# 更改日志

## [0.7.0] - 2023-12-06

### 新增内容
- Centrifugo集成。不为Android和iOS编译版本建立WebSocket连接，而使用短轮询


### 更新内容
- `authWithXsollaWidget` SDK方法移至`XsollaAuth`类
- `authSocial` SDK方法移至`XsollaAuth`类
- `linkSocialNetwork` SDK方法移至`XsollaUserAccount`类
- `openPurchaseUI` SDK方法：移至`XsollaPayments`类，新增`onClose`回调参数（可选）
- 用于购物车管理的SDK方法。以下方法通过所指定的ID来操作购物车，如未指定ID，则操作当前用户的购物车：`getCart`、`clearCart`、`fillC
  art`、`updateItemInCart`、`removeItemFromCart`


### 移除内容
- `getCartById` SDK方法，改用`getCart`
- `clearCartById` SDK方法，改用`clearCart`
- `fillCartById` SDK方法，改用`fillCart`
- `updateItemInCartById` SDK方法，改用`updateItemInCart`
- `removeItemFromCartById` SDK方法，改用`removeItemFromCart`

### 修正内容
- 小问题

## [0.6.0] - 2023-09-14

### 新增内容
- `authWithXsollaWidget` NativeUtil方法。可在移动平台上打开艾克索拉登录管理器小组件
- 常见用户场景的代码示例。

### 更新内容
`XsollaSettingsManager`类：
- 项目设置新增`FacebookClientToken`参数。可设置通过Facebook Android应用进行本机用户认证
- `paymentInterfaceThemeWebGL`更名为`paymentInterfaceThemeIdWebGL`
- `paymentInterfaceThemeAndroid`更名为`paymentInterfaceThemeIdAndroid`
- `paymentInterfaceThemeIOS`更名为`paymentInterfaceThemeIdIOS`

## [0.5.0] - 2023-06-28

### 更新内容
- `fetchPaymentToken`和`fetchCartPaymentToken` SDK方法。新增`externalId`参数
- `XsollaSettingsManager`类。`paymentInterfaceThemeWebGL`、`paymentInterfaceThemeAndr
  oid`、`paymentInterfaceThemeIOS`转换为`string`
- 获取目录（`XsollaCatalog`类）的SDK方法。新增用于商品的`limits`参数
- 支付UI主题默认为`default_dark`
- `CurrencyFormatter`类从`xsolla-commerce-sdk`扩展移至演示项目
- `XsollaSettingsManager`类从演示项目移至`xsolla-commerce-sdk`扩展
- `checkPendingOrder`方法从演示项目移至`xsolla-commerce-sdk`扩展

## [0.4.0] - 2023-02-07

### 新增内容
- 支持下单免费商品。使用`createOrderWithSpecifiedFreeItem`和`createOrderWithFreeCart` 
  SDK方法进行实现。此外，`fetchCartPaymentToken` SDK方法也支持免费商品

### 更新内容
- 跟踪订单状态逻辑。订单状态通过Web socket来请求。5分钟后Web socket连接将重新创建。如Web 
  socket返回错误，则通过短轮询进行请求。短轮询有效期为10分钟

## [0.3.0] - 2022-08-30

### 新增内容
- 与订阅交互的SDK方法（`XsollaSubscriptions`类）

### 更新内容
- 与目录交互的SDK方法（`XsollaCatalog`类）。这些方法支持目录个性化

## [0.2.0] - 2022-06-01

### 新增内容
- 支持通过移动设备的内置浏览器打开支付UI。Android使用的是Custom Tabs，iOS使用的是WebView

### 更新内容
- `XsollaInventory.getSubscriptions()` 
  SDK方法。该方法已重命名为`XsollaInventory.getTimeLimitedItems()`
