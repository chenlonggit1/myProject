var net = require("net")
var DataManager = require("DataManager");

var HttpUtil = {}

HttpUtil.httpGet = function (url, callback) {
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            var respone = xhr.responseText;
            if (callback != null) {
                callback(respone);
            }
        }
    };

    xhr.onerror = function () {
        if (net.PlayerId > 0) {
            net.ReportError("HttpGetError*nickname=" + DataManager.instance.nickName + "*playerid=" + net.PlayerId + "*url=" + url);
        } else {
            net.ReportError("HttpGetError*nickname=" + DataManager.instance.nickName + "*url=" + url);
        }
    }

    xhr.ontimeout = function () {
        if (net.PlayerId > 0) {
            net.ReportError("HttpGetTimeout*nickname=" + DataManager.instance.nickName + "*playerid=" + net.PlayerId + "*url=" + url);
        } else {
            net.ReportError("HttpGetTimeout*nickname=" + DataManager.instance.nickName + "*url=" + url);
        }
    }

    xhr.timeout = 10000;
    xhr.open("GET", url, true);
    xhr.send();
}

HttpUtil.httpPost = function (url, params, callback, timeOutCallBack = null) {
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            var respone = xhr.responseText;
            if (respone) {
                if (callback) {
                    callback(respone);
                }
            }
        }
    };

    xhr.onerror = function () {
        if (net.PlayerId > 0) {
            net.ReportError("HttpPostError*nickname=" + DataManager.instance.nickName + "*playerid=" + net.PlayerId + "*url=" + url);
        } else {
            net.ReportError("HttpPostError*nickname=" + DataManager.instance.nickName + "*url=" + url);
        }
    }

    xhr.ontimeout = function () {
        if (net.PlayerId > 0) {
            net.ReportError("HttpPostTimeout*nickname=" + DataManager.instance.nickName + "*playerid=" + net.PlayerId + "*url=" + url);
        } else {
            net.ReportError("HttpPostTimeout*nickname=" + DataManager.instance.nickName + "*url=" + url);
        }
        if (timeOutCallBack != null) {
            timeOutCallBack();
        }
    }

    xhr.timeout = 20000;
    xhr.open("POST", url, true);
    xhr.send(params);
}

HttpUtil.httpPostWithMessage = function (url, params, callBackMsgName, callback) {
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            var respone = xhr.responseText;
            if (respone) {
                var baseMsg = net.MakeMsg(null, net.MsgCmd["HttpResult"], respone);
                if (baseMsg.En == 0) {
                    var msg = net.MakeMsg(callBackMsgName, null, baseMsg.Data);
                    if (callback) {
                        callback(msg)
                    }
                }
            }
        }
    };

    xhr.onerror = function () {
        if (net.PlayerId > 0) {
            net.ReportError("HttpPostWithMessageError*nickname=" + DataManager.instance.nickName + "*playerid=" + net.PlayerId + "*url=" + url);
        } else {
            net.ReportError("HttpPostWithMessageError*nickname=" + DataManager.instance.nickName + "*url=" + url);
        }
    }

    xhr.ontimeout = function () {
        if (net.PlayerId > 0) {
            net.ReportError("HttpPostWithMessageTimeout*nickname=" + DataManager.instance.nickName + "*playerid=" + net.PlayerId + "*url=" + url + "");
        } else {
            net.ReportError("HttpPostWithMessageTimeout*nickname=" + DataManager.instance.nickName + "*url=" + url + "");
        }
    }

    xhr.timeout = 20000;
    xhr.open("POST", url, true);
    xhr.send(params);
}

module.exports = HttpUtil;