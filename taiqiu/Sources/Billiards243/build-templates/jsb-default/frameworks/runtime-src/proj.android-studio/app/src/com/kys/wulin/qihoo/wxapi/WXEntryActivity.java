package com.kys.wulin.qihoo.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.javascript.AndroidHelper;
import org.cocos2dx.javascript.AppActivity;


public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
    // 微信管理对象
    private IWXAPI wxAPI = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        wxAPI = WXAPIFactory.createWXAPI(this, AndroidHelper.wx_app_id, false);
        try {
            if (!wxAPI.handleIntent(this.getIntent(), this)) {
                finish();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        // 必须调用此句话
        wxAPI.handleIntent(intent, this);
    }

    //微信发送的请求将回调到onReq方法
    @Override
    public void onReq(BaseReq req) {
        finish();
    }

    //发送到微信请求的响应结果
    @Override
    public void onResp(BaseResp resp) {
        if (resp.errCode == BaseResp.ErrCode.ERR_OK) {
            if (resp.getType() == ConstantsAPI.COMMAND_SENDAUTH) { // 登录成功
                SendAuth.Resp sendResp = (SendAuth.Resp) resp;
                final String code = sendResp.code;
                AndroidHelper.getHelper().callToJS("Script.loginCallback('" + code + "')");
            }
            if (resp.getType() == ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX) { // 分享成功
                AndroidHelper.getHelper().callToJS("Script.shareCallback(1)");
            }
            if (resp.getType() == ConstantsAPI.COMMAND_LAUNCH_WX_MINIPROGRAM) {
                WXLaunchMiniProgram.Resp launchMiniProResp = (WXLaunchMiniProgram.Resp) resp;
                String extraData = launchMiniProResp.extMsg; // 对应小程序组件 <button open-type="launchApp"> 中的 app-parameter 属性
                if (extraData == "1") {
                    AndroidHelper.getHelper().callToJS("Script.miniPayCallback(1)");
                } else {
                    AndroidHelper.getHelper().callToJS("Script.miniPayCallback(0)");
                }
                Intent intent = new Intent();
                intent.setClass(this, AppActivity.class);
                startActivity(intent);
            }
        } else {
            if (resp.getType() == ConstantsAPI.COMMAND_SENDAUTH) {
                AndroidHelper.getHelper().callToJS("Script.loginCallback()");
            }
            if (resp.getType() == ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX) {
                AndroidHelper.getHelper().callToJS("Script.shareCallback(0)");
            }
        }
        finish();
    }
}