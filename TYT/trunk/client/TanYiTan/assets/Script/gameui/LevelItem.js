import { loadResLayer } from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        levelTip: cc.Prefab,
        levelSprite: cc.Sprite,
        levelLock: cc.Node,
        levelLight: cc.Node,
        levelNum: cc.Label,
        levelIndex: 0,
    },

    onLoad() {
    },

    init(selectLevel, gameCtl) {
        this.gameCtl = gameCtl;
        this.selectLevel = selectLevel;
    },

    onLevelBtnClick(event) {
        if (this.gameCtl.bIsStartBall) {
            if (this.levelLock.active) {
                loadResLayer.prototype.addSystemTip("关卡未解锁");
            }
            else {
                this.selectLevel.setLevelShow(this.levelIndex);
                let levelTipPrb = cc.instantiate(this.levelTip);
                levelTipPrb.getComponent("LevelTip").text = `确定前往第${this.levelIndex}关吗`;
                this.gameCtl.node.addChild(levelTipPrb);
                levelTipPrb.getComponent("LevelTip").tipClick = this.tipClick.bind(this);
            }
        } else {
            loadResLayer.prototype.addSystemTip("弹球回收前暂无法选关");
        }
    },

    setLevelLock(bIsShow) {
        this.levelLock.active = bIsShow;
        this.levelLight.active = !bIsShow;
        this.levelNum.node.color = bIsShow ? cc.color(95, 102, 255) : cc.color(255, 201, 75);
    },

    setLevelNum(curLevelNum) {
        this.levelNum.string = curLevelNum;
        this.levelIndex = curLevelNum;
    },

    tipClick: function (event) {
        let btnName = event.target.name;
        if (btnName === "closeBtn") {
            event.target.parent.parent.destroy();
        } else if (btnName === "confirmBtn") {
            this.gameCtl.userInfo.guanqiaNum = this.levelIndex;
            this.gameCtl.tempLevelNum = this.levelIndex;
            this.gameCtl.setGuanqia();
            this.gameCtl.bIsGuanqia = false;
            this.gameCtl.ballScore = this.gameCtl.userInfo.guanqiaNum >= 2 ? this.gameCtl.userInfo.getFrontIntNum() : 0;
            this.gameCtl.ballManage.setBallScore(this.gameCtl.ballScore);
            event.target.parent.parent.destroy();
            this.selectLevel.node.destroy();
        }
    },

    setLevelSprite(bIsShow) {
        this.levelSprite.enabled = bIsShow;
    },

    onLevelClick() {
        if (this.gameCtl.bIsStartBall) {
            if (this.levelLock.active) {
                loadResLayer.prototype.addSystemTip("关卡未解锁");
            }
            else {
                this.selectLevel.setLevelShow(this.levelIndex);
                let levelTipPrb = cc.instantiate(this.levelTip);
                levelTipPrb.getComponent("LevelTip").text = `确定前往第${this.levelIndex}关吗`;
                this.gameCtl.node.addChild(levelTipPrb);
                levelTipPrb.getComponent("LevelTip").tipClick = this.tipClick.bind(this);
            }
        } else {
            loadResLayer.prototype.addSystemTip("弹球回收前暂无法选关");
        }
    },

});



