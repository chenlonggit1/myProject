package com.kys.common.push;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;


public class NotificationReceiver extends BroadcastReceiver {

    public static final String TAG = "NotificationReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String title = intent.getStringExtra("title");
        String content = intent.getStringExtra("content");
        Log.i(TAG, "收到闹钟:" + title + "   " + content);
        //推送一条通知
        NotificationUtility.showNotification(context, title, content);
        return;
    }

}
