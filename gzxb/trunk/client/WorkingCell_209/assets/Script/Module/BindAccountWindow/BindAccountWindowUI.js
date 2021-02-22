var md5 = require('MD5')
var net = require("net")
var base64 = require('base64')
var HttpUtil = require("HttpUtil")
var GameConfig = require("GameConfig");
var DataManager = require("DataManager");
var EventManager = require("EventManager");
var WindowManager = require("WindowManager");

cc.Class({
    extends: cc.Component,

    properties: {
        accountInput: {
            default: null,
            type: cc.EditBox,
        },
        passwordInput: {
            default: null,
            type: cc.EditBox,
        },
    },

    //初始化数据
    initData: function (name) {
        this.name = name;
        this.initEvent();
    },

    initEvent: function () {
        EventManager.Add("LogoutSuccess", function (event, data) {
            console.log("BindAccountWindow LogoutSuccess")
            event.startBindAccount();
        }, this);
    },

    removeEvent: function () {
        EventManager.Remove("LogoutSuccess", this);
    },

    //确定按钮事件
    onConfirmBtnClick: function () {
        this.account = this.accountInput.string;
        this.password = this.passwordInput.string;
        if (this.account == '' || this.account == '用户名' || this.account.length == 0) {
            WindowManager.instance.showTips({
                "desc": "请填写正确的用户名"
            });

            return;
        }

        if (this.password == '' || this.password == '密码' || this.password.length == 0) {
            WindowManager.instance.showTips({
                "desc": "请填写正确的密码"
            });

            return;
        }

        //首先请求退出房间
        net.LogoutGameReq();
    },

    //开始绑定账号
    startBindAccount: function () {
        let handle = "bind";
        let uid = net.PlayerId;
        let cert = DataManager.instance.cert;
        let partnerid = "1";
        let newloginname = this.account;
        let newpwd = base64.base64encode(md5.hex_md5(this.password.toLowerCase()));
        let newauthcode = "";
        let unionid = DataManager.instance.unionid;
        let nickname = DataManager.instance.nickName;
        let icon = DataManager.instance.headUrl;
        let datatype = "json";
        let securityKey = "E8FE168AD73Fqp*s$yGAME";
        let sign = md5.hex_md5(handle + uid + cert + partnerid + newloginname + newpwd + newauthcode + unionid + datatype + securityKey)

        let self = this;
        var url = cc.js.formatStr(GameConfig.bingAccountAddress, handle, uid, cert, partnerid, newloginname, newpwd, newauthcode, unionid, nickname, icon, datatype, sign);

        console.log("startBindAccount url = " + url)

        HttpUtil.httpGet(url, function (data) {
            console.log("httpGet data = " + data)
            let temp = JSON.parse(data)
            if (temp.result.value == "0") {
                if (temp.result.data != null) {
                    if (temp.result.data.errorcode == "0" || temp.result.data.errorcode == "221") {
                        WindowManager.instance.showTips({
                            "desc": "绑定成功!2秒后系统自动刷新游戏",
                        });

                    } else if (temp.result.data.errorcode == "224" || temp.result.data.errorcode == "227") {
                        WindowManager.instance.showTips({
                            "desc": "需要前往亲朋游戏PC端进行互通，2秒后系统自动刷新游戏",
                        });
                    } else {
                        WindowManager.instance.showTips({
                            "desc": temp.result.data.msg,
                        });
                    }
                }
            } else {
                WindowManager.instance.showTips({
                    "desc": "绑定失败!2秒后系统自动刷新游戏",
                });
            }

            //主动断开网络
            net.close(false);

            //重新登陆
            self.scheduleOnce(function () {
                window.location.href = GameConfig.hostUrl;
            }, 2);
        });
    },

    //关闭界面
    closeView: function () {
        WindowManager.instance.closeWindow(this.name);
        this.node.destroy();
    },

    onDestroy: function () {
        this.removeEvent();
    }
});