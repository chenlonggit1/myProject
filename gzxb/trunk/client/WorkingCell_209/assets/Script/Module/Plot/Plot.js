const EventManager = require('EventManager');
var DataManager = require("DataManager");
var CacheManager = require("CacheManager");
var AudioManager = require("AudioManager");


cc.Class({
    extends: cc.Component,

    properties: {
        plotItem: [cc.Prefab],
    },

    onLoad() {
        this.cartoonBg = this.node.getChildByName("cartoonBg");
        this.plotNode = this.node.getChildByName("plotNode");
        this.skipBtn = this.cartoonBg.getChildByName("skipBtn");
        this.huafenAni = this.cartoonBg.getChildByName("huafenguochang").getComponent(sp.Skeleton);

        this.initEvent();
    },

    initEvent: function () {
        EventManager.Add("EnterStory", function (event, data) {
            event.cartoonIndex = 0;
            event.playCartoon();
        }, this);
    },

    onDestroy: function () {
        EventManager.Remove("EnterStory", this);
    },

    plotBtnClick: function (event) {
        let btnNode = event.target;
        if (btnNode.name === "skipBtn") {
            this.skipBtn.active = false;
            this.unscheduleAllCallbacks();
            this.startPlot();
            this.scheduleOnce(() => this.closeManhua(), 1);
        }
    },

    playCartoon: function () {
        let curWinSize = cc.winSize;
        let tempRatio = curWinSize.height / curWinSize.width;
        if (tempRatio > 1.34 && curWinSize.height / curWinSize.width < 1.7) {
            this.huafenAni.node.setScale(0.9);
            this.skipBtn.y = 450;
        }
        this.cartoonBg.active = true;
        this.skipBtn.active = false;
        //背景淡入
        this.cartoonBg.opacity = 0;
        this.cartoonBg.runAction(cc.sequence(
            cc.fadeIn(1),
            cc.delayTime(0.8),
            cc.callFunc(() => {
                this.skipBtn.active = DataManager.instance.isSkipAni;
                if (!DataManager.instance.isSkipAni) {
                    DataManager.instance.isSkipAni = true;
                    CacheManager.instance.saveGameData();
                }

                this.huafenAni.node.active = true;
                this.huafenAni.clearTracks();
                this.huafenAni.setAnimation(0, "stand01", false);
                this.huafenAni.node.x = -1000;
                this.scheduleOnce(() => this.huafenAni.node.x = 0, 0.1);
                this.scheduleOnce(() => AudioManager.instance.playotherAudio("alarm"), 2);
                this.scheduleOnce(() => this.startPlot(), 7.5);
                this.scheduleOnce(() => this.closeManhua(), 8.5);
            })));
    },

    closeManhua: function () {
        this.cartoonBg.active = false;
        this.huafenAni.node.active = false;
    },

    startPlot: function () {
        this.plotNode.active = true;
        if (!this.plotItemNode) {
            this.plotItemNode = cc.instantiate(this.plotItem[this.cartoonIndex]);
            this.plotNode.addChild(this.plotItemNode);
        }
        this.plotItemNode.getComponent("PlotItem").initData();
    },

    startStone: function () {
        if (!this.stoneNode) {
            this.stoneNode = cc.instantiate(this.plotItem[1]);
            this.node.addChild(this.stoneNode);
        } else {
            this.stoneNode.active = true;
        }
        this.stoneNode.getComponent("Stone").initStone();
    },

});
