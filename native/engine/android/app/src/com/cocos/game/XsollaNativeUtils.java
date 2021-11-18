package com.cocos.game;

import android.os.Build;
import android.provider.Settings;

public class XsollaNativeUtils {

    public static String getDeviceId() {
        return Settings.Secure.getString(AppActivity.getAppActivity().getContentResolver(), Settings.Secure.ANDROID_ID);
    }

    public static String getDeviceName() {
        return Build.MANUFACTURER + Build.MODEL;
    }
}
