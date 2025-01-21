// Copyright 2025 Xsolla Inc. All Rights Reserved.

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

import org.json.JSONException;
import org.json.JSONObject;

public class XsollaNativeAuthActivity extends Activity {
    public static String ARG_SOCIAL_NETWORK = "social_network";
    public static String ARG_WITH_LOGOUT = "with_logout";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SocialNetwork socialNetwork = SocialNetwork.valueOf(getIntent().getStringExtra(ARG_SOCIAL_NETWORK));
        boolean withLogout = getIntent().getBooleanExtra(ARG_WITH_LOGOUT, false);

        XLogin.startSocialAuth(this, socialNetwork, new StartSocialCallback() {
            @Override
            public void onAuthStarted() {
                Log.d("XsollaNativeAuthActivity", "onAuthStarted");
            }

            @Override
            public void onError(Throwable throwable, String s) {
                Log.d("XsollaNativeAuthActivity", "onError");
                finish();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        SocialNetwork socialNetwork = SocialNetwork.valueOf(getIntent().getStringExtra(ARG_SOCIAL_NETWORK));
        XLogin.finishSocialAuth(this, socialNetwork, requestCode, resultCode, data, new FinishSocialCallback() {
            @Override
            public void onAuthSuccess() {
                Log.d("XsollaNativeAuthActivity", "onAuthSuccess");

                JSONObject tokenJson = new JSONObject();
                try {
                    tokenJson.put("access_token", XLogin.getToken());
                    tokenJson.put("refresh_token", XLogin.getRefreshToken());
                    tokenJson.put("token_type", "bearer");
                    tokenJson.put("expires_in", XLogin.getTokenExpireTime() - System.currentTimeMillis() / 1000);
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
                Log.d("XsollaNativeAuthActivity", "onAuthCanceled");
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
                Log.d("XsollaNativeAuthActivity", "onAuthError");
                String errorMessage = (error != null && !error.isEmpty()) ? error : "Unknown error";
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"socialAuthError\"," + "\"" + errorMessage + "\"" + ")");
                    }
                });
                finish();
            }
        });
    }
}