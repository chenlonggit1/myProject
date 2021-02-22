var net = require("net");
var GameConfig = require("GameConfig");
var EventManager = require('EventManager');
var WindowManager = require("WindowManager");
var LoginWindowUI = require("LoginWindowUI")

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar,
        progressBarText: cc.Label,
        loginWindow: cc.Node,
    },

    onLoad: function () {
        if (!cc.sys.capabilities.opengl) {
            alert("抱歉！您当前浏览器不支持webgl，无法正常体验游戏。");
            return;
        }

        this.initEvent();
        this.alignScreen();

        let self = this;
        let director = cc.director;
        let info = director._getSceneUuid("game");
        if (info) {
            director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, "game");
            cc.loader.load({
                uuid: info.uuid,
                type: 'uuid'
            }, (completedCount, totalCount, item) => {
                var percent = completedCount / totalCount;
                self.updateLoading(percent);
            }, (error, asset) => { });
        }

        cc.director.preloadScene("game");

        //是否已经拉取配置信息完毕
        this.getConfigFinished = false;

        //是否已经加载完毕资源
        this.loadAssetFinished = false;

        //拉取配置信息
        if (!GameConfig.isDebugGame) {
            net.getGameConfig(function (data) {
                if (data.GsAddress) {
                    GameConfig.getGameGSAddress = data.GetGameGsAddress;
                }
                if (data.GetPlayerIDInWeChatWithPostAddress) {
                    GameConfig.getPlayerIDInWeChatWithPostAddress = data.GetPlayerIDInWeChatWithPostAddress;
                }
                if (data.HostAddress) {
                    GameConfig.hostUrl = data.HostAddress;
                }
                if (data.ShareAddress) {
                    GameConfig.shareAddress = data.ShareAddress;
                }
                if (data.ShareIconAddress) {
                    GameConfig.shareIconAddress = data.ShareIconAddress;
                }

                //标记加载配置已完毕
                self.getConfigFinished = true;

                //登录流程
                self.showLoginWindow();
            })
        }
    },

    //初始化事件
    initEvent: function () {
        //登录成功事件
        EventManager.Add("LoginSuccess", function (event, data) {
            if (GameConfig.isDebugGame) {
                event.loginWindow.getComponent(LoginWindowUI).saveLoginInfo();
            }
            EventManager.Remove("LoginSuccess", event);
            EventManager.Remove("ChangeServerIpSuccess", event);
            EventManager.Dispatch("ChangeScene");
            cc.director.loadScene("game");
        }, this);

        //修改服务器IP成功事件
        EventManager.Add("ChangeServerIpSuccess", function (event, data) {
            if (!net.isActive) {
                net.Connect();
            }
            if (GameConfig.isDebugGame) {
                event.loginWindow.active = true;
                WindowManager.instance.windowAniPlay(event.loginWindow)
            }
        }, this);
    },

    alignScreen: function () {
        //适配
        let rate = cc.view.getVisibleSize().width / cc.view.getVisibleSize().height;
        let canvas = this.node.getComponent(cc.Canvas);
        let isMoreWidth = rate > (1136 / 640);

        if (rate < 1) {
            canvas.fitWidth = isMoreWidth;
            canvas.fitHeight = !isMoreWidth;
        }

        //iPhone X适配
        let curWinSize = cc.winSize;
        let tempRatio = curWinSize.height / curWinSize.width;
        window.bIsIPhoneX = tempRatio > 2;
        if (tempRatio > 1.34) {
            this.node.getChildByName("Background").getComponent(cc.Widget).isAlignLeft = true;
            this.node.getChildByName("Background").getComponent(cc.Widget).isAlignRight = true;
        }
        canvas.alignWithScreen();
    },

    updateLoading: function (percent) {
        this.progressBar.progress = percent;
        this.progressBarText.string = (percent * 100).toString().substr(0, 4) + "%";

        if (percent >= 1) {
            //标记加载资源完毕
            this.loadAssetFinished = true;
            //登录流程
            this.showLoginWindow();
        }
    },

    showLoginWindow: function () {
        if (GameConfig.isDebugGame) {
            //显示切换IP界面
            this.progressBar.node.active = false;
            WindowManager.instance.showWindow("ChangeServerIp");
        } else {
            if (this.getConfigFinished == true && this.loadAssetFinished == true) {
                this.loginWindow.active = true;
                WindowManager.instance.windowAniPlay(this.loginWindow)
            }
        }
    }
});