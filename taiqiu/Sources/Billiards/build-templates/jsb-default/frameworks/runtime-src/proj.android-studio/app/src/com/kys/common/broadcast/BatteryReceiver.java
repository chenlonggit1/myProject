package com.kys.common.broadcast;

import java.util.HashMap;
import java.util.Map;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.util.Log;

import com.kys.common.bridge.ScriptBridgeUtils;

/**
 * 电池状态广播类
 *
 * @author Berwin
 */
public class BatteryReceiver extends BroadcastReceiver {

    public static final String TAG = "BatteryReceiver";

    private int level = 0;
    // 是否在充电
    private static boolean charge = false;
    private ScriptBridgeUtils scriptBridgeUtils = null;

    @Override
    public void onReceive(Context arg0, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
            // 电池变化
            int level = intent.getIntExtra("level", 0); // 0 - 100
            // 向Lua广播 电池有变化的时候才推送
            if (this.level != level) {
                final Map<Object, Object> result = new HashMap();
                result.put("level", level); // 电池剩余电量
                result.put("scale", intent.getIntExtra("scale", 0)); // 获取电池满电量数值
                result.put("technology", intent.getStringExtra("technology")); // 获取电池技术支持
                result.put("status", intent.getIntExtra("status",
                        BatteryManager.BATTERY_STATUS_UNKNOWN)); // 获取电池状态
                result.put("plugged", intent.getIntExtra("plugged", 0)); // 获取电源信息
                result.put("health", intent.getIntExtra("health",
                        BatteryManager.BATTERY_HEALTH_UNKNOWN)); // 获取电池健康度
                result.put("voltage", intent.getIntExtra("voltage", 0)); // 获取电池电压
                result.put("temperature", intent.getIntExtra("temperature", 0)); // 获取电池温度
                boolean success = ScriptBridgeUtils.getInstance().dispatchEvent(ScriptBridgeUtils.Event.EVENT_BATTER_CHANGED, result);
                // 直到推送成功才记录，不然lua注册的时候已经不推送了
                if (success)
                    this.level = level;
            }
            // 充电方式改变
            // 连接/断开 充电器
            int status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
            boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL;
            if (BatteryReceiver.charge != isCharging) {
                // 充电方式 1:交流电 2:USB充电 4:无线充电
                int plug = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
                // boolean usbCharge = plug == BatteryManager.BATTERY_PLUGGED_USB;
                // boolean acCharge = plug == BatteryManager.BATTERY_PLUGGED_AC;
                final Map<Object, Object> result = new HashMap();
                result.put("status", isCharging);
                result.put("plug", plug); // 1:交流电 2:USB充电
                boolean success = ScriptBridgeUtils.getInstance().dispatchEvent(ScriptBridgeUtils.Event.EVENT_CHARGE_CHANGED, result);
//                if (success)
                BatteryReceiver.charge = isCharging;
            }
        }
    }

    /**
     * 得到电池电量
     *
     * @param mContext
     * @return
     */
    public static int getBattery(Context mContext) {
        int level = 0;
        Intent batteryInfoIntent = mContext.getApplicationContext().registerReceiver(null,
                new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        level = batteryInfoIntent.getIntExtra("level", 0);
        int batterySum = batteryInfoIntent.getIntExtra("scale", 100);
        int percentBattery = 100 * level / batterySum;
        return percentBattery;
    }

    /**
     * 是否正在充电
     *
     * @return
     */
    public static boolean isChargeing(Context context) {
//        Intent batteryBroadcast = context.registerReceiver(null,
//                new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
//        // 0 means we are discharging, anything else means charging
//        boolean isCharging = batteryBroadcast.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1) != 0;
        Log.i(TAG, "cocos CHARGE:" + BatteryReceiver.charge);
        return BatteryReceiver.charge;
    }
}
