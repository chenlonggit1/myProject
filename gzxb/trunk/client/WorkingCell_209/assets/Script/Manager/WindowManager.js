var net = require("net");
var gameConfig = require('GameConfig');
var EventManager = require('EventManager');
var ResourceManager = require("ResourceManager")

var WindowManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {},

    onLoad: function () {
        //单例
        WindowManager.instance = this;

        //打开的Tips窗口
        this.openTipList = {};
        //打开的窗口列表
        this.openWindowList = {};
        //tips窗口父节点
        this.tipParentNode = null;
        //打开的窗口的父节点
        this.windowParentNode = null;

        this.initEvent();
    },

    //注册事件
    initEvent: function () {
        EventManager.Add("ChangeScene", function (event, data) {
            event.clearOpenWindowBeforeChangeScene();
        }, this);

        EventManager.Add("ResponseCodeError", function (event, content) {
            let data = {
                desc: content
            }
            event.showTips(data);
        }, this);

        EventManager.Add("NetClose", function (event, data) {
            event.showReconnectTip(data);
        }, this);
    },

    //移除事件
    removeEvent: function () {
        EventManager.Remove("ChangeScene", this);
        EventManager.Remove("ResponseCodeError", this);
        EventManager.Remove("NetClose", this);
    },

    //获取Tip窗口的父节点
    getTipParentNode: function () {
        if (this.tipParentNode == null) {
            var canvas = cc.director.getScene().getChildByName('Canvas');
            if (canvas != null) {
                var windowLayer = canvas.getChildByName("WindowLayer");
                if (windowLayer != null) {
                    this.tipParentNode = windowLayer.getChildByName("Tip");
                }
            }
        }

        return this.tipParentNode;
    },

    //获取Window窗口的父节点
    getWindowParentNode: function () {
        if (this.windowParentNode == null) {
            var canvas = cc.director.getScene().getChildByName('Canvas');
            if (canvas != null) {
                var windowLayer = canvas.getChildByName("WindowLayer");
                if (windowLayer != null) {
                    this.windowParentNode = windowLayer.getChildByName("Window");
                }
            }
        }

        return this.windowParentNode;
    },

    //防沉迷系统
    preventAddictionTip: function (type, tipTime, desc) {
        var data = {};
        if (type == "2") {
            data.okCallbakFunc = function () {
                cc.sys.openURL(gameConfig.antiAddictionAddresss);
            }
        } else {
            data.time = tipTime;
        }

        data.type = 2;
        data.desc = desc;
        this.showTips(data);
    },

    //显示Tips
    showTips: function (data) {
        this.showWindow("TipsWindow", data);
    },

    //打开界面
    showWindow: function (name, data = null) {
        var self = this;
        if (self.openWindowList[name] || self.openTipList[name]) {
            self.closeWindow(name, true);
        }

        ResourceManager.instance.createPrefab(name, function (window) {
            var component = window.getComponent(name + "UI");
            if (component != null) {
                component.initData(name, data);
            }
            window.setScale(0.3);
            if (name == "TipsWindow") {
                var tipParentNode = self.getTipParentNode();
                if (tipParentNode != null) {
                    tipParentNode.addChild(window);
                    self.openTipList[name] = window;
                }
            } else {
                var windowParentNode = self.getWindowParentNode();
                if (windowParentNode != null) {
                    windowParentNode.addChild(window);
                    self.openWindowList[name] = window;
                }
            }

            self.windowAniPlay(window);
        });
    },

    //播放窗口动画
    windowAniPlay: function (window) {
        var callback = cc.callFunc(this.showMask, this, window);
        window.runAction(cc.sequence(cc.scaleTo(0.1, 1.1),
            cc.scaleTo(0.08, 0.9),
            cc.scaleTo(0.08, 1.02),
            cc.scaleTo(0.05, 0.97),
            cc.scaleTo(0.05, 1),
            callback));
    },

    //展示遮罩
    showMask: function (sender, window) {
        if (window && window.getChildByName("MaskLayer")) {
            window.getChildByName("MaskLayer").active = true;
        }
    },

    //关闭窗口
    closeWindow: function (key, isDestroy = false) {
        if (this.openWindowList[key]) {
            if (isDestroy)
                this.openWindowList[key].destroy();

            delete this.openWindowList[key];
        }

        if (this.openTipList[key]) {
            if (isDestroy)
                this.openTipList[key].destroy();

            delete this.openTipList[key];
        }
    },

    //关闭所有窗口
    closeAllWindow: function () {
        var windowParentNode = this.getWindowParentNode();
        if (windowParentNode != null) {
            windowParentNode.removeAllChildren();
        }
        this.openWindowList = {};
    },

    //断线重连
    reconnect: function () {
        let scene = cc.director.getScene();
        if (scene.name == "loading") {
            net.Connect();
            EventManager.Add("netSuccess", function (event, res) {
                EventManager.Remove("netSuccess", this);
            }, this);

            //TODO 登录流程

            return;
        }

        //展示断线重连界面
        if (!this.reConnectMask) {
            this.showMaskReconnect();
        }

        //连接网络
        if (!net.conneting) {
            net.Connect(true);
        }

        var self = this;
        this.scheduleOnce(function () {
            //连上了走重连流程 
            if (net.isActive) {
                self.closeMaskReconnect();

                //TODO 重新登录流程
                net.LoginGameReq("");
            }
        }, 2);
    },

    //显示连接中
    showMaskReconnect: function () {
        var self = this;
        ResourceManager.instance.createPrefab("ReconnectWindow", function callback(node) {
            self.reConnectMask = node;
            let windowParentNode = self.getWindowParentNode();
            if (windowParentNode != null) {
                windowParentNode.addChild(self.reConnectMask);
            }
        });
    },

    //关闭连接中
    closeMaskReconnect: function () {
        if (this.reConnectMask) {
            this.reConnectMask.destroy();
            this.reConnectMask = null;
        }
    },

    //打开网络断开提示
    showReconnectTip: function (errorCode) {
        this.closeAllWindow();
        this.closeMaskReconnect();

        let self = this;
        if (net.reconnectCount >= 5) {
            var data = {
                desc: "重连失败，请刷新游戏",
            }
        } else {
            var data = {
                desc: "网络断开，请重新连接",
                confirmCallBack: function () {
                    self.reconnect();
                }
            }
        }

        this.showTips(data);
    },

    //切换场景之前，先把当前场景的数据清理掉
    clearOpenWindowBeforeChangeScene: function () {
        this.closeAllWindow();
        this.tipParentNode = null;
        this.windowParentNode = null;
    },

    //节点被销毁时被调用
    onDestroy: function () {
        this.removeEvent();
    },
});