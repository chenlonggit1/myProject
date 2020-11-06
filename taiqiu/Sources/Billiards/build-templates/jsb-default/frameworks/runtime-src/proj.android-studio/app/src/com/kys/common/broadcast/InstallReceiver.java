package com.kys.common.broadcast;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.kys.common.bridge.ScriptBridgeUtils;
import com.kys.common.utility.ObjectUtils;

public class InstallReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_PACKAGE_ADDED)) {
            // 安装广播
            String pkgName = intent.getDataString();
            ScriptBridgeUtils.getInstance().dispatchEvent(ScriptBridgeUtils.Event.EVENT_INSTALL_PACKAGE_ADD, ObjectUtils.map("pkgName", pkgName));
        } else if (intent.getAction().equals(Intent.ACTION_PACKAGE_REMOVED)) {
            // 卸载广播 覆盖安装也会先过来
            String pkgName = intent.getDataString();
            ScriptBridgeUtils.getInstance().dispatchEvent(ScriptBridgeUtils.Event.EVENT_INSTALL_PACKAGE_REMOVED, ObjectUtils.map("pkgName", pkgName));
        } else if (intent.getAction().equals(Intent.ACTION_MY_PACKAGE_REPLACED)) {
            // 覆盖安装广播
            String pkgName = intent.getDataString();
            ScriptBridgeUtils.getInstance().dispatchEvent(ScriptBridgeUtils.Event.EVENT_INSTALL_PACKAGE_REPLACED, ObjectUtils.map("pkgName", pkgName));
        }
    }
}
