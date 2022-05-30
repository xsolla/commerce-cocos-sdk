// Copyright 2022 Xsolla Inc. All Rights Reserved.

package com.cocos.game;

import android.app.Activity;
import android.content.Intent;
import androidx.annotation.Keep;

@Keep
public class XsollaNativePayments {

    @Keep
    public static void openPurchaseUI(String token, boolean sandbox, String redirectScheme, String redirectHost ) {
        Activity appActivity = AppActivity.getAppActivity();
        Intent intent = new Intent(appActivity, XsollaNativePaymentsActivity.class);
        intent.putExtra(XsollaNativePaymentsActivity.ARG_TOKEN, token);
        intent.putExtra(XsollaNativePaymentsActivity.ARG_SANDBOX, sandbox);
        intent.putExtra(XsollaNativePaymentsActivity.ARG_REDIRECT_HOST, redirectHost);
        intent.putExtra(XsollaNativePaymentsActivity.ARG_REDIRECT_SCHEME, redirectScheme);
        appActivity.startActivity(intent);
    }
}
