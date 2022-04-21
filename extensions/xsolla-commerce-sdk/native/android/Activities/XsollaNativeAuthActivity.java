// Copyright 2022 Xsolla Inc. All Rights Reserved.

package com.cocos.game;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;
import com.xsolla.android.login.XLogin;
import com.xsolla.android.login.callback.FinishSocialCallback;
import com.xsolla.android.login.callback.StartSocialCallback;
import com.xsolla.android.login.social.SocialNetwork;
import com.xsolla.android.login.token.TokenUtils;

import org.json.JSONException;
import org.json.JSONObject;

public class XsollaNativeAuthActivity extends Activity {
    public static String ARG_SOCIAL_NETWORK = "social_network";
    public static String ARG_WITH_LOGOUT = "with_logout";
	public static String REMEMBER_ME = "remember_me";

    private TokenUtils tokenUtils;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        tokenUtils = new TokenUtils(this);

        SocialNetwork socialNetwork = SocialNetwork.valueOf(getIntent().getStringExtra(ARG_SOCIAL_NETWORK));
        boolean withLogout = getIntent().getBooleanExtra(ARG_WITH_LOGOUT, false);

        XLogin.startSocialAuth(this, socialNetwork, withLogout, new StartSocialCallback() {
            @Override
            public void onAuthStarted() {
                Log.d("XsollaAuthActivity", "onAuthStarted");
            }

            @Override
            public void onError(Throwable throwable, String s) {
                Log.d("XsollaAuthActivity", "onError");
                finish();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        SocialNetwork socialNetwork = SocialNetwork.valueOf(getIntent().getStringExtra(ARG_SOCIAL_NETWORK));
        boolean withLogout = getIntent().getBooleanExtra(ARG_WITH_LOGOUT, false);

        XLogin.finishSocialAuth(this, socialNetwork, requestCode, resultCode, data, withLogout, new FinishSocialCallback() {
            @Override
            public void onAuthSuccess() {
                Log.d("XsollaAuthActivity", "onAuthSuccess");

                JSONObject tokenJson = new JSONObject();
                try {
                    tokenJson.put("access_token", XLogin.getToken());
                    tokenJson.put("refresh_token", tokenUtils.getOauthRefreshToken());
                    tokenJson.put("token_type", "bearer");
                    tokenJson.put("expires_in", tokenUtils.getOauthExpireTimeUnixSec());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"socialAuthSuccess\"," + tokenJson.toString() + ")");
                    }
                });
                finish();
            }

            @Override
            public void onAuthCancelled() {
                Log.d("XsollaAuthActivity", "onAuthCanceled");
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"socialAuthCanceled\")");
                    }
                });
                finish();
            }

            @Override
            public void onAuthError(Throwable throwable, String error) {
                Log.d("XsollaAuthActivity", "onAuthError");
                String errorMessage = (error != null && !error.isEmpty()) ? error : "Unknown error";
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"socialAuthError\"," + errorMessage + ")");
                    }
                });
                finish();
            }
        });
    }
}