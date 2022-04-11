// Copyright 2021 Xsolla Inc. All Rights Reserved.

package com.cocos.game;

import android.content.Intent;

import androidx.annotation.Keep;

import com.xsolla.android.login.XLogin;
import com.xsolla.android.login.LoginConfig;
import com.xsolla.android.login.social.SocialNetwork;

@Keep
public class XsollaNativeAuth {

    @Keep
    public static void xLoginInit(String loginID, String clientId, String callbackUrl, String facebookAppId, String googleAppId, String wechatAppId, String qqAppId) {
        XLogin.SocialConfig socialConfig = new XLogin.SocialConfig(facebookAppId, googleAppId, wechatAppId, qqAppId);
        LoginConfig loginConfig = new LoginConfig.OauthBuilder().
                setProjectId(loginID).
                setOauthClientId(Integer.parseInt(clientId)).
                setCallbackUrl(callbackUrl).
                setSocialConfig(socialConfig).
                build();
        XLogin.init(AppActivity.getAppActivity(), loginConfig);
    }

    @Keep
    public static void authSocial(String provider, boolean rememberMe, boolean invalidateToken) {
        SocialNetwork socialNetwork = SocialNetwork.valueOf(provider.toUpperCase());
        Intent intent = new Intent(AppActivity.getAppActivity(), XsollaNativeAuthActivity.class);
        intent.putExtra(XsollaNativeAuthActivity.ARG_SOCIAL_NETWORK, socialNetwork.name());
        intent.putExtra(XsollaNativeAuthActivity.ARG_WITH_LOGOUT, invalidateToken);
        intent.putExtra(XsollaNativeAuthActivity.REMEMBER_ME, rememberMe);
        AppActivity.getAppActivity().startActivity(intent);
    }
}
