var DataManager = require("DataManager");
var CacheManager = require("CacheManager");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.manhuaNode = [];
        for (let i = 0; i < 3; ++i) {
            this.manhuaNode[i] = this.node.getChildByName(`manhua${i}`);
        }
        this.skipBtn = this.node.getChildByName("skipBtn");
    },


    CartoonClick: function (event) {
        let btnNode = event.target;
        if (btnNode.name === "skipBtn") {
            for (let i = 0; i < 3; ++i) {
                this.manhuaNode[i].stopAllActions();
            }
            if (this.plotJs) {
                this.node.runAction(cc.sequence(
                    cc.delayTime(0.1),
                    cc.fadeOut(1),
                    cc.callFunc(() => this.plotJs.startPlot())
                ))
            }
        }
    },

    playCartoon: function (plotJs) {
        this.skipBtn.active = DataManager.instance.isSkipAni;
        if (!DataManager.instance.isSkipAni) {
            DataManager.instance.isSkipAni = true;
            CacheManager.instance.saveGameData();
        }

        this.plotJs = plotJs;
        this.node.opacity = 255;
        let manhuaTime = 2;
        for (let i = 0; i < 3; ++i) {
            this.manhuaNode[i].x = 700;
            this.manhuaNode[i].runAction(cc.sequence(
                cc.delayTime(i * manhuaTime),
                cc.moveBy(0.25, cc.v2(-700, 0)),
                cc.moveBy(0.05, cc.v2(+30, 0)),
                cc.moveBy(0.05, cc.v2(-30, 0)),
                cc.moveBy(0.05, cc.v2(+15, 0)),
                cc.moveBy(0.05, cc.v2(-15, 0)),
                cc.callFunc(() => {
                    for (let j = 0; j < this.manhuaNode[i].childrenCount; ++j) {
                        this.manhuaNode[i].children[j].active = true;
                    }
                    if (i == 2) {
                        this.node.runAction(cc.sequence(
                            cc.delayTime(2),
                            cc.fadeOut(1),
                            cc.callFunc(() => this.plotJs.startPlot())
                        ))
                    }
                })
            ))
        }
    },

});
