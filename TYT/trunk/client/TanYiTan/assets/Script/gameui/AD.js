
import {loadResLayer} from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },

    init: function (gameCtl) {
        this.gameCtl = gameCtl;
    },

    tipClick: function (event) {
        let btnName = event.target.name;
        if (btnName === "closeBtn") {
            this.node.destroy();
        }
        else if (btnName === "confirmBtn") {
            if (CC_WECHATGAME) {
                loadResLayer.prototype.addSystemTip("暂无广告");
            }
            else {
                this.gameCtl.revive();
                this.node.destroy();
            }

        }
    }
});
