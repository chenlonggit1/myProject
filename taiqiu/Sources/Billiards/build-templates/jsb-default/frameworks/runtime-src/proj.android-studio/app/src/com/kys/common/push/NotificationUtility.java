package com.kys.common.push;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.support.v4.app.NotificationCompat;

import com.kys.wulin.qihoo.R;

import org.cocos2dx.javascript.AppActivity;

import java.util.Calendar;

public class NotificationUtility {

    /*
     * name:通知名字，作为通知id使用
     * content：通知内容
     * time：倒时时（秒）
     * */
    public static void showNotificationOnTime(Context context, String title, String content, long millis) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(millis);
//        cal.add(Calendar.SECOND, time);

        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.setClass(context, NotificationReceiver.class);
        intent.setData(Uri.parse("kys_local_push"));
        intent.putExtra("title", title);
        intent.putExtra("content", content);

        PendingIntent pi = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            am.setExact(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
        } else {
            am.set(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
        }
        am.set(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
    }

    public static void showNotification(Context context, String title, String content) {
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        Intent mIntent = new Intent(context, AppActivity.class);  //绑定intent，点击图标能够进入某activity
        PendingIntent mPendingIntent = PendingIntent.getActivity(context, 0, mIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        Notification.Builder builder = new Notification.Builder(context);
        //对builder进行配置
        builder.setContentTitle(title) //设置通知栏标题
                .setContentText(content) //设置通知栏显示内容
                .setTicker(content)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(mPendingIntent);
        if (Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel("kys_push_id", "kys_push_name", NotificationManager.IMPORTANCE_DEFAULT);
            channel.enableLights(true); //是否在桌面icon右上角展示小红点
            channel.setLightColor(Color.GREEN); //小红点颜色
            channel.setShowBadge(true); //是否在久按桌面图标时显示此渠道的通知
            manager.createNotificationChannel(channel);
            builder.setChannelId("kys_push_id");

        }
        manager.notify(0, builder.build());  //绑定Notification，发送通知请求
    }
}
