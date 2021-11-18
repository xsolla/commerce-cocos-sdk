package com.cocos.game;

import android.provider.Settings;

public class XsollaNativeUtils {

    public static String getDeviceId() {
        return Settings.Secure.getString(AppActivity.getAppActivity().getContentResolver(), Settings.Secure.ANDROID_ID);
    }
}
