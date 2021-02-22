var net = require("net");
var util = require("util");
var Share = require("Share");
var HttpUtil = require("HttpUtil");
var GameConfig = require("GameConfig");
var DataManager = require("DataManager");
var CacheManager = require("CacheManager");
var EventManager = require("EventManager");
var WindowManager = require("WindowManager");

cc.Class({
    extends: cc.Component,

    properties: {
        accountInput: {
            type: cc.EditBox,
            default: null,
        },
        passwordInput: {
            type: cc.EditBox,
            default: null,
        },
        mask: {
            type: cc.Node,
            default: null,
        },
        text: {
            type: cc.Label,
            default: null,
        },
    },

    onLoad: function () {
        this.account = "";
        this.password = "";
        this.isWechatLogin = false;

        this.initEvent();

        if (GameConfig.isDebugGame == true) {
            if (CacheManager.instance.userDatas != null) {
                if (CacheManager.instance.userDatas["account"] != null) {
                    this.account = CacheManager.instance.userDatas["account"];
                    this.accountInput.string = this.account;
                }

                if (CacheManager.instance.userDatas["password"] != null) {
                    this.password = CacheManager.instance.userDatas["password"];
                    this.passwordInput.string = this.password;
                }
            }

            this.node.getChildByName("Background").active = true;
        }

        if (!GameConfig.isDebugGame) {
            cc.director.getScene().getChildByName("Share").getComponent(Share).getConfig();
        }
    },

    start: function () {
        if (net.loadedProtoBuf == true) {
            if (GameConfig.isDebugGame == false && this.isWechatLogin == false) {
                this.weChatLogin();
            }
        }
    },

    initEvent: function () {
        EventManager.Add("LoadProtoFinished", function (event, data) {
            if (event.isWechatLogin == false) {
                if (GameConfig.isDebugGame == false) {
                    event.weChatLogin();
                } else {
                    WindowManager.instance.showTips({
                        "desc": "登录失败",
                    });
                }
            }
        }, this)

        EventManager.Add("netSuccess", function (event, data) {
            if (GameConfig.isDebugGame == false) {
                event.text.string = "登录中...";
                if (net.PlayerId > 0) {
                    net.LoginGameReq("");
                }
            }
        }, this);

        EventManager.Add("ChangeScene", function (event, data) {
            EventManager.Remove("netSuccess", event);
            EventManager.Remove("ChangeScene", event);
            EventManager.Remove("LoadProtoFinished", event);
        }, this);
    },

    //登录按钮事件
    onLoginBtnClick: function () {
        this.account = this.accountInput.string;
        this.password = this.passwordInput.string;
        if (this.account == "") {
            WindowManager.instance.showTips({
                "desc": "请输入用户名",
            });
            return;
        }

        if (this.password == "") {
            WindowManager.instance.showTips({
                "desc": "请输入密码",
            });
            return;
        }

        net.GetPlayerId(this.account, util.PwdMD5(this.password));

        this.node.active = false;
    },

    //微信登录
    weChatLogin: function () {
        this.isWechatLogin = true;

        let url = cc.sys.localStorage.getItem('GameAddress');
        if (!url) {
            url = window.location.search.substr(1);
        }

        //解析url
        url = decodeURI(url);
        var unionid = util.GetQueryString('unionid', url) || "";
        var headurl = util.GetQueryString('headimgurl', url) || "";
        var gameid = util.GetQueryString('gameid', url) || "10095";
        var appid = util.GetQueryString('appid', url) || "";
        var openid = util.GetQueryString('openid', url) || "";
        var key = util.GetQueryString('key', url) || "";
        var nickname = util.GetQueryString('nickname', url) || "";
        var sex = util.GetQueryString('sex', url) || "0";

        //缓存数据
        DataManager.instance.unionid = unionid || "";
        DataManager.instance.openid = openid || "";
        DataManager.instance.nickName = nickname || "";
        DataManager.instance.headUrl = headurl || "";

        this.mask.active = true;

        let self = this;
        //微信授权验证
        // self.text.string = "微信登录验证中..."
        let temp = cc.js.formatStr(GameConfig.loginVerifyAddress, gameid, appid, unionid, openid, key);
        HttpUtil.httpGet(temp, function (data) {
            //验证通过，开始登录
            if (data == "ok" || data == "unbind") {
                self.text.string = "拉取游戏信息中."
                self.getPlayerIdInWeChat();
            }
        });
    },

    //获取玩家ID
    getPlayerIdInWeChat: function () {
        let self = this;
        net.GetPlayerIdInWeChatWithPost(10095, 1, 1, "1", DataManager.instance.unionid, DataManager.instance.nickName, DataManager.instance.headUrl, 0, function (loginInfo) {
            let temp = JSON.parse(loginInfo)
            if (temp.res != "sucess") {
                net.ReportError("GetPlayeridFailed*errorcode=" + temp.errorcode + "*extramessage=" + temp.extramessage + "*nickname=" + DataManager.instance.nickName + "*unionid=" + DataManager.instance.unionid)
            } else {
                //设置玩家id
                net.PlayerId = temp.userid;
                DataManager.instance.cert = temp.cert;
                self.text.string = "拉取游戏信息中.."
                //拉取连接的服务器
                net.GetGameGSInfo(function (serverData) {
                    self.text.string = "拉取游戏信息中..."
                    net.getServerIp(serverData, function () {
                        self.text.string = "网络连接中...";
                        if (!net.isActive) {
                            net.Connect();
                        }
                    });
                })
            }
        }, function () {
            self.getPlayerIdInWeChat();
        });
    },

    saveLoginInfo: function () {
        CacheManager.instance.userDatas["account"] = this.accountInput.string;
        CacheManager.instance.userDatas["password"] = this.passwordInput.string;
        CacheManager.instance.saveUserDatas();
    },
});