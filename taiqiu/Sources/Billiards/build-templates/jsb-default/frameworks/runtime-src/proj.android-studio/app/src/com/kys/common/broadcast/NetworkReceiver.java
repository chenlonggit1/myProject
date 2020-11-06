package com.kys.common.broadcast;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.telephony.TelephonyManager;

import com.kys.common.bridge.ScriptBridgeUtils;
import com.kys.common.consts.Constants;

import java.util.HashMap;
import java.util.Map;

public class NetworkReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(ConnectivityManager.CONNECTIVITY_ACTION)) {
            ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
            Map<Object, Object> result = new HashMap<>();
            if (networkInfo != null && networkInfo.isAvailable()) {
                int type = networkInfo.getType();
                String typeName = networkInfo.getTypeName();
                result.put("status", NetworkReceiver.getNetworkStatus(context)); // 0:无网络 1:wifi 2:2G 3:3G 4:4G 5:手机流量
                result.put("type", type);
                result.put("typeName", typeName);
            } else {// 无网络
                result.put("status", NetworkReceiver.getNetworkStatus(context)); // 0:无网络 1:wifi 2:2G 3:3G 4:4G 5:手机流量
                result.put("type", -1);
                result.put("typeName", "no network");
            }
            ScriptBridgeUtils.getInstance().dispatchEvent(ScriptBridgeUtils.Event.EVENT_NETWORK_CHANGED, result);
        }
    }


    @SuppressWarnings("deprecation")
    public static boolean isLocalWiFiAvailable(ConnectivityManager mConnManager) {
        if (mConnManager == null) {
            return false;
        }
        NetworkInfo.State state = mConnManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI).getState();
        return NetworkInfo.State.CONNECTED == state;
    }

    @SuppressWarnings("deprecation")
    public static boolean isInternetConnectionAvailable(ConnectivityManager mConnManager) {
        if (mConnManager == null) {
            return false;
        }

        if (isLocalWiFiAvailable(mConnManager)) {
            return true;
        }

        try {
            NetworkInfo.State state = mConnManager.getNetworkInfo(ConnectivityManager.TYPE_MOBILE).getState();
            return NetworkInfo.State.CONNECTED == state;
        } catch (Exception e) {
            return false;
        }
    }

    public static int getInternetConnectionStatus(ConnectivityManager mConnManager) {
        if (isLocalWiFiAvailable(mConnManager)) {
            return 1; // wifi
        }
        if (isInternetConnectionAvailable(mConnManager)) {
            return 2; // gprs
        }
        return 0;
    }

    /**
     * 获取当前网络连接的类型
     * <p>
     * 0:没有网络连接
     * 1:wifi连接
     * 2:2G
     * 3:3G
     * 4:4G
     * 5:手机流量
     *
     * @param context context
     * @return int
     */
    public static int getNetworkStatus(Context context) {
        ConnectivityManager connManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE); // 获取网络服务
        if (null == connManager) { // 为空则认为无网络
            return Constants.NETWORK_STATUS.NONE;
        }
        // 获取网络类型，如果为空，返回无网络
        NetworkInfo activeNetInfo = connManager.getActiveNetworkInfo();
        if (activeNetInfo == null || !activeNetInfo.isAvailable()) {
            return Constants.NETWORK_STATUS.NONE;
        }
        // 判断是否为WIFI
        NetworkInfo wifiInfo = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        if (null != wifiInfo) {
            NetworkInfo.State state = wifiInfo.getState();
            if (null != state) {
                if (state == NetworkInfo.State.CONNECTED || state == NetworkInfo.State.CONNECTING) {
                    return Constants.NETWORK_STATUS.WIFI;
                }
            }
        }
        // 若不是WIFI，则去判断是2G、3G、4G网
        TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        int networkType = telephonyManager.getNetworkType();
        switch (networkType) {
            /*
             GPRS : 2G(2.5) General Packet Radia Service 114kbps
             EDGE : 2G(2.75G) Enhanced Data Rate for GSM Evolution 384kbps
             UMTS : 3G WCDMA 联通3G Universal Mobile Telecommunication System 完整的3G移动通信技术标准
             CDMA : 2G 电信 Code Division Multiple Access 码分多址
             EVDO_0 : 3G (EVDO 全程 CDMA2000 1xEV-DO) Evolution - Data Only (Data Optimized) 153.6kps - 2.4mbps 属于3G
             EVDO_A : 3G 1.8mbps - 3.1mbps 属于3G过渡，3.5G
             1xRTT : 2G CDMA2000 1xRTT (RTT - 无线电传输技术) 144kbps 2G的过渡,
             HSDPA : 3.5G 高速下行分组接入 3.5G WCDMA High Speed Downlink Packet Access 14.4mbps
             HSUPA : 3.5G High Speed Uplink Packet Access 高速上行链路分组接入 1.4 - 5.8 mbps
             HSPA : 3G (分HSDPA,HSUPA) High Speed Packet Access
             IDEN : 2G Integrated Dispatch Enhanced Networks 集成数字增强型网络 （属于2G，来自维基百科）
             EVDO_B : 3G EV-DO Rev.B 14.7Mbps 下行 3.5G
             LTE : 4G Long Term Evolution FDD-LTE 和 TDD-LTE , 3G过渡，升级版 LTE Advanced 才是4G
             EHRPD : 3G CDMA2000向LTE 4G的中间产物 Evolved High Rate Packet Data HRPD的升级
             HSPAP : 3G HSPAP 比 HSDPA 快些
             */
            // 2G网络
            case TelephonyManager.NETWORK_TYPE_GPRS:
            case TelephonyManager.NETWORK_TYPE_CDMA:
            case TelephonyManager.NETWORK_TYPE_EDGE:
            case TelephonyManager.NETWORK_TYPE_1xRTT:
            case TelephonyManager.NETWORK_TYPE_IDEN:
                return Constants.NETWORK_STATUS._2G;
            // 3G网络
            case TelephonyManager.NETWORK_TYPE_EVDO_A:
            case TelephonyManager.NETWORK_TYPE_UMTS:
            case TelephonyManager.NETWORK_TYPE_EVDO_0:
            case TelephonyManager.NETWORK_TYPE_HSDPA:
            case TelephonyManager.NETWORK_TYPE_HSUPA:
            case TelephonyManager.NETWORK_TYPE_HSPA:
            case TelephonyManager.NETWORK_TYPE_EVDO_B:
            case TelephonyManager.NETWORK_TYPE_EHRPD:
            case TelephonyManager.NETWORK_TYPE_HSPAP:
                return Constants.NETWORK_STATUS._3G;
            // 4G网络
            case TelephonyManager.NETWORK_TYPE_LTE:
                return Constants.NETWORK_STATUS._4G;
            default:
                return Constants.NETWORK_STATUS.MOBILE;
        }
    }
}
