package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.provider.Settings;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.support.v4.content.FileProvider;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.alipay.sdk.app.AuthTask;
import com.alipay.sdk.app.PayTask;
import com.kys.wulin.qihoo.R;
import com.kys.common.push.NotificationUtility;
import com.kys.common.utility.UserDefault;
import com.meituan.android.walle.ChannelInfo;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.umeng.analytics.game.UMGameAgent;
import com.unionpay.UPPayAssistEx;

import org.android.agoo.huawei.HuaWeiRegister;
import org.android.agoo.mezu.MeizuRegister;
import org.android.agoo.oppo.OppoRegister;
import org.android.agoo.vivo.VivoRegister;
import org.android.agoo.xiaomi.MiPushRegistar;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AndroidHelper {
    // 管理类单例对象
    private static AndroidHelper helper = null;
    // 二维码相关的配置
    public static final int REQUEST_CODE_SCAN = 0x0000;

    private ChannelInfo channelInfo = null;

    private AndroidHelper() {
    }

    public static AndroidHelper getHelper() {
        if (helper == null) {
            helper = new AndroidHelper();
        }
        return helper;
    }

    // 下载权限判断对象
    public PermissionUtils permissionUtils;

    // AppActivity实例对象
    private AppActivity activity = null;
    //表示当前activity是否处于激活状态
    private boolean isResume = false;
    private List<String> list_msg = new ArrayList<>();

    // activity激活状态改变时触发的方法
    public void activityLifecycle(boolean isResume) {
        helper.isResume = isResume;
        while (helper.isResume && !helper.list_msg.isEmpty()) {
            String msg = helper.list_msg.remove(0);
            helper.callToJS(msg);
        }
    }

    /**
     * 调用JS方法
     *
     * @param msg js执行方法的字符串
     */
    public void callToJS(final String msg) {
        if (helper.isResume) {
            helper.activity.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(msg);
                }
            });
        } else {
            helper.list_msg.add(msg);
        }
    }

    // 微信管理对象
    private static IWXAPI wxAPI = null;
    public static String wx_app_id = "";

    /**
     * 初始化activity和微信对象
     *
     * @param activity
     */
    public void init(AppActivity activity) {
        helper.activity = activity;
        helper.channelInfo = WalleChannelReader.getChannelInfo(helper.activity);
    }

    /** ------------微信接口开始------------ */

    /**
     * 初始化微信对象
     */
    public static int initWX(final String app_id) {
        helper.wx_app_id = app_id;
        helper.wxAPI = WXAPIFactory.createWXAPI(helper.activity, app_id, false);
        helper.wxAPI.registerApp(app_id);
        Log.v("initWX:", app_id);
        if (!helper.wxAPI.isWXAppInstalled()) {
            return 0;
        }
        return 1;
    }

    /**
     * 微信登录
     */
    public static void wxLogin() {
        if (!helper.wxAPI.isWXAppInstalled()) {
            helper.activity.runOnUiThread(new Runnable() {
                public void run() {
                    Toast.makeText(helper.activity, "没有安装微信，请先安装微信!", Toast.LENGTH_LONG).show();
                }
            });
            return;
        }
        final SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo"; // 这里不能改
        req.state = "hbddz"; // 这里改成你自己的数据
        helper.wxAPI.sendReq(req);
    }

    /**
     * 微信分享
     *
     * @param url   网页地址
     * @param title 标题
     * @param des   说明
     */
    public static void wxShare(final String url, final String title, final String des, int type) {
        // 封装一个链接，点击跳转到指定网址
        WXWebpageObject webpag = new WXWebpageObject();
        webpag.webpageUrl = url;
        // 封装游戏图标
        Bitmap bitmap =
                BitmapFactory.decodeResource(helper.activity.getResources(), R.mipmap.ic_launcher);
        // 封装分享内容
        WXMediaMessage msg = new WXMediaMessage(webpag);
        msg.thumbData = helper.bmpToByteArrary(bitmap, true, true);
        msg.title = title; //这个是标题
        msg.description = des; //这个是描述
        // 封装请求
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = helper.buildTransaction("webpag");
        req.message = msg;
        if (type == 1) { //分享到朋友圈
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        } else {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        // 发送请求
        helper.wxAPI.sendReq(req);
    }

    /**
     * 分享战绩
     *
     * @param filePath 图片绝对路径
     */
    public static void wxShareRecord(final String filePath, int type) {
        Bitmap bitmap = BitmapFactory.decodeFile(filePath);
        WXImageObject imgObj = new WXImageObject(bitmap);

        final WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = imgObj;

        msg.thumbData = helper.bmpToByteArrary(bitmap, true, true);
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = helper.buildTransaction("img");
        req.message = msg;
        if (type == 1) {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        } else {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        helper.wxAPI.sendReq(req);
    }

    /**
     * 微信原生支付
     *
     * @param appId        标识符
     * @param partnerId    商户号
     * @param prepayId     预支付交易会话ID
     * @param nonceStr     随机字符串
     * @param packageValue 扩展字段
     * @param timeStamp    时间戳
     * @param sign         签名
     */
    public static void wxPay(final String appId,
                             final String partnerId,
                             final String prepayId,
                             final String nonceStr,
                             final String packageValue,
                             final String timeStamp,
                             final String sign) {
        PayReq req = new PayReq();
        req.appId = appId;
        req.partnerId = partnerId;
        req.prepayId = prepayId;
        req.nonceStr = nonceStr;
        req.timeStamp = timeStamp;
        req.packageValue = packageValue;
        req.sign = sign;

        helper.wxAPI.sendReq(req);
    }

    /**
     * 微信小程序支付
     *
     * @param miniId 填小程序原始id
     * @param path   需要跳转的页面和参数
     * @param mode   1体验版，2正式版
     */
    public static void miniPay(final String miniId, final String path, int mode) {
        WXLaunchMiniProgram.Req req = new WXLaunchMiniProgram.Req();
        req.userName = miniId;
        req.path = path;
        if (mode == 1) {
            req.miniprogramType = WXLaunchMiniProgram.Req.MINIPROGRAM_TYPE_PREVIEW;
        } else {
            req.miniprogramType = WXLaunchMiniProgram.Req.MINIPTOGRAM_TYPE_RELEASE;
        }
        helper.wxAPI.sendReq(req);
    }

    /**
     * 将图片解析成一个二进制数组
     *
     * @param bitmap    图片对象
     * @param isRecycle 是否需要重绘
     * @return 字节数组
     */
    private byte[] bmpToByteArrary(
            final Bitmap bitmap, final boolean isCompress, final boolean isRecycle) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
        if (isCompress) {
            int options = 100;
            while (outputStream.toByteArray().length > 32768) {
                outputStream.reset();
                bitmap.compress(Bitmap.CompressFormat.JPEG, options, outputStream);
                if (options > 10) {
                    options -= 10;
                } else {
                    if (options > 5) {
                        options -= 5;
                    } else {
                        if (options > 1) {
                            options -= 1;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        if (isRecycle) {
            bitmap.recycle();
        }
        byte[] result = outputStream.toByteArray();
        try {
            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 生成一个微信唯一请求标识符
     *
     * @param type 标识符
     * @return 唯一标识符
     */
    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis())
                : type + System.currentTimeMillis();
    }

    /** ------------微信接口结束------------ */

    /** ------------系统接口开始------------ */

    /**
     * 获取设备唯一识别码
     */
    public static String getUUID() {
        String androidID = Settings.Secure.getString(helper.activity.getContentResolver(), Settings.Secure.ANDROID_ID);
        String id = androidID + Build.SERIAL;
        try {
            return MD5.GetMD5Code(id);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 调用系统振动
     *
     * @param milliseconds 时间（毫秒）
     */
    public static void phoneVibration(int milliseconds) {
        Vibrator vibrator = (Vibrator) helper.activity.getSystemService(Context.VIBRATOR_SERVICE);
        vibrator.vibrate(milliseconds);
    }

    /**
     * 跳转进入对应的网页
     *
     * @param url 网页地址
     */
    public static void openBrowser(final String url) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(url));
        helper.activity.startActivity(intent);
    }

    /**
     * 调用拨号界面
     *
     * @param phone 电话号码
     */
    public static void callPhone(final String phone) {
        Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + phone));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        helper.activity.startActivity(intent);
    }

    /**
     * 获取对应的app版本号
     *
     * @return app版本号
     */
    public static String getAppVersion() {
        // 获取包管理器
        PackageManager pm = helper.activity.getPackageManager();
        // 获取包信息
        try {
            PackageInfo packageInfo = pm.getPackageInfo(helper.activity.getPackageName(), 0);
            // 返回版本号
            return packageInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * 把文本保存到系统剪切板
     *
     * @param text 需要保存的文本
     */
    public static void copyToClipboard(final String text) {
        try {
            helper.activity.runOnUiThread(new Runnable() {
                public void run() {
                    ClipboardManager clipboard =
                            (ClipboardManager) helper.activity.getSystemService(Context.CLIPBOARD_SERVICE);
                    ClipData clip = ClipData.newPlainText("Text", text);
                    clipboard.setPrimaryClip(clip);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("copyToClipboard-->", e.getMessage());
        }
    }

    /**
     * 从剪切板复制文本
     **/
    public static void getTextFromClip() {
        try {
            helper.activity.runOnUiThread(new Runnable() {
                public void run() {
                    ClipboardManager clipboardManager = (ClipboardManager) helper.activity.getSystemService(Context.CLIPBOARD_SERVICE);
                    // 判断剪切版时候有内容
                    if (!clipboardManager.hasPrimaryClip()) {
                        helper.callToJS("Script.getTextFromClip(0,'')");
                        return;
                    }
                    ClipData clipData = clipboardManager.getPrimaryClip();
                    // 获取 text
                    String text = clipData.getItemAt(0).coerceToText(helper.activity).toString();
                    helper.callToJS("Script.getTextFromClip(1,'" + text + "')");
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("getTextFromClip->", e.getMessage());
        }
    }

    /**
     * 调用二维码扫描
     */
    public static void scaner() {
        Intent intent = new Intent(helper.activity,
                com.kys.wulin.qihoo.zxing.android.CaptureActivity.class);
        helper.activity.startActivityForResult(intent, REQUEST_CODE_SCAN);
    }

    /**
     * 清除下载过的apk文件---删除sd/xjkys/文件夹下的所有文件
     */
    public static boolean delDir() {
        final String path = Environment.getExternalStorageDirectory() + File.separator + "xjkys" + File.separator;
        File file = new File(path);
        if (file.exists()) {
            if (file.isFile())
                return FileUtils.deleteFile(path);
            else
                return FileUtils.deleteDirectory(path);
        }
        Log.v("Clear Directory:", "没有可清理的文件");
        return false;
    }

    /**
     * 保存指定路径的图片到系统图库中
     */
    public static boolean saveToPhoto(final String imagePath, final String fileName, final String des) {
        try {
            MediaStore.Images.Media.insertImage(helper.activity.getContentResolver(), imagePath, fileName, des);
            helper.refreshPhoto(imagePath);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 刷新相册
     */
    private void refreshPhoto(final String path) {
        helper.activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent scanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                scanIntent.setData(Uri.parse("file://" + path));
                helper.activity.sendBroadcast(scanIntent);
            }
        });
    }

    /** ------------微信接口结束------------ */

    /** ------------apk下载和安装开始------------ */

    /**
     * 验证安装权限
     **/
    public static void getInstallPermission() {
        helper.permissionUtils.getPer(PermissionUtils.INSTALL, 1, null);
    }

    /**
     * 根据路劲安装APK
     */
    public static void installApp(final String path) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        Uri data;
        File apkFile = new File(path);
        if (!apkFile.exists()) {
            // 文件不存在返回错误
            helper.callToJS("Script.installError()");
            return;
        }
        // 判断版本大于等于7.0
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            data = FileProvider.getUriForFile(helper.activity, helper.getPcgName() + ".FileProvider", apkFile);
            // 给目标应用一个临时授权
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
            data = Uri.fromFile(apkFile);
        }
        intent.setDataAndType(data, "application/vnd.android.package-archive");
        helper.activity.startActivity(intent);
        helper.activity.runOnUiThread(new Runnable() {
            public void run() {
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        helper.activity.finish();
                        System.exit(0);
                    }
                }, 3000);
            }
        });
    }

    /**
     * 跳转到设置界面
     */
    public static void gotoSetting(int requestCode) {
        Uri packageURI = Uri.parse("package:" + helper.activity.getPackageName());
        Intent intent = null;
        try {
            switch (requestCode) {
                case PermissionUtils.STORAGE:
                    intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, packageURI);
                    helper.activity.startActivity(intent);
                    break;
                case PermissionUtils.INSTALL:
                    intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, packageURI);
                    helper.activity.startActivityForResult(intent, requestCode);
                    break;
            }
        } catch (Exception e) {
            intent = new Intent(Settings.ACTION_APPLICATION_SETTINGS);
            helper.activity.startActivityForResult(intent, requestCode);
        }
    }

    private String getPcgName() {
        try {
            PackageManager packageManager = helper.activity.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(helper.activity.getPackageName(), 0);
            return packageInfo.packageName;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /** ------------apk下载和安装结束------------ */

    /** ------------Walle接口开始------------ */

    /**
     * 得到渠道号
     *
     * @return
     */
    public static String getAPKChannel() {
        if (helper.channelInfo == null)
            return "";
        return helper.channelInfo.getChannel();
    }

    /**
     * 通过key获取对应的值
     *
     * @param key 额外值得key
     * @return
     */
    public static String getExtraInfo(final String key) {
        if (helper.channelInfo == null)
            return "";
        Map<String, String> extraInfo = helper.channelInfo.getExtraInfo();
        if (extraInfo == null || !extraInfo.containsKey(key))
            return "";
        return extraInfo.get(key);
    }

    /** ------------Walle接口结束------------ */

    /** ------------打开其它的APP开始------------ */

    /**
     * 打开某个应用程序
     *
     * @param pkgName 包名
     * @param clsName activity名
     * @return
     */
    public static int openApp(final String pkgName, final String clsName, final String data) {
        if (!helper.isAppInstalled(pkgName)) {
            return 0;
        }
        try {
            ComponentName componentName = new ComponentName(pkgName, clsName);
            Intent intent = new Intent();
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("data", data);
            intent.setComponent(componentName);
            helper.activity.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("openApp-->", e.getMessage());
            return -1;
        }
        return 1;
    }

    /**
     * 打开某个应用程序
     *
     * @param pkgName 包名
     * @param data    json字符串
     * @return
     */
    public static int openApp(final String pkgName, final String data) {
        if (!helper.isAppInstalled(pkgName)) {
            return 0;
        }
        try {
            Intent intent = helper.activity.getPackageManager().getLaunchIntentForPackage(pkgName);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("data", data);
            helper.activity.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("openApp-->", e.getMessage());
            return -1;
        }

        return 1;
    }

    /**
     * 打开某个应用程序
     *
     * @param url scheme://host:port/path?data=jsonstring格式的字符串
     * @return
     */
    public static int openApp(final String url) {
        if (!helper.hasApplication(url)) {
            return 0;
        }
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setData(Uri.parse(url));
            helper.activity.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("openApp-->", e.getMessage());
            return -1;
        }
        return 1;
    }

    /**
     * 应用是否安装
     *
     * @param pkgName
     * @return
     */
    private boolean isAppInstalled(final String pkgName) {
        if (pkgName == null || pkgName == "") {
            return false;
        }
        final PackageManager packageManager = helper.activity.getPackageManager();
        List<PackageInfo> info = packageManager.getInstalledPackages(0);
        if (info == null || info.isEmpty())
            return false;
        for (int i = 0; i < info.size(); i++) {
            if (pkgName.equals(info.get(i).packageName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断是否安装了应用
     *
     * @param url 被唤起的app的URI信息
     * @return true 为已经安装
     */
    private boolean hasApplication(final String url) {
        PackageManager packageManager = helper.activity.getPackageManager();
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        List<ResolveInfo> activities = packageManager.queryIntentActivities(intent, 0);
        return !activities.isEmpty();
    }

    /** ------------打开其它的APP结束------------ */

    /** ------------友盟统计接口开始------------ */

    /**
     * 奖杯兑换道具统计
     *
     * @param item   道具名
     * @param number 道具数量
     * @param price  兑换消耗的奖杯数量
     */
    public static void buyProps(final String item, int number, float price) {
        UMGameAgent.buy(item, number, price);
    }

    /**
     * 充值购买统计
     *
     * @param currencyAmount 充值金额
     * @param currencyType   充值币种
     * @param virtualAmount  充值货币数量
     * @param channel        1~99的支付平台
     * @param orderId        充值订ID
     */
    public static void exchange(float currencyAmount, final String currencyType, float virtualAmount, int channel, final String orderId) {
        UMGameAgent.exchange(currencyAmount, currencyType, virtualAmount, channel, orderId);
    }

    /**
     * 奖励获取统计
     *
     * @param item    获取奖励的东西
     * @param num     获取奖励的数量
     * @param price   奖品的单价
     * @param trigger 1~10之间的数，标识获取的类型，1是系统奖励
     */
    public static void bonus(final String item, int num, float price, int trigger) {
        UMGameAgent.bonus(item, num, price, trigger);
    }

    /**
     * 用户登录统计
     *
     * @param provider 登录渠道
     * @param id       登录id
     */
    public static void sigin(final String provider, final String id) {
        UMGameAgent.onProfileSignIn(provider, id);
    }

    /**
     * 退出登录统计
     */
    public static void signOff() {
        UMGameAgent.onProfileSignOff();
    }

    /** ------------友盟统计接口结束------------ */

    /** ------------友盟推送接口开始------------ */
    /**
     * 初始化不同设备厂商推送ID
     *
     * @param deviceInfo {"xiaomi":{"id":"9sde910z972jv84287510", "key":"JEN920X-ADL2-Z92-BANA-1FD"},
     *                   "meizu":{"id":"9sde910z972jv84287510", "key":"JEN920X-ADL2-Z92-BANA-1FD"},
     *                   "oppo":{"id":"9sde910z972jv84287510", "key":"JEN920X-ADL2-Z92-BANA-1FD"},
     *                   }
     */
    public static void registeUPushDiffDevicesInfo(final String deviceInfo) throws JSONException {
        JSONObject objDeviceInfo = new JSONObject(deviceInfo);

        //小米通道
        JSONObject xiaomi = objDeviceInfo.getJSONObject("xiaomi");
        if (xiaomi != null)
            MiPushRegistar.register(helper.activity, xiaomi.getString("id"), xiaomi.getString("key"));
        //华为通道，注意华为通道的初始化参数在manifest中配置
        HuaWeiRegister.register(helper.activity.getApplication());
        //魅族通道
        JSONObject meizu = objDeviceInfo.getJSONObject("meizu");
        if (meizu != null)
            MeizuRegister.register(helper.activity, meizu.getString("id"), meizu.getString("key"));
        //OPPO通道
        JSONObject oppo = objDeviceInfo.getJSONObject("oppo");
        if (oppo != null)
            OppoRegister.register(helper.activity, oppo.getString("id"), oppo.getString("key"));
        //VIVO 通道，注意VIVO通道的初始化参数在minifest中配置
        VivoRegister.register(helper.activity);
    }

    /**
     * 得到友盟推送的deviceToken，方便后期做高级功能
     * 注意:可能返回空字符串
     *
     * @return
     */
    public static String getUPushDeviceToken() {
        return UserDefault.getInstance().getStringForKey(MyApplication.KEY_UPUSH_DEVICE_TOKEN, "");
    }


    /**
     * 本地消息推送
     *
     * @param title   通知标题
     * @param content 通知内容
     * @param millis  通知时间(单位:毫秒)
     */
    public static void notify(final String title, final String content, final int millis) {
        helper.activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                NotificationUtility.showNotificationOnTime(helper.activity, title, content, millis);
            }
        });
    }
    /** ------------友盟推送接口结束------------ */

    /**
     * ------------支付宝相关接口开始------------
     */

    private static final int SDK_PAY_FLAG = 1;
    private static final int SDK_AUTH_FLAG = 2;

    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler() {
        @SuppressWarnings("unused")
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case SDK_PAY_FLAG: {
                    @SuppressWarnings("unchecked")
                    PayResult payResult = new PayResult((Map<String, String>) msg.obj);
                    /**
                     * 对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
                     */
                    String resultInfo = payResult.getResult();// 同步返回需要验证的信息
                    String resultStatus = payResult.getResultStatus();
                    // 判断resultStatus 为9000则代表支付成功
                    if (TextUtils.equals(resultStatus, "9000")) {
                        // 该笔订单是否真实支付成功，需要依赖服务端的异步通知。
                        helper.callToJS("Script.aliPayResult('" + resultStatus + "', '" + resultInfo + "')");
                    } else {
                        // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
                        helper.callToJS("Script.aliPayResult('" + resultStatus + "')");
                    }
                    break;
                }
                case SDK_AUTH_FLAG: {
                    @SuppressWarnings("unchecked")
                    AuthResult authResult = new AuthResult((Map<String, String>) msg.obj, true);
                    String resultStatus = authResult.getResultStatus();
                    String resultCode = authResult.getResultCode();
                    // 判断resultStatus 为“9000”且result_code
                    // 为“200”则代表授权成功，具体状态码代表含义可参考授权接口文档
                    if (TextUtils.equals(resultStatus, "9000") && TextUtils.equals(resultCode, "200")) {
                        // 授权成功，回传open_id和auth_code
                        String open_id = authResult.getAlipayOpenId();
                        String auth_code = authResult.getAuthCode();
                        helper.callToJS("Script.aliAuthResult('9000', '200', '" + open_id + "', '" + auth_code + "')");
                    } else {
                        // 其他状态值则为授权失败，回传resultStatus和resultCode
                        helper.callToJS("Script.aliAuthResult('" + resultStatus + "', '" + resultCode + "')");
                    }
                    break;
                }
                default:
                    break;
            }
        }
    };

    /**
     * 支付宝支付
     */
    public static void aliPay(final String orderInfo) {
        final Runnable payRunnable = new Runnable() {
            @Override
            public void run() {
                PayTask pay_task = new PayTask(helper.activity);
                Map<String, String> result = pay_task.payV2(orderInfo, true);
                Message msg = new Message();
                msg.what = SDK_PAY_FLAG;
                msg.obj = result;
                helper.mHandler.sendMessage(msg);
            }
        };
        // 必须异步调用
        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }

    /**
     * 支付宝授权
     */
    public static void aliAuth(final String authInfo) {
        Runnable authRunnable = new Runnable() {
            @Override
            public void run() {
                // 构造AuthTask 对象
                AuthTask auth_task = new AuthTask(helper.activity);
                // 调用授权接口，获取授权结果
                Map<String, String> result = auth_task.authV2(authInfo, true);
                Message msg = new Message();
                msg.what = SDK_AUTH_FLAG;
                msg.obj = result;
                helper.mHandler.sendMessage(msg);
            }
        };
        // 必须异步调用
        Thread authThread = new Thread(authRunnable);
        authThread.start();
    }

    /**
     * 获取支付宝 SDK 版本号。
     */
    public static void aliSdkVersion() {
        PayTask pay_task = new PayTask(helper.activity);
        String version = pay_task.getVersion();
        helper.callToJS("Script.aliSdkVersion('" + version + "')");
    }

    /** ------------支付宝相关接口结束------------ */

    /**
     * ------------银联相关的接口开始------------
     */

    /**
     * 银联支付，tn：银联返回的订单号，mode："00"正式环境，"01"测试环境
     */
    public static void ylPay(final String tn, final String mode) {
        helper.activity.runOnUiThread(new Runnable() {
            public void run() {
                UPPayAssistEx.startPay(helper.activity, null, null, tn, mode);
            }
        });
    }

    /** ------------银联相关的接口结束------------ */

}