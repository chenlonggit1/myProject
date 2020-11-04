
import { loadResLayer } from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        btnLayout: cc.Node,
        addScoreNode: cc.Node,
        addGoldNode: cc.Node,
    },

    onLoad: function () {
    },

    init: function (gameCtl) {
        this.gameCtl = gameCtl;

        for (let i = 0; i < 6; i++) {
            let tempButton = this.addScoreNode._children[i];
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "Test";//这个是代码文件名
            clickEventHandler.handler = "addScoreClick";
            clickEventHandler.customEventData = i;
            tempButton.getComponent(cc.Button).clickEvents.push(clickEventHandler);
        }
        for (let i = 0; i < 6; i++) {
            let tempButton = this.addGoldNode._children[i];
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "Test";//这个是代码文件名
            clickEventHandler.handler = "addGoldClick";
            clickEventHandler.customEventData = i;
            tempButton.getComponent(cc.Button).clickEvents.push(clickEventHandler);
        }
    },

    //测试
    testClick(event) {
        let btnNode = event.target;
        //收起、打开
        if (btnNode.name === "openBtn") {
            let curLayout = this.btnLayout;
            let curLabel = btnNode.getChildByName("Label").getComponent(cc.Label);
            if (!curLayout.active) {
                curLayout.active = true;
                curLayout.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(57, curLayout.y)), cc.callFunc(() => {
                    curLabel.string = "收起";
                })));
            } else {
                curLayout.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(-57, curLayout.y)), cc.callFunc(() => {
                    curLabel.string = "展开";
                    curLayout.active = false;
                })));
            }
        }
        //重置缓存
        else if (btnNode.name === "resetBtn") {
            this.gameCtl.clearData();
            loadResLayer.prototype.addSystemTip("清除成功！", true);
        }
        //一键通关
        else if (btnNode.name === "playerBtn") {
            this.gameCtl.ballScore += (this.gameCtl.userInfo.score - this.gameCtl.ballScore);
            this.gameCtl.ballManage.setBallScore(this.gameCtl.ballScore);
            this.gameCtl.bIsGuanqia = true;
            if (this.gameCtl.bIsStartBall) {
                this.gameCtl.gameEnd();
            }
        }
        //一键失败
        else if (btnNode.name === "failureBtn") {
            let gameEndNode = cc.instantiate(this.gameCtl.gameEndPrb);
            this.node.parent.addChild(gameEndNode);
            let gameEndJs = gameEndNode.getComponent("GameEnd");
            gameEndJs.init(this.gameCtl);
        }
        //加分
        else if (btnNode.name === "addScoreBtn") {
            this.addScoreNode.active = !this.addScoreNode.active;
        }
        //加金币
        else if (btnNode.name === "addGoldBtn") {
            this.addGoldNode.active = !this.addGoldNode.active;
        }
        //加道具
        else if (btnNode.name === "addPropBtn") {
            for (let i = 0; i < 3; i++) {
                this.gameCtl.gameSkill.setSkillNum(i, 1);
            }
        }
        //加球
        else if (btnNode.name === "addBallBtn") {
            if (this.gameCtl.bIsStartBall) {
                this.gameCtl.ballNumber += 10;
                this.gameCtl.ballManage.setBallNumber(this.gameCtl.ballNumber);
            }
            else {
                this.gameCtl.gameBoxNum += 10;
            }
        }
    },

    //测试添加分数
    addScoreClick(event, customEventData) {
        let curScore = 100 * Math.pow(10, customEventData);
        this.gameCtl.ballScore += curScore;
        this.gameCtl.ballManage.setBallScore(this.gameCtl.ballScore);
        if (this.gameCtl.ballScore >= this.gameCtl.userInfo.score) {
            this.gameCtl.bIsGuanqia = true;
            if (this.gameCtl.bIsStartBall) {
                this.gameCtl.gameEnd();
            }
        }
    },

    //测试添加金币
    addGoldClick(event, customEventData) {
        let curScore = 100 * Math.pow(10, customEventData);
        this.gameCtl.curGoldNum += curScore;
        this.gameCtl.goldNum += curScore;

        let curPiaofen = cc.instantiate(this.gameCtl.gamePiaofen);
        this.gameCtl.nodeRole.addChild(curPiaofen);
        curPiaofen.getComponent(cc.Label).string = "+" + curScore;
        curPiaofen.runAction(cc.sequence(
            cc.moveTo(0.5, cc.v2(curPiaofen.x, 130)),
            cc.fadeOut(0.3),
            cc.callFunc(() => curPiaofen.destroy())));
    },
});
