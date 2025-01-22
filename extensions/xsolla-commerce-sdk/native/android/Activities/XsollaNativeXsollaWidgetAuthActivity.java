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
import com.xsolla.android.login.callback.FinishXsollaWidgetAuthCallback;
import com.xsolla.android.login.callback.StartXsollaWidgetAuthCallback;

import org.json.JSONException;
import org.json.JSONObject;

public class XsollaNativeXsollaWidgetAuthActivity extends Activity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        XLogin.startAuthWithXsollaWidget(this, new StartXsollaWidgetAuthCallback() {
            @Override
            public void onAuthStarted() {
                Log.d("XsollaNativeXsollaWidgetAuthActivity", "onAuthStarted");
            }

            @Override
            public void onError(Throwable throwable, String s) {
                Log.d("XsollaNativeXsollaWidgetAuthActivity", "onError");
                finish();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        XLogin.finishAuthWithXsollaWidget(this, requestCode, resultCode, data, new FinishXsollaWidgetAuthCallback() {
            @Override
            public void onAuthSuccess() {
                Log.d("XsollaNativeXsollaWidgetAuthActivity", "onAuthSuccess");

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
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"xsollaWidgetAuthSuccess\"," + tokenJson.toString() + ")");
                    }
                });
                finish();
            }

            @Override
            public void onAuthCancelled() {
                Log.d("XsollaNativeXsollaWidgetAuthActivity", "onAuthCanceled");
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"xsollaWidgetAuthCanceled\")");
                    }
                });
                finish();
            }

            @Override
            public void onAuthError(Throwable throwable, String error) {
                Log.d("XsollaNativeXsollaWidgetAuthActivity", "onAuthError");
                String errorMessage = (error != null && !error.isEmpty()) ? error : "Unknown error";
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"xsollaWidgetAuthError\"," + "\"" + errorMessage + "\"" + ")");
                    }
                });
                finish();
            }
        });
    }
}