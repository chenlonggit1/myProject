/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.content.Context;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import android.support.annotation.RequiresApi;
import android.view.WindowManager;

import com.kys.common.bridge.ScriptBridgeUtils;
import com.kys.common.broadcast.BatteryReceiver;
import com.kys.common.broadcast.InstallReceiver;
import com.kys.common.broadcast.NetworkReceiver;
import com.umeng.analytics.MobclickAgent;
import com.umeng.analytics.game.UMGameAgent;
import com.umeng.commonsdk.UMConfigure;

import java.io.File;
import java.util.Random;

public class AppActivity extends Cocos2dxActivity implements PermissionUtils.PermissinBackListener {

    private boolean isUseYM = true;
    private BatteryReceiver batteryReceiver = null;
    private InstallReceiver installReceiver = null;
    private NetworkReceiver networkReceiver = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!isTaskRoot()) {
            return;
        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        SDKWrapper.getInstance().init(this);
        AndroidHelper.getHelper().init(this);
        ScriptBridgeUtils.getInstance().init(this);

        String channel = AndroidHelper.getAPKChannel();
        if (channel == "") {
            channel = "kys";
        }
        int num = this.getRandom();
        if (channel == "kys48") {
            if (num > 40) {
                isUseYM = false;
            }
        }
        if (channel == "kys49") {
            if (num > 50) {
                isUseYM = false;
            }
        }
        if (channel == "kys50") {
            if (num > 60) {
                isUseYM = false;
            }
        }
        if (isUseYM) {
            UMGameAgent.init(this);
            // 初始化友盟
            UMConfigure.init(this, "5f5723a83739314483bda6f2", channel, UMConfigure.DEVICE_TYPE_PHONE, null);
            // 设置输出运行时日志
            UMConfigure.setLogEnabled(true);
        }
        //如需要判断权限可按照以下方式，否则可以直接在此downFile()，无需使用permissionUtils作以下操作
        AndroidHelper.getHelper().permissionUtils = new PermissionUtils(this);
        AndroidHelper.getHelper().permissionUtils.setPermissinBackListener(this);
        // 判断是否需要清理热更包文件夹
        this.checkVer();
        // 注册广播
        this.registerReceivers();
    }

    private void setRandom(int num) {
        SharedPreferences sharedPref = this.getPreferences(Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putInt("random", num);
        editor.commit();
    }

    private int getRandom() {
        SharedPreferences sharedPref = this.getPreferences(Context.MODE_PRIVATE);
        int defaultValue = -1;
        int num = sharedPref.getInt("random", defaultValue);
        if (defaultValue == num) {
            Random random = new Random();
            // 生成一个1-100的伪随机整数
            num = random.nextInt(100);
            this.setRandom(num);
        }
        return num;
    }

    // 判断APK版本是否变更，如有变更清除热更资源文件夹
    private void checkVer() {
        File file = new File("/data/data/com.hbddz.qihoo/files/ver.log");
        if (file.exists()) {
            String ver1 = AndroidHelper.getAppVersion();
            String ver2 = FileUtils.readFileData(this, "ver.log");
            if (!ver1.equals(ver2)) {
                this.delAsset();
                FileUtils.writeFileData(this, "ver.log", ver1);
            } else {
            }
        } else {
            this.delAsset();
            FileUtils.writeFileData(this, "ver.log", AndroidHelper.getAppVersion());
        }
    }

    // 删除热更资源文件夹
    private boolean delAsset() {
        // 删除临时文件夹
        File file_temp = new File("/data/data/com.hbddz.qihoo/files/remote_asset_temp");
        if (file_temp.exists() && file_temp.isDirectory()) {
            String dir = file_temp.getAbsolutePath();
            System.out.println(dir);
            FileUtils.deleteDirectory(dir);
        }
        // 删除热更文件夹
        File file = new File("/data/data/com.hbddz.qihoo/files/remote_asset");
        if (file.exists() && file.isDirectory()) {
            String dir = file.getAbsolutePath();
            System.out.println(dir);
            return FileUtils.deleteDirectory(dir);
        } else {
            return false;
        }
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);
        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
        AndroidHelper.getHelper().activityLifecycle(true);
        if (isUseYM) {
            MobclickAgent.onResume(this);
            UMGameAgent.onResume(this);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
        AndroidHelper.getHelper().activityLifecycle(false);
        if (isUseYM) {
            MobclickAgent.onPause(this);
            UMGameAgent.onPause(this);
        }
    }

    @Override
    protected void onDestroy() {
        if (!isTaskRoot()) {
            return;
        }
        SDKWrapper.getInstance().onDestroy();
        this.unRegisterReceivers();
        super.onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
        AndroidHelper.getHelper().permissionUtils.onActivityResult(requestCode, resultCode);
        // 扫描二维码/条码回传;
        if (requestCode == AndroidHelper.getHelper().REQUEST_CODE_SCAN && resultCode == RESULT_OK) {
            if (data != null) {
                String content = data.getStringExtra("codedContent");
                if (content == null || content.isEmpty()) {
                    AndroidHelper.getHelper().callToJS("Script.scaner(-1,'')");
                } else {
                    AndroidHelper.getHelper().callToJS("Script.scaner(1,'" + content + "')");
                }
            } else {
                AndroidHelper.getHelper().callToJS("Script.scaner(0,'')");
            }
        }
        if (data == null) {
            return;
        }
        String str = data.getExtras().getString("pay_result");
        if (str.equalsIgnoreCase("success")) {
            AndroidHelper.getHelper().callToJS("Script.ylCallback(0)");
        } else if (str.equalsIgnoreCase("fail")) {
            AndroidHelper.getHelper().callToJS("Script.ylCallback(2)");
        } else if (str.equalsIgnoreCase("cancel")) {
            AndroidHelper.getHelper().callToJS("Script.ylCallback(1)");
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    @Override
    public void agree(int requestCode, int responsCode) {
        switch (requestCode) {
            case PermissionUtils.STORAGE:
                AndroidHelper.getHelper().callToJS("Script.getDownloadPermission(1," + requestCode + ")");
                break;
            case PermissionUtils.INSTALL:
                AndroidHelper.getHelper().callToJS("Script.getInstallPermission(1," + requestCode + ")");
                break;
        }
    }

    @Override
    public void refuse(int requestCode, int responsCode) {
        switch (requestCode) {
            case PermissionUtils.STORAGE:
                AndroidHelper.getHelper().callToJS("Script.getDownloadPermission(0," + requestCode + ")");
                break;
            case PermissionUtils.INSTALL:
                AndroidHelper.getHelper().callToJS("Script.getInstallPermission(0," + requestCode + ")");
            default:
                break;
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public void myRequestPermissions(String[] permission, int requestCode) {
        requestPermissions(permission, requestCode);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        AndroidHelper.getHelper().permissionUtils.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    /**
     * 注册广播
     */
    private void registerReceivers() {
        this.batteryReceiver = new BatteryReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_BATTERY_CHANGED);
        filter.addAction(Intent.ACTION_POWER_CONNECTED);
        filter.addAction(Intent.ACTION_POWER_DISCONNECTED);
        this.registerReceiver(this.batteryReceiver, filter);

        this.installReceiver = new InstallReceiver();
        IntentFilter installFilter = new IntentFilter();
        installFilter.addAction(Intent.ACTION_PACKAGE_ADDED);
        installFilter.addAction(Intent.ACTION_PACKAGE_REMOVED);
        installFilter.addAction(Intent.ACTION_PACKAGE_REPLACED);
        installFilter.addDataScheme("package");
        this.registerReceiver(this.installReceiver, installFilter);

        this.networkReceiver = new NetworkReceiver();
        IntentFilter networkFilter = new IntentFilter();
        networkFilter.addAction("android.net.ethernet.ETHERNET_STATE_CHANGED");
        networkFilter.addAction("android.net.ethernet.STATE_CHANGE");
        networkFilter.addAction("android.net.conn.CONNECTIVITY_CHANGE");
        networkFilter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION);
        networkFilter.addAction(WifiManager.NETWORK_STATE_CHANGED_ACTION);
        this.registerReceiver(this.networkReceiver, networkFilter);
    }

    /**
     * 移除广播
     */
    private void unRegisterReceivers() {
        if (batteryReceiver != null) {
            this.unregisterReceiver(this.batteryReceiver);
        }

        if (installReceiver != null) {
            this.unregisterReceiver(this.installReceiver);
        }

        if (networkReceiver != null) {
            this.unregisterReceiver(this.networkReceiver);
        }
    }
}
