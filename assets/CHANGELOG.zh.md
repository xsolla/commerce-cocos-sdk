# 更改日志

## [0.7.0] - 2023-11-30

### 新增内容
- Centrifugo集成。不为Android和iOS编译版本建立WebSocket连接，而使用短轮询


### 更新内容
- `authWithXsollaWidget` SDK方法移至`XsollaAuth`
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
- `MoreLoginOptions`屏幕。可在演示项目中查看所有可用身份认证方式
- 移动平台新增`LOG IN WITH XSOLLA WIDGET`按钮。可打开艾克索拉登录管理器小组件

## [0.5.0] - 2023-06-28

### 更新内容
- `CurrencyFormatter`类从`xsolla-commerce-sdk`扩展移至演示项目
- `XsollaSettingsManager`类从演示项目移至`xsolla-commerce-sdk`扩展
- `checkPendingOrder`方法从演示项目移至`xsolla-commerce-sdk`扩展

### 移除内容
- `XsollaAndroid`类

## [0.4.0] - 2023-02-07

### 新增内容
- 设置验证

## [0.3.0] - 2022-08-30

### 新增内容
- 生成演示用户
