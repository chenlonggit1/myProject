var net = require("net")
var GameConfig = require("GameConfig")
var DataManager = require("DataManager");
var EventManager = require("EventManager");
var AudioManager = require("AudioManager");
var WindowManager = require("WindowManager");

cc.Class({
    extends: cc.Component,

    onLoad: function () {
        this.mask = this.node.getChildByName("Mask")
        this.multipleRateSelect = this.node.getChildByName("MultipleRateSelect");
        this.multipleRateBtn = this.node.getChildByName("MultipleRateBtn");
        this.currenMultipleRate = this.multipleRateBtn.getChildByName("MultipleRate").getComponent(cc.Label);
        this.jiantouNode = this.node.getChildByName("jiantou");
        this.isMultipleRateLocked = false;

        this.updataSlect();
        this.updateMultipLeRate();
        this.initEvent();
        this.isShow = false;
        this.mask.active = false;
        this.jiantouNode.rotation = 180;
        this.multipleRateSelect.active = false;
    },

    initGameCtr: function (gameCtr) {
        this.gameCtr = gameCtr;
    },

    initEvent: function () {
        let self = this;
        this.multipleRateBtn.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        });

        //进入小丑模式
        EventManager.Add("EnterJokerStatus", function (event, data) {
            if (event.isShow) {
                event.hideSelect();
            }

            if (event.isLocked) {
                event.scheduleOnce(function () {
                    event.hideSelect();
                }, 0.75);
            }
        }, this);
    },

    getRateIndex: function (rate) {
        let len = GameConfig.meetingMultipleRate.length;
        for (let i = 0; i < len; i++) {
            if (GameConfig.meetingMultipleRate[i] == rate) {
                return i;
            }
        }
        return null;
    },

    changeMultipleRate: function (event, index) {
        if (this.isLocked) return;
        let multipleRate = GameConfig.meetingMultipleRate[index];
        if (DataManager.instance.getClientMoney() < multipleRate) {
            WindowManager.instance.showTips({
                "desc": "金币不足，请充值",
                "confirmCallBack": function () {
                    WindowManager.instance.showWindow("ShopWindow")
                },
            })
            return;
        } else {
            net.SetRatioReq(multipleRate);
            this.changeShow();
        }
    },

    updataSlect: function () {
        this.currenMultipleRate.string = (GameConfig.meetingMultipleRate[DataManager.instance.multipleIndex]) + "";
    },

    showSelect: function () {
        if (this.isLocked) return;
        this.playMultipleRate(true);
        this.multipleRateSelect.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        });
    },

    playMultipleRate: function (isShow = false) {
        this.isLocked = true;
        this.isShow = isShow;
        this.mask.active = isShow;
        this.jiantouNode.rotation = isShow ? 0 : 180;
        if (isShow) {
            this.multipleRateSelect.active = true;
            AudioManager.instance.playotherAudio("ratio_open");
        } else {
            AudioManager.instance.playotherAudio("ratio_close");
        }
        for (let i = 1; i < 6; i++) {
            let item = this.multipleRateSelect.getChildByName("MultipleRate_" + i);
            if (isShow)
                item.runAction(cc.sequence(cc.scaleTo(0.03 * i, 1), cc.moveTo(0.1, cc.v2(-235, item.position.y)),
                    cc.moveBy(0.05, cc.v2(+20, 0)),
                    cc.moveBy(0.05, cc.v2(-20, 0)),
                    cc.moveBy(0.05, cc.v2(+10, 0)),
                    cc.moveBy(0.05, cc.v2(-10, 0))));
            else
                item.runAction(cc.sequence(cc.scaleTo(0.03 * i, 1), cc.moveTo(0.1, cc.v2(0, item.position.y)),
                    cc.callFunc(() => {
                        if (i == 5) {
                            this.multipleRateSelect.active = false;
                        }
                    })));
        }
        this.scheduleOnce(function () {
            this.isLocked = false;
        }, 0.5)
    },

    hideSelect: function () {
        if (this.isLocked) {
            return;
        }
        this.hideMultipLeRateSelect();
    },

    hideMultipLeRateSelect: function () {
        this.playMultipleRate(false);
        this.multipleRateSelect.off(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        });
    },

    changeShow: function () {
        if (DataManager.instance.isJokerFreeStatus) {
            return;
        }
        if (this.isShow) {
            this.hideSelect();
        } else {
            this.showSelect();
        }
    },

    updateMultipLeRate: function (multiple = 1) {
        for (let index = 0; index < GameConfig.meetingMultipleRate.length; index++) {
            let temp = "MultipleRate_" + (index + 1).toString();
            this.multipleRateSelect.getChildByName(temp).getChildByName("text").getComponent(cc.Label).string = (GameConfig.meetingMultipleRate[index]) + "";
        }
    },

    onDestroy: function () {
        EventManager.Remove("EnterJokerStatus", this);
    }
});