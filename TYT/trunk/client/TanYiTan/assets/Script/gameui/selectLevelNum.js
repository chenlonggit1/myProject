import { loadResLayer } from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        levelItemNum: cc.Prefab,
        levelConent: cc.Node,
    },

    onLoad() {
    },

    init(selectLevel) {
        this.selectLevel = selectLevel;
        this.setLevelItemNum();
    },

    onBtnClick(event) {
        let btnName = event.target;
        if (btnName.name === "backButton") {
            this.node.destroy();
        }
    },

    setLevelItemNum() {
        for (let i = 0; i < 12; i++) {
            let tempLevel = cc.instantiate(this.levelItemNum);
            this.levelConent.addChild(tempLevel);

            let jsLevelItem = tempLevel.getComponent("LevelItemNum");
            jsLevelItem.onLevelBtnClick = this.onLevelBtnClick.bind(this);
            if (i < 10) {
                jsLevelItem.setCurLevelNum(i, i);
            } else if (i == 10) {
                jsLevelItem.setCurLevelNum("清除", i);
            } else if (i == 11) {
                jsLevelItem.setCurLevelNum("确认", i);
            }
        }
    },

    onLevelBtnClick(event) {
        let curNode = event.target;
        let curNum = curNode.getComponent("LevelItemNum").levelIndex;
        if (curNum < 10) {
            this.selectLevel.levelEditLb.string += curNum;
        } else if (curNum == 10) {
            this.selectLevel.levelEditLb.string = "";
        } else if (curNum == 11) {
            this.node.destroy();
        }
    }

});



