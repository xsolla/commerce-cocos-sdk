// Copyright 2025 Xsolla Inc. All Rights Reserved.

package com.cocos.game;

import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;
import com.xsolla.android.login.XLogin;
import com.xsolla.android.login.callback.UpdateCurrentUserDetailsCallback;
import com.xsolla.android.login.callback.UploadCurrentUserAvatarCallback;
import com.xsolla.android.login.entity.response.PictureResponse;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class XsollaNativeUtils {

    public static String getDeviceId() {
        return Settings.Secure.getString(AppActivity.getAppActivity().getContentResolver(), Settings.Secure.ANDROID_ID);
    }

    public static String getDeviceName() {
        return Build.MANUFACTURER + Build.MODEL;
    }

    public static String getPackageName() {
        return AppActivity.getAppActivity().getPackageName();
    }

    public static void updateUserProfilePicture(String filePath, String token) {
        AssetManager assetManager = AppActivity.getAppActivity().getAssets();
        InputStream inputStream = null;

        try {
            inputStream = assetManager.open(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }

        File avatarTempFile = new File(AppActivity.getAppActivity().getCacheDir() + "/avatar.png");
        if (!avatarTempFile.exists()) try {
            int size = inputStream.available();
            byte[] buffer = new byte[size];
            inputStream.read(buffer);
            inputStream.close();

            FileOutputStream fileOutputStream = new FileOutputStream(avatarTempFile);
            fileOutputStream.write(buffer);
            fileOutputStream.close();
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }

        XLogin.setTokenData("", token, System.currentTimeMillis() / 1000 + 3600);
        XLogin.uploadCurrentUserAvatar(avatarTempFile, new UploadCurrentUserAvatarCallback() {
            @Override
            public void onSuccess(@NonNull PictureResponse pictureResponse) {
                avatarTempFile.delete();
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"avatarUpdateSuccess\")");
                    }
                });
            }

            @Override
            public void onError(@Nullable Throwable throwable, @Nullable String errorMessage) {
                avatarTempFile.delete();
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"avatarUpdateError\"," + "\"" + errorMessage + "\"" + ")");
                    }
                });
            }
        });
    }

    public static void modifyUserAccountData(String token, String birthday, String firstName, String gender, String lastName, String nickname) {

        XLogin.setTokenData("", token, System.currentTimeMillis() / 1000 + 3600);

        XLogin.updateCurrentUserDetails(firstName, gender, lastName, nickname, new UpdateCurrentUserDetailsCallback() {
            @Override
            public void onSuccess() {
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"accountDataUpdateSuccess\")");
                    }
                });
            }

            @Override
            public void onError(@Nullable Throwable throwable, @Nullable String errorMessage) {
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.director.getScene().emit(\"accountDataUpdateError\"," + "\"" + errorMessage + "\"" + ")");
                    }
                });
            }
        });
    }

    public static void linkSocialNetwork(String token, String networkName){
        Activity appActivity = AppActivity.getAppActivity();
        Intent intent = new Intent(appActivity, XsollaNativeSocialNetworkLinkingActivity.class);
        intent.putExtra(XsollaNativeSocialNetworkLinkingActivity.ARG_TOKEN, token);
        intent.putExtra(XsollaNativeSocialNetworkLinkingActivity.ARG_NETWORK_NAME, networkName);
        appActivity.startActivity(intent);
    }
}