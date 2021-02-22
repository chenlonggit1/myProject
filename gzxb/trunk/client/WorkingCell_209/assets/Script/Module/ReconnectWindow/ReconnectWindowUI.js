cc.Class({
    extends: cc.Component,

    onLoad: function () {
        this.timer = 0.0;
        this.number = 1;
        this.tipsText = this.node.getChildByName("Text").getComponent(cc.Label);

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation();
        })
    },

    update: function (dt) {
        this.timer += dt;
        if (this.timer >= 1.0) {
            this.timer = 0.0;
            if (this.number == 1) {
                this.tipsText.string = "重新连接中.";
            } else if (this.number == 2) {
                this.tipsText.string = "重新连接中..";
            } else if (this.number == 3) {
                this.tipsText.string = "重新连接中...";
            } else {
                this.number = 0;
            }

            this.number++;
        }
    },

    onDestroy: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation();
        })
    },
});