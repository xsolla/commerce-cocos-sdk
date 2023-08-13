// Copyright 2023 Xsolla Inc. All Rights Reserved.

package com.cocos.game;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.Keep;

import com.xsolla.android.login.XLogin;
import com.xsolla.android.login.LoginConfig;
import com.xsolla.android.login.social.SocialNetwork;

@Keep
public class XsollaNativeAuth {

    @Keep
    public static void xLoginInit(String loginID, String clientId, String facebookAppId, String facebookClientToken, String googleAppId, String wechatAppId, String qqAppId) {
        XLogin.SocialConfig socialConfig = new XLogin.SocialConfig(facebookAppId, facebookClientToken, googleAppId, wechatAppId, qqAppId);
        LoginConfig loginConfig = new LoginConfig.OauthBuilder().
                setProjectId(loginID).
                setOauthClientId(Integer.parseInt(clientId)).
                setSocialConfig(socialConfig).
                build();
        XLogin.init(AppActivity.getAppActivity(), loginConfig);
    }

    @Keep
    public static void authSocial(String provider, boolean invalidateToken) {
        Activity appActivity = AppActivity.getAppActivity();
        SocialNetwork socialNetwork = SocialNetwork.valueOf(provider.toUpperCase());
        Intent intent = new Intent(appActivity, XsollaNativeAuthActivity.class);
        intent.putExtra(XsollaNativeAuthActivity.ARG_SOCIAL_NETWORK, socialNetwork.name());
        intent.putExtra(XsollaNativeAuthActivity.ARG_WITH_LOGOUT, invalidateToken);
        appActivity.startActivity(intent);
    }

    @Keep
    public static void authViaXsollaWidget() {
        Activity appActivity = AppActivity.getAppActivity();
        Intent intent = new Intent(appActivity, XsollaNativeXsollaWidgetAuthActivity.class);
        appActivity.startActivity(intent);
    }
}
