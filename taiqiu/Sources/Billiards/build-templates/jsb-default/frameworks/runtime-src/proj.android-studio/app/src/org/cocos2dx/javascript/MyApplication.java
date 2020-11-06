package org.cocos2dx.javascript;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.kys.common.utility.UserDefault;
import com.meituan.android.walle.ChannelInfo;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.message.IUmengRegisterCallback;
import com.umeng.message.PushAgent;

import org.android.agoo.huawei.HuaWeiRegister;
import org.android.agoo.mezu.MeizuRegister;
import org.android.agoo.oppo.OppoRegister;
import org.android.agoo.vivo.VivoRegister;
import org.android.agoo.xiaomi.MiPushRegistar;

import java.util.Map;

public class MyApplication extends Application {

    public static final String TAG = "[MyApplication]";
    public static final String META_UMENG_PUSH_APPKEY = "UMENG_PUSH_APPKEY";
    public static final String META_UMENG_PUSH_SECRET = "UMENG_PUSH_SECRET";

    public static final String META_UPUSH_XIAOMI_ID = "com.xiaomi.push.app_id";
    public static final String META_UPUSH_XIAOMI_KEY = "com.xiaomi.push.api_key";
    public static final String META_UPUSH_MEIZU_ID = "com.meizu.push.app_id";
    public static final String META_UPUSH_MEIZU_KEY = "com.meizu.push.api_key";
    public static final String META_UPUSH_OPPO_ID = "com.oppo.push.app_id";
    public static final String META_UPUSH_OPPO_KEY = "com.oppo.push.api_key";

    public static final String KEY_UPUSH_DEVICE_TOKEN = "KEY_UPUSH_DEVICE_TOKEN";

    private ApplicationInfo appInfo = null;

    @Override
    public void onCreate() {
        super.onCreate();
        UserDefault.getInstance().init(this);
        this._initUMENGPush();
    }

//    @Override
//    protected void attachBaseContext(Context base) {
//        super.attachBaseContext(base);
//        MultiDex.install(this);
//    }


    private void _initUMENGPush() {
        ChannelInfo channelInfo = WalleChannelReader.getChannelInfo(this);
        String channel = channelInfo == null ? "kys-def" : channelInfo.getChannel();
        // 在此处调用基础组件包提供的初始化函数 相应信息可在应用管理 -> 应用信息 中找到 http://message.umeng.com/list/apps
        // 参数一：当前上下文context；
        // 参数二：应用申请的Appkey（需替换）；
        // 参数三：渠道名称；
        // 参数四：设备类型，必须参数，传参数为UMConfigure.DEVICE_TYPE_PHONE则表示手机；传参数为UMConfigure.DEVICE_TYPE_BOX则表示盒子；默认为手机；
        // 参数五：Push推送业务的secret 填充Umeng Message Secret对应信息（需替换）
        String appkey = this.fetchMETAFromManifest(META_UMENG_PUSH_APPKEY);
        String secret = this.fetchMETAFromManifest(META_UMENG_PUSH_SECRET);
        UMConfigure.init(this, appkey, channel, UMConfigure.DEVICE_TYPE_PHONE, secret);

        //获取消息推送代理示例
        PushAgent mPushAgent = PushAgent.getInstance(this);
//        mPushAgent.setNotificationPlaySound(MsgConstant.NOTIFICATION_PLAY_SERVER); //服务端控制声音


        //注册推送服务，每次调用register方法都会回调该接口
        mPushAgent.register(new IUmengRegisterCallback() {

            @Override
            public void onSuccess(String deviceToken) {
                //注册成功会返回deviceToken deviceToken是推送消息的唯一标志
                UserDefault.getInstance().setStringForKey(KEY_UPUSH_DEVICE_TOKEN, deviceToken);
                Log.i(TAG, "推送注册成功：deviceToken：-------->  " + deviceToken);
            }

            @Override
            public void onFailure(String s, String s1) {
                Log.e(TAG, "推送注册失败：-------->  " + "s:" + s + ",s1:" + s1);
            }
        });
        PushAgent.getInstance(this).onAppStart();
        String xiaomiAppId = this.fetchMETAFromManifest(META_UPUSH_XIAOMI_ID);
        String xiaomiKey = this.fetchMETAFromManifest(META_UPUSH_XIAOMI_KEY);
        MiPushRegistar.register(this, xiaomiAppId, xiaomiKey);
        //华为通道，注意华为通道的初始化参数在manifest中配置
        HuaWeiRegister.register(this);
        //魅族通道
        MeizuRegister.register(this, fetchMETAFromManifest(META_UPUSH_MEIZU_ID), fetchMETAFromManifest(META_UPUSH_MEIZU_KEY));
        //OPPO通道
        OppoRegister.register(this, fetchMETAFromManifest(META_UPUSH_OPPO_ID), fetchMETAFromManifest(META_UPUSH_OPPO_KEY));
        //VIVO 通道，注意VIVO通道的初始化参数在minifest中配置
        VivoRegister.register(this);
    }

    /**
     * 抓取META数据
     *
     * @param key
     * @return
     */
    private String fetchMETAFromManifest(String key) {
        //在application应用<meta-data>元素。
        try {
            if (this.appInfo == null)
                this.appInfo = this.getPackageManager()
                        .getApplicationInfo(getPackageName(), PackageManager.GET_META_DATA);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return appInfo.metaData.getString(key);
    }


}
