import { loadResLayer } from 'LoadResLayer';
import { GameTools } from 'GameTools';
const MonstList = ['武器：增加魔力球的分裂概率',
    '头肩：提高双倍魔力球的触发概率',
    '上装：增加魔力球的数量',
    '下装：增加魔力球的尺寸',
    '腰带：增加魔力球的双倍得分概率',
    '鞋子：增加魔力球的移动速度'];
const propertyName = ["武器", "头肩", "上装", "下装", "腰带", "鞋子"];

cc.Class({
    extends: cc.Component,

    properties: {
        lbGold: cc.Label,
        nodeProperty: [cc.Node],
        lbProperty: [cc.Label],
        spProperty: [cc.Node],
        upgradePfb: cc.Prefab,
        upgradeGold: cc.Node,
        lbDetail: cc.Label,
    },

    onLoad() {
    },

    start() {
        this.goldValue = this.gameCtl.goldNum;
        this.lbGold.string = this.goldValue;
        this.bIsDetail = this.gameCtl.userInfo.bIsDetail;
        this.lbGrade = new Array();
        this.spBorder = new Array();
        this.spUpgrade = new Array();
        for (let i = 0; i < 6; i++) {
            let tempButton = this.nodeProperty[i];
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "GameProperty";//这个是代码文件名
            clickEventHandler.handler = "propertyClick";
            clickEventHandler.customEventData = i;
            tempButton.getComponent(cc.Button).clickEvents.push(clickEventHandler);
        }
        for (let i = 0; i < 6; i++) {
            this.lbGrade[i] = this.nodeProperty[i].getChildByName("dengji");
            this.spBorder[i] = this.nodeProperty[i].getChildByName("danzhu_sx_zbkuang2");
            this.spUpgrade[i] = this.nodeProperty[i].getChildByName("danzhu_sx_jt");
        }
        for (let i = 0; i < 6; i++) {
            this.lbGrade[i].getComponent(cc.Label).string = propertyName[i] + " lv." + this.gameCtl.userInfo.grade[i];
            this.spBorder[i].active = false;
            // this.spUpgrade[i].active = false;
            this.setUpgradeSign(i);
        }
        this.currentClick = this.gameCtl.userInfo.currentClick;
        this.propertyClick(null, this.currentClick);
        this.setDetail();
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
    },

    onBtnClick(event) {
        let btnName = event.target;
        // loadResLayer.prototype.addSystemTip(btnName.name);
        if (btnName.name === "closeBtn") {
            this.gameCtl.userInfo.currentClick = this.currentClick;
            this.gameCtl.userInfo.bIsDetail = this.bIsDetail;
            this.node.destroy();
        }
        else if (btnName.name === "upgradeBtn") {
            let nextGrade = this.gameCtl.userInfo.getEquipGrade(this.currentClick) + 1;
            let needGold = this.gameCtl.userInfo.getNextEquipConsume(this.currentClick);
            if (nextGrade <= 2) {
                if (this.currentClick > 0) {
                    //["武器", "头肩", "上装", "下装", "腰带", "鞋子"];
                    switch (this.currentClick) {
                        //头肩解锁：关卡达到10级
                        case 1:
                            if (this.gameCtl.userInfo.guanqiaNum < 5) {
                                loadResLayer.prototype.addUnlockTip(`关卡达到5关自动解锁`, `当前进度${this.gameCtl.userInfo.guanqiaNum}/5`);
                                return;
                            }
                            break;
                        //上装解锁：累计签到7天
                        case 2:
                            if (!window.isSignInSevenDays) {
                                loadResLayer.prototype.addUnlockTip(`累计签到7天自动解锁`, `当前进度${GameTools.getTime().length}/7`);
                                return;
                            }
                            break;
                        //下装解锁：分享三次
                        case 3:
                            if (this.gameCtl.userInfo.guanqiaNum < 10) {
                                loadResLayer.prototype.addUnlockTip(`关卡达到10关自动解锁`, `当前进度${this.gameCtl.userInfo.guanqiaNum}/10`);
                                return;
                            }
                            break;
                        //腰带解锁：邀请两名玩家
                        case 4:
                            if (this.gameCtl.userInfo.guanqiaNum < 15) {
                                loadResLayer.prototype.addUnlockTip(`关卡达到15关自动解锁`, `当前进度${this.gameCtl.userInfo.guanqiaNum}/15`);
                                return;
                            }
                            break;
                        //鞋子解锁：都解锁后
                        case 5:
                            let isUnlock = true;
                            let unlockNum = 0;
                            for (let i = 0; i < this.gameCtl.userInfo.grade.length - 1; ++i) {
                                if (this.gameCtl.userInfo.grade[i] < 2) {
                                    isUnlock = false;
                                    unlockNum++;
                                }
                            }
                            if (!isUnlock) {
                                loadResLayer.prototype.addUnlockTip(`其他属性等级均达到2级`, `当前进度${5 - unlockNum}/5`);
                                return;
                            }
                            break;
                    }
                }
            }
            if (this.gameCtl.userInfo.grade[this.currentClick] >= 100) {
                loadResLayer.prototype.addSystemTip("装备等级已满");
            }
            else if (this.goldValue >= needGold) {
                if (this.currentClick == 2) {
                    let curTopsValue = this.gameCtl.userInfo.tops;
                    let nextTopsValue = this.gameCtl.userInfo.getNextEquipGrade(2);
                    if (nextTopsValue > curTopsValue) {
                        if (this.gameCtl.bIsStartBall) {
                            if (this.gameCtl.bCurSkill[0]) {
                                this.gameCtl.ballNumber += nextTopsValue - curTopsValue;
                                this.gameCtl.doubleNum += nextTopsValue - curTopsValue;
                                this.gameCtl.ballManage.setBallNumber(this.gameCtl.ballNumber + this.gameCtl.doubleNum);
                            } else {
                                this.gameCtl.ballNumber += nextTopsValue - curTopsValue;
                                this.gameCtl.ballManage.setBallNumber(this.gameCtl.ballNumber);
                            }
                        }
                        else {
                            this.gameCtl.topsNum += nextTopsValue - curTopsValue;
                        }
                    }
                }

                this.goldValue -= needGold;
                this.gameCtl.goldNum -= needGold;
                this.lbGold.string = this.goldValue;
                this.gameCtl.userInfo.setEquipGrade(this.currentClick, 1);
                this.lbGrade[this.currentClick].getComponent(cc.Label).string = propertyName[this.currentClick] + " lv." + nextGrade;
                needGold = this.gameCtl.userInfo.getNextEquipConsume(this.currentClick);
                this.setUpgradeGold(needGold);
                this.setUpgradeSign(this.currentClick);
                if (this.bIsDetail) {
                    this.setUpgradeLabel();
                }

                let tempUpgradePfb = cc.instantiate(this.upgradePfb);
                this.nodeProperty[this.currentClick].addChild(tempUpgradePfb);
            } else {
                loadResLayer.prototype.addSystemTip("金币不足");
            }
        }
        else if (btnName.name === "onekeyBtn") {
            let tempTopVal = this.gameCtl.userInfo.tops;
            let nextGrade = this.gameCtl.userInfo.getEquipGrade(this.currentClick) + 1;
            let needGold = this.gameCtl.userInfo.getNextEquipConsume(this.currentClick);
            if (nextGrade <= 2) {
                if (this.currentClick > 0) {
                    //["武器", "头肩", "上装", "下装", "腰带", "鞋子"];
                    switch (this.currentClick) {
                        //头肩解锁：关卡达到10级
                        case 1:
                            if (this.gameCtl.userInfo.guanqiaNum < 5) {
                                loadResLayer.prototype.addUnlockTip(`关卡达到5关自动解锁`, `当前进度${this.gameCtl.userInfo.guanqiaNum}/5`);
                                return;
                            }
                            break;
                        //上装解锁：累计签到7天
                        case 2:
                            if (!window.isSignInSevenDays) {
                                loadResLayer.prototype.addUnlockTip(`累计签到7天自动解锁`, `当前进度${GameTools.getTime().length}/7`);
                                return;
                            }
                            break;
                        //下装解锁：分享三次
                        case 3:
                            if (this.gameCtl.userInfo.guanqiaNum < 10) {
                                loadResLayer.prototype.addUnlockTip(`关卡达到10关自动解锁`, `当前进度${this.gameCtl.userInfo.guanqiaNum}/10`);
                                return;
                            }
                            break;
                        //腰带解锁：邀请两名玩家
                        case 4:
                            if (this.gameCtl.userInfo.guanqiaNum < 15) {
                                loadResLayer.prototype.addUnlockTip(`关卡达到15关自动解锁`, `当前进度${this.gameCtl.userInfo.guanqiaNum}/15`);
                                return;
                            }
                            break;
                        //鞋子解锁：都解锁后
                        case 5:
                            let isUnlock = true;
                            let unlockNum = 0;
                            for (let i = 0; i < this.gameCtl.userInfo.grade.length - 1; ++i) {
                                if (this.gameCtl.userInfo.grade[i] < 2) {
                                    isUnlock = false;
                                    unlockNum++;
                                }
                            }
                            if (!isUnlock) {
                                loadResLayer.prototype.addUnlockTip(`其他属性等级均达到2级`, `当前进度${5 - unlockNum}/5`);
                                return;
                            }
                            break;
                    }
                }
            }
            if (this.gameCtl.userInfo.grade[this.currentClick] == 100) {
                loadResLayer.prototype.addSystemTip("装备等级已满");
            }
            else if (this.goldValue >= needGold) {
                let tempVal = 0;
                let tempIndex = 1;
                for (let i = nextGrade; i < 101; i++) {
                    if (this.goldValue >= tempVal + this.gameCtl.userInfo.getAnyEquipConsume(i)) {
                        tempVal += this.gameCtl.userInfo.getAnyEquipConsume(i);
                        tempIndex = i;
                    }
                    else {
                        break;
                    }
                }
                if (this.currentClick == 2) {
                    let curTopsValue = this.gameCtl.userInfo.tops;
                    let nextTopsValue = this.gameCtl.userInfo.getNextEquipGrade(2, tempIndex - 1);
                    if (nextTopsValue > curTopsValue) {
                        if (this.gameCtl.bIsStartBall) {
                            if (this.gameCtl.bCurSkill[0]) {
                                this.gameCtl.ballNumber += nextTopsValue - curTopsValue - tempTopVal;
                                this.gameCtl.doubleNum += nextTopsValue - curTopsValue - tempTopVal;
                                this.gameCtl.ballManage.setBallNumber(this.gameCtl.ballNumber + this.gameCtl.doubleNum);
                            } else {
                                this.gameCtl.ballNumber += nextTopsValue - curTopsValue - tempTopVal;
                                this.gameCtl.ballManage.setBallNumber(this.gameCtl.ballNumber);
                            }
                        }
                        else {
                            this.gameCtl.nextTopsNum = curTopsValue;
                            this.gameCtl.topsNum += nextTopsValue - curTopsValue;
                        }
                    }
                }
                this.goldValue -= tempVal;
                this.gameCtl.goldNum -= tempVal;
                this.lbGold.string = this.goldValue;
                this.gameCtl.userInfo.setEquipGrade(this.currentClick, tempIndex - this.gameCtl.userInfo.getEquipGrade(this.currentClick));
                this.lbGrade[this.currentClick].getComponent(cc.Label).string = propertyName[this.currentClick] + " lv." + tempIndex;
                needGold = this.gameCtl.userInfo.getNextEquipConsume(this.currentClick);
                this.setUpgradeGold(needGold);
                if (this.bIsDetail) {
                    this.setUpgradeLabel();
                }

                let tempUpgradePfb = cc.instantiate(this.upgradePfb);
                this.nodeProperty[this.currentClick].addChild(tempUpgradePfb);
            } else {
                loadResLayer.prototype.addSystemTip("金币不足");
            }
        }
        else if (btnName.name === "detailBtn") {
            this.bIsDetail = !this.bIsDetail;
            this.setDetail();
        }
    },

    setDetail() {
        this.lbDetail.string = this.bIsDetail ? "装备介绍" : "详细数值";

        if (this.bIsDetail) {
            this.setUpgradeLabel();
        } else {
            for (let i = 0; i < 6; i++) {
                this.lbProperty[i].string = MonstList[i];
            }
        }
    },

    propertyClick(event, customEventData) {
        for (let i = 0; i < 6; i++) {
            this.spBorder[i].active = false;
            this.spProperty[i].active = false;
            this.lbProperty[i].node.color = cc.color(175, 166, 255);
        }
        this.spBorder[customEventData].active = true;
        this.spProperty[customEventData].active = true;
        this.lbProperty[customEventData].node.color = cc.color(254, 220, 104);
        this.currentClick = customEventData;

        // let nextGrade = this.gameCtl.userInfo.getEquipGrade(this.currentClick) + 1;
        let needGold = this.gameCtl.userInfo.getNextEquipConsume(this.currentClick);
        this.setUpgradeGold(needGold);
    },

    setUpgradeGold(curUpgradeGold) {
        this.upgradeGold.getComponent(cc.Label).string = curUpgradeGold > 38917 ? "已满" : curUpgradeGold;
        this.node.getChildByName("bg").getChildByName("upgradeBtn").getComponent(cc.Button).interactable = curUpgradeGold <= 38917;
        this.node.getChildByName("bg").getChildByName("onekeyBtn").getComponent(cc.Button).interactable = curUpgradeGold <= 38917;
    },

    setUpgradeLabel() {
        this.lbProperty[0].string = `武器：  ${this.gameCtl.userInfo.weapon.toFixed(1)}% 一> ${this.gameCtl.userInfo.getNextEquipGrade(0)}`;
        this.lbProperty[1].string = `头肩：  ${this.gameCtl.userInfo.head.toFixed(2)}% 一> ${this.gameCtl.userInfo.getNextEquipGrade(1)}`;
        this.lbProperty[2].string = `上装：  ${this.gameCtl.userInfo.tops} 一> ${this.gameCtl.userInfo.getNextEquipGrade(2)}`;
        this.lbProperty[3].string = `下装：  ${this.gameCtl.userInfo.bottoms.toFixed(2)} 一> ${this.gameCtl.userInfo.getNextEquipGrade(3)}`;
        this.lbProperty[4].string = `腰带：  ${this.gameCtl.userInfo.belt.toFixed(1)}% 一> ${this.gameCtl.userInfo.getNextEquipGrade(4)}`;
        this.lbProperty[5].string = `鞋子：  ${this.gameCtl.userInfo.shoe} 一> ${this.gameCtl.userInfo.getNextEquipGrade(5)}`;
    },

    setUpgradeSign(upgradeIndex) {
        let curGrade = this.gameCtl.userInfo.grade[upgradeIndex];
        this.spUpgrade[upgradeIndex].active = curGrade < 100;
    },
});
