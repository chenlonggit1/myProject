import { GameTools } from 'GameTools';
import { config } from 'Config';
import { loadResLayer } from 'LoadResLayer';

const titleLb = ["一", "二", "三", "四", "五", "六", "七"];
const awardName = ["金币", "双倍", "金币", "炸弹", "金币", "激光", "金币"];
const awardNum = [188, 1, 588, 1, 1088, 1, 1588];
const signInNum = 7;

cc.Class({
    extends: cc.Component,

    properties: {
        signInNode: cc.Button,
        doubleNode: cc.Button,
        signInLb: cc.Label,
        awardNodeArr: [cc.Button],
        awardNumLb: [cc.Label],
    },

    // use this for initialization
    onLoad: function () {
        this.isTodaySignIn = GameTools.getIsTodaySignIn();
        this.todayTime = GameTools.getTime();
        if (!this.isTodaySignIn) {
            this.signInNode.interactable = false;
            this.signInLb.string = `已签到`;
        }
        for (let i = 0; i < this.todayTime.length; ++i) {
            this.awardNodeArr[i].interactable = false;
        }
        for (let i = 0; i < signInNum; ++i) {
            this.awardNumLb[i].string = awardNum[i];
        }
        this.awardNodeArr[this.todayTime.length].node.getChildByName("guang").active = true;
    },

    //签到
    signInClick: function (event) {
        let btnNode = event.target;
        if (btnNode.name === "signInBtn") {
            if (this.isTodaySignIn) {
                if (this.todayTime.length > 0) {
                    let tempVal = GameTools.getDays(this.todayTime[this.todayTime.length - 1], GameTools.getTodayTime());
                    if (tempVal > 1) {
                        this.todayTime.length = 0;
                    }
                }

                this.todayTime.push(GameTools.getTodayTime());

                this.signInNode.interactable = false;
                this.signInLb.string = `已签到`;

                this.awardNodeArr[this.todayTime.length - 1].interactable = false;
                this.awardNodeArr[this.todayTime.length - 1].node.getChildByName("guang").active = false;

                this.receiveAward();
                if (this.todayTime.length == 7) {
                    window.isSignInSevenDays = true;
                }

                loadResLayer.prototype.addSystemTip(`签到成功，获得${awardName[this.todayTime.length - 1]}${awardNum[this.todayTime.length - 1]}个`);

                let obj = {};
                obj.timeData = this.todayTime;
                obj.isSignInSevenDays = window.isSignInSevenDays;
                config.saveSignIn(obj);
                // console.log(`签到${this.todayTime}`);

                if (Math.random() < 0.3) {
                    console.log("奖励翻倍");
                    this.signInNode.node.active = false;
                    this.doubleNode.node.active = true;
                }
            }
        } else if (btnNode.name === "close") {
            this.node.destroy();
        } else if (btnNode.name === "doubleBtn") {
            let self = this;
            if (CC_WECHATGAME) {
                wx.shareAppMessage({
                    title: '超好玩的弹一弹消除游戏，只为带你回忆童趣时光。',
                    imageUrl: window.sharePath,
                    success: function (res) {
                        self.doubleAward();
                        if (window.shareThreeNum < 3) {
                            window.shareThreeNum++;
                        }
                    },
                    fail: function (res) {
                        self.doubleAward();
                    }
                })
            } else {
                self.doubleAward();
            }
        }
    },

    //分享双倍奖励
    doubleAward: function () {
        let self = this;
        self.receiveAward(true);
        self.doubleNode.interactable = false;
        loadResLayer.prototype.addSystemTip(`翻倍成功，获得${awardName[this.todayTime.length - 1]}${awardNum[this.todayTime.length - 1] * 2}个`);
    },

    //领取奖励
    receiveAward: function (isDouble = false) {
        let awardIndex = this.todayTime.length - 1;
        let awardValue = isDouble ? awardNum[awardIndex] * 2 : awardNum[awardIndex];
        switch (awardName[awardIndex]) {
            case "金币":
                window.awardGoldNum += awardValue;
                break;
            case "双倍":
                window.awardSkillNum[0] += awardValue;
                break;
            case "炸弹":
                window.awardSkillNum[2] += awardValue;
                break;
            case "激光":
                window.awardSkillNum[1] += awardValue;
                break;
        }
    },
});
