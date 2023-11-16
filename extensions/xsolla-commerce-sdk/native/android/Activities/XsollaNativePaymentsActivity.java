// Copyright 2023 Xsolla Inc. All Rights Reserved.

package com.cocos.game;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;
import com.xsolla.android.payments.XPayments;
import com.xsolla.android.payments.data.AccessToken;

public class XsollaNativePaymentsActivity extends Activity {

    public static final String ARG_TOKEN = "token";
    public static final String ARG_SANDBOX = "sandbox";
    public static final String ARG_REDIRECT_SCHEME = "redirect_scheme";
    public static final String ARG_REDIRECT_HOST = "redirect_host";
    private static final int RC_PAY_STATION = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        String token = intent.getStringExtra(ARG_TOKEN);
        boolean isSandbox = intent.getBooleanExtra(ARG_SANDBOX, false);
        String redirectScheme = intent.getStringExtra(ARG_REDIRECT_SCHEME);
        String redirectHost = intent.getStringExtra(ARG_REDIRECT_HOST);

        XPayments.IntentBuilder builder = XPayments.createIntentBuilder(this)
                .accessToken(new AccessToken(token))
                .isSandbox(isSandbox);

        if (redirectScheme != null)
            builder.setRedirectUriScheme(redirectScheme);

        if (redirectHost != null)
            builder.setRedirectUriHost(redirectHost);

        startActivityForResult(builder.build(), RC_PAY_STATION);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        XPayments.Result result = data.getParcelableExtra("result");
        String isManually = result.getStatus() == XPayments.Status.CANCELLED ? "true" : "false";

        Log.d("XsollaNativePaymentsActivity", "payment was closed with status: " + result.getStatus());
        CocosHelper.runOnGameThread(new Runnable() {
            @Override
            public void run() {
                CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"paymentClose\"," + "\"" +  isManually + "\"" + ")");
            }
        });
        finish();
    }
}
