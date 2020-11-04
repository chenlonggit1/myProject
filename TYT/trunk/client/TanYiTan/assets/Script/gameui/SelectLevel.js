import { loadResLayer } from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        levelItem: cc.Prefab,
        selectLevelNum: cc.Prefab,
        levelLayout: cc.Node,
        // levelEditBox: cc.EditBox,
        levelEditLb: cc.Label,
        levelItemArr: [cc.Node],
    },

    onLoad() {
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.setLevelItem();
    },

    onBtnClick(event) {
        let btnName = event.target;
        if (btnName.name === "backButton") {
            this.node.destroy();
        }
        else if (btnName.name === "confirm") {
            let editString = this.levelEditLb.string;
            if (editString == "" || editString == null) {
                loadResLayer.prototype.addSystemTip("请输入正确关卡值");
            } else if (isNaN(editString)) {
                loadResLayer.prototype.addSystemTip("请输入正确关卡值");
            } else if (parseInt(editString) < 1 || parseInt(editString) > 100) {
                loadResLayer.prototype.addSystemTip("请输入1-100关卡值");
            } else {
                let jsLevelItem = this.levelItemArr[parseInt(editString) - 1].getComponent("LevelItem");
                jsLevelItem.onLevelClick();
            }
        }
        else if (btnName.name === "levelNum") {
            let curSelectLevelNum = cc.instantiate(this.selectLevelNum);
            this.node.addChild(curSelectLevelNum);
            curSelectLevelNum.getComponent("selectLevelNum").init(this);
        }
    },

    setLevelItem() {
        for (let i = 0; i < 100; i++) {
            let tempLevel = cc.instantiate(this.levelItem);
            this.levelLayout.addChild(tempLevel);
            let jsLevelItem = tempLevel.getComponent("LevelItem");
            jsLevelItem.init(this, this.gameCtl);

            jsLevelItem.setLevelLock(i + 1 > this.gameCtl.userInfo.highguanqiaNum);
            jsLevelItem.setLevelNum(i + 1);
            this.levelItemArr.push(tempLevel);
        }
        if (this.gameCtl.tempLevelNum > 0) { this.setLevelShow(this.gameCtl.tempLevelNum); }
        else { this.setLevelShow(this.gameCtl.userInfo.highguanqiaNum); }
    },

    setLevelShow(levelIndex) {
        for (let i = 0; i < 100; i++) {
            let jsLevelItem = this.levelItemArr[i].getComponent("LevelItem");
            if (i + 1 == levelIndex) {
                jsLevelItem.setLevelSprite(true);
            }
            else {
                jsLevelItem.setLevelSprite(false);
            }
        }
    }

});



