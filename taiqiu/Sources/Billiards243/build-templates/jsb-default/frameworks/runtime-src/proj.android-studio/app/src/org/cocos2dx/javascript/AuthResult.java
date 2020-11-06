package org.cocos2dx.javascript;

import java.util.Map;

import android.text.TextUtils;

public class AuthResult {

    private String resultStatus;
    private String result;
    private String memo;
    private String resultCode;
    private String authCode;
    private String alipayOpenId;

    public AuthResult(Map<String, String> rawResult, boolean removeBrackets) {
        if (rawResult == null) {
            return;
        }

        for (String key : rawResult.keySet()) {
            if (TextUtils.equals(key, "resultStatus")) {
                resultStatus = rawResult.get(key);
            } else if (TextUtils.equals(key, "result")) {
                result = rawResult.get(key);
            } else if (TextUtils.equals(key, "memo")) {
                memo = rawResult.get(key);
            }
        }

        String[] resultValue = result.split("&");
        for (String value : resultValue) {
            if (value.startsWith("alipay_open_id")) {
                alipayOpenId = removeBrackets(getValue("alipay_open_id=", value), removeBrackets);
                continue;
            }
            if (value.startsWith("auth_code")) {
                authCode = removeBrackets(getValue("auth_code=", value), removeBrackets);
                continue;
            }
            if (value.startsWith("result_code")) {
                resultCode = removeBrackets(getValue("result_code=", value), removeBrackets);
                continue;
            }
        }

    }

    private String removeBrackets(String str, boolean remove) {
        if (remove) {
            if (!TextUtils.isEmpty(str)) {
                if (str.startsWith("\"")) {
                    str = str.replaceFirst("\"", "");
                }
                if (str.endsWith("\"")) {
                    str = str.substring(0, str.length() - 1);
                }
            }
        }
        return str;
    }

    @Override
    public String toString() {
        return "authCode={" + authCode + "}; resultStatus={" + resultStatus + "}; memo={" + memo + "}; result={" + result + "}";
    }

    private String getValue(String header, String data) {
        return data.substring(header.length(), data.length());
    }

    /**
     * 9000： 请求处理成功
     * 4000： 系统异常
     * 6001： 用户中途取消
     * 6002： 网络连接出错
     */
    public String getResultStatus() {
        return resultStatus;
    }

    /**
     * @return the memo
     */
    public String getMemo() {
        return memo;
    }

    /**
     * @return the result
     */
    public String getResult() {
        return result;
    }

    /**
     * 200： 业务处理成功，会返回authCode
     * 1005： 	账户已冻结，如有疑问，请联系支付宝技术支持
     * 202： 系统异常，请稍后再试或联系支付宝技术支持
     */
    public String getResultCode() {
        return resultCode;
    }

    /**
     * @return the authCode
     */
    public String getAuthCode() {
        return authCode;
    }

    /**
     * @return the alipayOpenId
     */
    public String getAlipayOpenId() {
        return alipayOpenId;
    }
}
