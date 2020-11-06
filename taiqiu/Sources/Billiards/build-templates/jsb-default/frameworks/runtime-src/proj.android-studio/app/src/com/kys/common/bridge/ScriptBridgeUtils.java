package com.kys.common.bridge;

import android.app.Activity;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class ScriptBridgeUtils {

    public interface Event {
        // apk 安装事件
        String EVENT_INSTALL_PACKAGE_ADD = "EVENT_INSTALL_PACKAGE_ADD";
        String EVENT_INSTALL_PACKAGE_REMOVED = "EVENT_INSTALL_PACKAGE_REMOVED";
        String EVENT_INSTALL_PACKAGE_REPLACED = "EVENT_INSTALL_PACKAGE_REPLACED";
        // 电池电量改变
        String EVENT_BATTER_CHANGED = "EVENT_BATTER_CHANGED";
        // 充电器是否连接
        String EVENT_CHARGE_CHANGED = "EVENT_CHARGE_CHANGED";
        // 网络发生了改变
        String EVENT_NETWORK_CHANGED = "EVENT_NETWORK_CHANGED";
    }

    private Activity activity = null;

    private static ScriptBridgeUtils _instance = null;

    public static synchronized ScriptBridgeUtils getInstance() {
        if (_instance == null) {
            _instance = new ScriptBridgeUtils();
        }
        return _instance;
    }

    private ScriptBridgeUtils() {
    }

    /**
     * 初始化
     *
     * @param activity
     */
    public void init(Activity activity) {
        this.activity = activity;
    }

    /**
     * 向脚本分发事件
     *
     * @param eventName
     * @param data
     * @return
     */
    public boolean dispatchEvent(String eventName, Map<Object, Object> data) {
        JSONObject object = new JSONObject();
        try {
            object.put("name", eventName);
            object.put("data", data);
            final String evalJavaScript = String.format("Script.dispatchNativeEvent('%s', '%s');", eventName, object.toString());
            Cocos2dxActivity activity = (Cocos2dxActivity) this.activity;
            activity.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(evalJavaScript);
                }
            });
            return true;
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return false;
    }
}
