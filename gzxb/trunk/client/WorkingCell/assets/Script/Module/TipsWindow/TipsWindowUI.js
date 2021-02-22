var WindowManager = require("WindowManager")

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function () {
        this.node.getChildByName("MaskLayer").on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        }, this.node);
        this.node.getChildByName("Background").on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        }, this.node);
    },

    //初始化
    initData: function (name, data) {
        this.name = name;
        this.node.getChildByName("Content").getComponent(cc.Label).string = data.desc || "";
        this.countDownTimeText = this.node.getChildByName("ConfirmBtn").getChildByName("CountDown").getComponent(cc.Label);

        this.cancelCallBack = data.cancelCallBack || false;
        if (!this.cancelCallBack) {
            //没有取消函数 
            this.node.getChildByName("CancelBtn").active = false;
            this.node.getChildByName("ConfirmBtn").setPosition(cc.v2(0, -108));
        }

        this.isStartCountDown = false;
        if (data.time) {
            //有倒计时
            this.isStartCountDown = true;
            this.scheduleOnce(this.closeView, data.time);
        }
        if (data.confirmCallBack) {
            //确定回调函数
            this.confirmCallBack = data.confirmCallBack;
        }
    },

    //倒计时
    countDownTimeFunc: function () {
        this.countDownTime--;
        this.countDownTimeText.string = this.countDownTime + "s";
        if (this.countDownTime <= 0) {
            this.unschedule(this.countDownTimeFunc);
            this.onConfirmBtnClicked();
        }
    },

    //确定按钮事件
    onConfirmBtnClicked: function () {
        if (this.confirmCallBack) {
            this.confirmCallBack();
        }
        this.closeView();
    },

    //取消按钮事件
    onCancelBtnClicked: function () {
        if (this.cancelCallBack) {
            this.cancelCallBack();
        }
        this.closeView();
    },

    //关闭界面
    closeView: function () {
        if (this.isStartCountDown) {
            this.unschedule(this.countDownTimeFunc);
        }
        this.node.getChildByName("MaskLayer").off(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        }, this.node);
        this.node.getChildByName("Background").off(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        }, this.node);

        WindowManager.instance.closeWindow(this.name);

        this.node.destroy();
    }
});