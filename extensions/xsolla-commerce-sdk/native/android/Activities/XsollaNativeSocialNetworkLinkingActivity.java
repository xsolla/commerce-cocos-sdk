// Copyright 2023 Xsolla Inc. All Rights Reserved.

package com.cocos.game;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.Nullable;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;
import com.xsolla.android.login.XLogin;
import com.xsolla.android.login.callback.FinishSocialLinkingCallback;
import com.xsolla.android.login.callback.StartSocialLinkingCallback;
import com.xsolla.android.login.social.SocialNetwork;

public class XsollaNativeSocialNetworkLinkingActivity extends Activity {

    public static final String ARG_TOKEN = "token";
    public static final String ARG_NETWORK_NAME = "network_name";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String tokenStr = getIntent().getStringExtra(ARG_TOKEN);
        XLogin.setTokenData("", tokenStr, System.currentTimeMillis() / 1000 + 3600);

        String networkStr = getIntent().getStringExtra(ARG_NETWORK_NAME).toUpperCase();
        SocialNetwork network = SocialNetwork.valueOf(networkStr);
        XLogin.startSocialLinking(network, this, new StartSocialLinkingCallback() {
            @Override
            public void onLinkingStarted() {
                Log.d("XsollaSocialLinking", "onStartSocialLinking");
            }

            @Override
            public void onError(@Nullable Throwable throwable, @Nullable String error) {
                String errorMessage = (error != null && !error.isEmpty()) ? error : "Unknown error";
                Log.d("XsollaSocialLinking", "onLinkingError: " + errorMessage);

                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"socialNetworkLinkingError\"," + "\"" + errorMessage + "\"" + ")");
                    }
                });

                finish();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        XLogin.finishSocialLinking(requestCode, resultCode, data, new FinishSocialLinkingCallback() {
            @Override
            public void onLinkingSuccess() {
                Log.d("XsollaSocialLinking", "onLinkingSuccess");

                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        String networkStr = getIntent().getStringExtra(ARG_NETWORK_NAME).toUpperCase();
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"socialNetworkLinkingSuccess\"," + "\"" + networkStr + "\"" + ")");
                    }
                });

                finish();
            }

            @Override
            public void onLinkingCancelled() {
                Log.d("XsollaSocialLinking", "onLinkingCancelled");
                finish();
            }

            @Override
            public void onLinkingError(@Nullable Throwable throwable, @Nullable String error) {
                String errorMessage = (error != null && !error.isEmpty()) ? error : "Unknown error";
                Log.d("XsollaSocialLinking", "onLinkingError. Error: " + errorMessage);

                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"socialNetworkLinkingError\"," + "\"" + errorMessage + "\"" + ")");
                    }
                });

                finish();
            }
        });
    }
}