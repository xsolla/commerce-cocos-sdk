package com.cocos.game;

import android.content.res.AssetManager;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;
import com.xsolla.android.login.XLogin;
import com.xsolla.android.login.callback.UpdateCurrentUserDetailsCallback;
import com.xsolla.android.login.callback.UploadCurrentUserAvatarCallback;
import com.xsolla.android.login.entity.response.PictureResponse;
import com.xsolla.android.login.token.TokenUtils;

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

    public static void updateUserProfilePicture(String filePath, String token, boolean isOauth) {
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

        TokenUtils tokenUtils = new TokenUtils(AppActivity.getAppActivity());
        if(isOauth) {
            tokenUtils.setOauthAccessToken(token);
        }
        else {
            tokenUtils.setJwtToken(token);
        }

        XLogin.uploadCurrentUserAvatar(avatarTempFile, new UploadCurrentUserAvatarCallback() {
            @Override
            public void onSuccess(@NonNull PictureResponse pictureResponse) {
                avatarTempFile.delete();
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.find(\"Canvas/pref_UserAccountScreen\").getComponent(\"UserAccountManager\").handleSuccessfulAvatarUpdate()");
                    }
                });
            }

            @Override
            public void onError(@Nullable Throwable throwable, @Nullable String s) {
                avatarTempFile.delete();
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.find(\"Canvas/pref_UserAccountScreen\").getComponent(\"UserAccountManager\").handleErrorAvatarUpdate(\"" + s + "\")");
                    }
                });
            }
        });
    }

    public static void modifyUserAccountData(String token, String birthday, String firstName, String gender, String lastName, String nickname, boolean isOauth) {

        TokenUtils tokenUtils = new TokenUtils(AppActivity.getAppActivity());
        if(isOauth) {
            tokenUtils.setOauthAccessToken(token);
        }
        else {
            tokenUtils.setJwtToken(token);
        }

        XLogin.updateCurrentUserDetails(birthday,firstName,gender,lastName,nickname, new UpdateCurrentUserDetailsCallback() {
            @Override
            public void onSuccess() {
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.find(\"Canvas/pref_UserAccountScreen\").getComponent(\"UserAccountManager\").handleSuccessfulUserAccountDataUpdate()");
                    }
                });
            }

            @Override
            public void onError(@Nullable Throwable throwable, @Nullable String s) {
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        CocosJavascriptJavaBridge.evalString("cc.find(\"Canvas/pref_UserAccountScreen\").getComponent(\"UserAccountManager\").handleErrorUserAccountDataUpdate(\"" + s + "\")");
                    }
                });
            }
        });
    }
}
