# 更改日志

## 

### 新增内容
- 
- 

### 
- 

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
