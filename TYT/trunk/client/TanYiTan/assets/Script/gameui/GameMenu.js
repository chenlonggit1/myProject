import {loadResLayer} from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        gameRule: cc.Prefab,
    },

    onLoad() {
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
    },

    onBtnClick(event) {
        let btnName = event.target;
        if (btnName.name === "backGame") {
            this.gameCtl.saveData(); 
            cc.director.loadScene("Login");
        }
        else if (btnName.name === "continueGame") {
            this.node.destroy();
        }
        else if (btnName.name === "gameRule") {
            let gameRulePrb = cc.instantiate(this.gameRule);
            this.node.addChild(gameRulePrb);
        }
    }
});
