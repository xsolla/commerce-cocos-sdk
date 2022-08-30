# 更改日志

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
