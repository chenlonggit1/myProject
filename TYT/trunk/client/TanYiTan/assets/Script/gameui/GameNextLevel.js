import { loadResLayer } from 'LoadResLayer';
import { GameTools } from 'GameTools';
cc.Class({
    extends: cc.Component,

    properties: {
        guanqia: cc.Label,
        endScore: cc.Label,
        endGold: cc.Label,
        guanqiaLb: cc.Label,
    },

    onLoad() {

    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.guanqia.string = "关卡" + this.gameCtl.userInfo.guanqiaNum;
        this.endScore.string = this.gameCtl.ballScore;
        this.endGold.string = this.gameCtl.curGoldNum;
        GameTools.submitScore(this.gameCtl.ballScore); //提交得分
        if (this.gameCtl.userInfo.guanqiaNum < 100) {
            this.gameCtl.userInfo.guanqiaNum++;
        }
        else {
            this.gameCtl.bIsHundred = true;
            this.guanqiaLb.string = "循环开始第一关";
        }
        if (this.gameCtl.userInfo.guanqiaNum > this.gameCtl.userInfo.highguanqiaNum) {
            this.gameCtl.userInfo.highguanqiaNum = this.gameCtl.userInfo.guanqiaNum;
        }

        this.gameCtl.saveData();
    },

    onBtnClick(event) {
        let btnName = event.target;
        if (btnName.name === "gameVideo") {
            this.node.destroy();
            cc.director.loadScene("Login");
        }
        else if (btnName.name === "gameShare") {
            this.gameCtl.setGuanqia();
            this.gameCtl.bIsGuanqia = false;
            this.node.destroy();
        }
    },
});



