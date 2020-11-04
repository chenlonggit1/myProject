import {loadResLayer} from 'LoadResLayer';
import {GameTools} from 'GameTools';
cc.Class({
    extends: cc.Component,

    properties: {
        guanqia: cc.Label,
        endScore: cc.Label,
        endGold: cc.Label,
    },

    onLoad() {

    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.guanqia.string = "关卡" + this.gameCtl.userInfo.guanqiaNum;
        this.endScore.string = this.gameCtl.ballScore;
        this.endGold.string = this.gameCtl.curGoldNum;
        GameTools.submitScore(this.gameCtl.ballScore); //提交得分
        this.gameCtl.saveData();
    },

    onBtnClick(event) {
        let btnName = event.target;
        if (btnName.name === "gameVideo") {
            this.node.destroy();
            cc.director.loadScene("Login");
        }
        else if (btnName.name === "againGame") {
            this.gameCtl.setGuanqia();
            this.gameCtl.bIsGuanqia = false;
            this.gameCtl.ballScore = this.gameCtl.userInfo.guanqiaNum >= 2 ? this.gameCtl.userInfo.getFrontIntNum() : 0;
            this.gameCtl.ballManage.setBallScore(this.gameCtl.ballScore);
            this.node.destroy();
        }
        else if (btnName.name === "gameShare") {
            this.share();
        }
    },

    share() {
        let self = this;
        // 暂时为复活(消三行)
        if (this.gameCtl.userInfo.reviveNum > 0) {
            if (CC_WECHATGAME) {
                loadResLayer.prototype.addSystemTip("暂无广告");
            }
            else {
                this.gameCtl.userInfo.reviveNum--;
                self.gameCtl.revive();
                self.node.destroy();
            }
        }
        else {
            loadResLayer.prototype.addSystemTip("复活次数已用完");
        }
    },
});



