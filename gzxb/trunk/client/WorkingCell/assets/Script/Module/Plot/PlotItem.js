
var util = require("util");
var net = require("net");
var ResourceManager = require('ResourceManager');
var EnumDefine = require("EnumDefine");
var EventManager = require('EventManager');
var AudioManager = require("AudioManager");
var DataManager = require("DataManager");

const autoAttackTime = 3;   //自动攻击时间
const enterAutoTime = 10;    //托管时间
const imgSizeX = 960;
const imgSizeY = 1386;

//射击缩放初始位置
const zoomBeginPos = [
    cc.v2(-30, 30),
    cc.v2(30, 30),
    cc.v2(30, -30),
    cc.v2(-30, -30),
];
//射击缩放结束位置
const zoomEndPos = [
    cc.v2(-45, 45),
    cc.v2(45, 45),
    cc.v2(45, -45),
    cc.v2(-45, -45),
];

cc.Class({
    extends: cc.Component,

    properties: {
        boxPfb: cc.Prefab,      //怪物盒子
        goldScoreLb: cc.Prefab, //金币奖励
    },

    onLoad() {
        this.plotBg = this.node.getChildByName("plotBg");
        this.germNode = this.plotBg.getChildByName("germNode");
        this.boxNode = this.plotBg.getChildByName("boxNode");
        this.germPosNode = this.plotBg.getChildByName("germPos");
        this.shot = this.node.getChildByName("shot");
        this.autoLb = this.node.getChildByName("autoBtn").getChildByName("autoLabel").getComponent(cc.Label);
        this.autoTimeLb = this.node.getChildByName("autoBtn").getChildByName("autoTime").getComponent(cc.Label);
        this.changeProgressBar = this.node.getChildByName("autoBtn").getChildByName("xb_jqms_zdbtn1").getComponent(cc.ProgressBar);
        this.tipNode = this.node.getChildByName("tipBtn").getChildByName("tipNode");
        this.multiKillNode = this.node.getChildByName("multiKill");
        this.piaofenNode = this.node.getChildByName("piaofen");
        this.shotFlag = this.node.getChildByName("shotFlag");
        this.plotMask = this.node.getChildByName("plotMask");
        this.tipMask = this.node.getChildByName("tipMask");
        this.clickMask = this.node.getChildByName("clickMask");
        this.germNum = this.node.getChildByName("germNum").getChildByName("num").getComponent(cc.Label);

        //连击动画
        this.multiKillAni = [];
        for (let i = 1; i < 6; ++i) {
            this.multiKillAni[i] = this.multiKillNode.getChildByName(`Effect_${i}LianJi`).getComponent(cc.Animation);
        }

        //射击放缩标志
        this.shotFlagList = [];
        for (let i = 0; i < 4; ++i) {
            this.shotFlagList[i] = this.shotFlag.getChildByName(`shotFlag${i}`);
        }

        this.multiGoldAni = [];
        for (let i = 0; i < 3; ++i) {
            this.multiGoldAni[i] = this.piaofenNode.getChildByName(`Effect_LianJi_JinBi0${i + 1}`);
        }

        this.initEvent();
        this.init();
    },

    //注册事件
    initEvent: function () {
        //手指触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        //手指移动事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        //手指触摸结束事件
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancel, this);

        //攻击过敏源
        EventManager.Add("AllergenAttack", function (event, data) {
            event.attackIndex = event.allergenList[data.Index];
            event.killGerm(event.attackIndex);
            event.isAttack = false;
            event.germNum.string = `x${5 - (event.curAllergen + 1)}`;
            if (data.Delta > 0) {
                let goldType = parseInt(data.ComboCount);
                if (goldType > 3) {
                    goldType = 3;
                } else if (goldType > 1) {
                    goldType = 2;
                }
                AudioManager.instance.playotherAudio(`gold${goldType}`);
                event.scheduleOnce(() => event.playMediumGoldEffect(goldType), 0.2);
                event.scheduleOnce(() => event.addGoldScore(data.Delta), 0.3);
                event.multikill(data.ComboCount, data.FirstReward);
            }
        }, this);

        //退出剧情
        EventManager.Add("ExitStory", function (event, data) {
            event.scheduleOnce(() => event.playBigGoldEffect(data.Delta), 3);
            DataManager.instance.setClientMoney(data.Money);
            EventManager.Dispatch('changeMoney');
            event.clickMask.active = true;
            event.isAutoAttack = false;
            event.autoGame = false;
            event.autoTimeLb.node.active = false;
            if (event.autoAttackGrem) {
                event.unschedule(event.autoAttackGrem);
                event.autoAttackGrem = null;
                event.autoLb.string = `自动`;
            }
        }, this);
    },

    //移除事件
    onDestroy: function () {
        //手指触摸事件
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        //手指移动事件
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        //手指触摸结束事件
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCancel, this);

        EventManager.Remove("AllergenAttack", this);
        EventManager.Remove("ExitStory", this);
    },

    update: function (dt) {
        if (this.autoGame) {
            this.autoTime += dt;
            if (`${enterAutoTime - parseInt(this.autoTime)}s后进入托管` !== this.autoTimeLb.string) {
                this.autoTimeLb.string = `${enterAutoTime - parseInt(this.autoTime)}s后进入托管`;
            }
            if (this.autoTime >= enterAutoTime) {
                this.autoGame = false;
                this.autoTimeLb.node.active = false;

                this.isAutoAttack = true;
                this.autoLb.string = this.isAutoAttack ? `自动中` : `自动`;
                this.autoOper();
            }
        }

        if (this.isAutoAttack) {
            if (!this.changeProgressBar.node.active)
                this.changeProgressBar.node.active = true;
            this.autoAniTime += dt
            this.changeProgressBar.progress = (enterAutoTime - this.autoAniTime) / enterAutoTime;
            if (this.autoAniTime >= enterAutoTime) {
                this.autoAniTime = 0;
            }
        } else {
            if (this.changeProgressBar.node.active) {
                this.changeProgressBar.node.active = false;
                this.autoAniTime = 0;
            }
        }
    },

    init() {
        this.initNodePool();
        this.plotScale = 1.5;   //剧情比例(1.5~2.5)
        this.plotBg.setScale(this.plotScale);
        this.mediumGoldAni = [];

        this.plotBgSizeX = imgSizeX * this.plotScale / 2 - 640 / 2;
        this.plotBgSizeY = imgSizeY * this.plotScale / 2 - cc.winSize.height / 2;
    },

    initData: function () {
        this.unscheduleAllCallbacks();
        this.monsterCount = 10;     //过敏源数量
        this.germList = [];
        this.boxList = [];
        this.germNode.removeAllChildren();
        this.boxNode.removeAllChildren();
        for (let i = 0; i < this.monsterCount; ++i) {
            this.scheduleOnce(() => this.initCell(i), i * 0.05);
        }
        this.autoGame = true;
        this.autoAniTime = 0;
        this.autoTime = 0;
        this.autoTimeLb.node.active = true;
        this.autoTimeLb.string = `${enterAutoTime}s后进入托管`;
        this.isAutoAttack = false;
        this.plotBg.setPosition(0, 0);
        this.targetPos = cc.v2(320, 568);
        this.beginPos = cc.v2(320, 568);

        this.curAllergen = -1;
        this.germNum.string = `x${5 - (this.curAllergen + 1)}`;
        this.allergenList = [];
        for (let i = 0; i < 5; ++i) {
            this.allergenList[i] = -1;
        }

        this.attackIndex = -1;
        this.isAttack = false;

        this.clickMask.active = false;

        for (let i = 0; i < 3; ++i) {
            this.multiGoldAni[i].active = false;
        }
    },

    //初始化对象池
    initNodePool: function () {
        let self = this;
        //怪对象池
        this.germPool = new cc.NodePool();
        for (let i = 0; i < 10; ++i) {
            ResourceManager.instance.createPrefab("shanshuhuafenguominyuan2", function (node) {
                self.germPool.put(node);
            })
        }

        //盒子对象池
        this.boxPool = new cc.NodePool();
        for (let i = 0; i < 10; ++i) {
            this.boxPool.put(cc.instantiate(this.boxPfb));
        }
    },

    //回收怪物
    onGermKill: function (curGerm) {
        curGerm.active = true;
        this.germPool.put(curGerm);
    },

    //回收box
    onBoxKill: function (curBox) {
        curBox.active = true;
        this.boxPool.put(curBox);
    },

    plotBtnClick: function (event) {
        let btnNode = event.target;
        if (btnNode.name === "plotItem1") {
            if (this.endTime - this.startTime < 150) {
                AudioManager.instance.playotherAudio(`gun`);
                this.shakeEffect(0.2);
                this.shotZoom();
                for (let i = this.boxList.length - 1; i >= 0; --i) {
                    if (this.boxList[i] == null) {
                        continue;
                    }
                    if (!this.isAttack && this.boxList[i].getBoundingBoxToWorld().contains(this.shot.convertToWorldSpaceAR(cc.v2(0, 0)))) {
                        if (this.getAttackSucceed(i)) {
                            // wx.vibrateShort();
                            this.isAttack = true;
                            this.curAllergen++;
                            this.allergenList[this.curAllergen] = i;
                            net.AllergenAttackReq(this.curAllergen);
                            return;
                        } else {
                            continue;
                        }
                    }
                }
            }
        } else if (btnNode.name === "autoBtn") {
            this.isAutoAttack = !this.isAutoAttack;
            this.autoLb.string = this.isAutoAttack ? `自动中` : `自动`;
            this.autoOper();
        } else if (btnNode.name === "tipBtn") {
            this.tipNode.active = !this.tipNode.active;
            if (this.tipNode.active)
                this.tipMask.active = true;
        } else if (btnNode.name === "tipMask") {
            this.tipMask.active = false;
            this.tipNode.active = false;
        }
    },

    getAttackSucceed: function (curGermIndex) {
        let isSucceed = true;
        for (let i = 0; i < this.allergenList.length; ++i) {
            if (this.allergenList[i] == curGermIndex) {
                isSucceed = false;
                break;
            }
        }
        return isSucceed;
    },

    autoOper: function () {
        if (this.isAutoAttack && !this.autoAttackGrem) {
            this.autoGame = false;
            this.autoTimeLb.node.active = false;
            this.autoAttackGrem = function () {
                if (this.germList.length > 0 && this.curAllergen + 1 < 5) {
                    let curIndex = this.getGermIndex();
                    let curGermPos = cc.v2(0, 0);
                    curGermPos = cc.v2(this.germList[curIndex].position.x + curGermPos.x, this.germList[curIndex].position.y + curGermPos.y);
                    this.plotBg.runAction(cc.sequence(
                        cc.moveTo(2, cc.v2(-curGermPos.x * this.plotScale, -curGermPos.y * this.plotScale - 10 * this.plotScale)),
                        cc.delayTime(0.2),
                        cc.callFunc(() => {
                            AudioManager.instance.playotherAudio(`gun`);
                            this.germPosNode.setPosition(curGermPos);
                            this.shakeEffect(0.2);
                            this.shotZoom();
                            this.isAttack = true;
                            this.curAllergen++;
                            this.allergenList[this.curAllergen] = curIndex;
                            net.AllergenAttackReq(this.curAllergen);
                        })
                    ));
                } else {
                    this.unschedule(this.autoAttackGrem);
                    this.autoAttackGrem = null;
                }
            }
            this.schedule(this.autoAttackGrem, autoAttackTime);
        } else {
            this.unschedule(this.autoAttackGrem);
            this.autoAttackGrem = null;

            this.autoTime = 0;
            this.autoGame = true;
            this.autoTimeLb.node.active = true;
            this.autoTimeLb.string = `${enterAutoTime}s后进入托管`;
        }
    },

    //退出剧情
    exitPlot: function () {
        this.unschedule(this.autoAttackGrem);
        this.autoAttackGrem = null;

        this.scheduleOnce(function () {
            for (let i = 0; i < this.germList.length; ++i) {
                if (this.germList[i] != null) {
                    this.germList[i].active = false;
                    this.onGermKill(this.germList[i]);
                    this.germList[i] = null;

                    this.boxList[i].active = false;
                    this.onBoxKill(this.boxList[i]);
                    this.boxList[i] = null;
                }
            }

            this.node.parent.active = false;
        }, 1);
    },

    plotSliderEvent: function (slider) {
        let tempVal = slider.progress.toFixed(1) * 10 + 15;
        if (this.plotScale * 10 != tempVal) {
            this.plotScale = tempVal / 10;
            this.plotBg.setScale(this.plotScale);
            this.plotBgSizeX = imgSizeX * this.plotScale / 2 - 640 / 2;
            this.plotBgSizeY = imgSizeY * this.plotScale / 2 - cc.winSize.height / 2;

            this.setPlotBgPos();
        }
    },

    onTouchStart: function (event) {
        this.autoGame = false;
        this.autoTimeLb.node.active = false;
        this.changeProgressBar.node.active = false;
        this.unschedule(this.autoAttackGrem);
        this.autoAttackGrem = null;
        this.beginPos = event.getLocation();
        this.startTime = (new Date()).getTime();
    },

    onTouchMove: function (event) {
        this.targetPos = event.getLocation();
        this.setPlotBgPos();
        this.beginPos = this.targetPos;
    },

    onTouchCancel: function (event) {
        this.autoTime = 0;
        this.autoGame = true;
        this.endTime = (new Date()).getTime();
        this.autoTimeLb.node.active = true;
        this.autoTimeLb.string = `${enterAutoTime}s后进入托管`;
        this.isAutoAttack = false;
        this.autoLb.string = this.isAutoAttack ? `自动中` : `自动`;
    },

    setPlotBgPos: function () {
        this.tempPos = cc.v2(this.targetPos.x - this.beginPos.x, this.targetPos.y - this.beginPos.y);
        this.plotBg.setPosition(this.plotBg.x + this.tempPos.x, this.plotBg.y + this.tempPos.y);
        if (this.plotBg.position.x > this.plotBgSizeX)
            this.plotBg.x = this.plotBgSizeX;
        if (this.plotBg.position.x < -this.plotBgSizeX)
            this.plotBg.x = -this.plotBgSizeX;
        if (this.plotBg.position.y > this.plotBgSizeY)
            this.plotBg.y = this.plotBgSizeY;
        if (this.plotBg.position.y < -this.plotBgSizeY)
            this.plotBg.y = -this.plotBgSizeY;
    },

    initCell: function (germIndex) {
        let self = this;
        let germ = null;
        if (this.germPool.size() > 0) {
            germ = this.germPool.get();
            self.addCell(germ, germIndex);
        } else {
            ResourceManager.instance.createPrefab(`shanshuhuafenguominyuan2`, function (node) {
                germ = node;
                self.addCell(germ, germIndex);
            });
        }
    },

    addCell: function (germ, germIndex) {
        this.germNode.addChild(germ);
        this.germPosX = util.random(0, 450) - 225;
        this.germPosY = util.random(0, 450) - 225;
        germ.setScale(0.2);
        germ.setPosition(this.germPosX, this.germPosY);
        germ.getComponent("BaseRole").changeState(EnumDefine.RoleState.IDLE);
        this.germList.push(germ);
        let tempBoxPfb = this.boxPool.size() > 0 ? this.boxPool.get() : cc.instantiate(this.boxPfb);
        this.boxNode.addChild(tempBoxPfb);
        tempBoxPfb.setPosition(this.germPosX, this.germPosY + 30);
        // tempBoxPfb.getChildByName("num").getComponent(cc.Label).string = germIndex;
        this.boxList.push(tempBoxPfb);
    },

    //随机攻击细菌
    getGermIndex: function () {
        let tempRandom = 0;
        do {
            tempRandom = util.random(0, this.germList.length - 1);
        } while (this.allergenList.indexOf(tempRandom) > -1)
        return tempRandom;
    },

    //击杀细菌
    killGerm: function (germIndex) {
        this.germList[germIndex].getComponent("BaseRole").changeState(EnumDefine.RoleState.DEAD);
        this.germList[germIndex].runAction(cc.sequence(
            cc.delayTime(25 / 30),
            cc.callFunc(() => {
                this.germList[germIndex].active = false;
                this.onGermKill(this.germList[germIndex]);
                this.germList[germIndex] = null;

                this.boxList[germIndex].active = false;
                this.onBoxKill(this.boxList[germIndex]);
                this.boxList[germIndex] = null;
            })
        ));
    },

    //镜头放缩
    shotZoom: function () {
        this.shotFlag.active = true;
        for (let i = 0; i < 4; ++i) {
            this.shotFlagList[i].runAction(cc.sequence(
                cc.moveTo(0.1, zoomEndPos[i]),
                cc.moveTo(0.1, zoomBeginPos[i]),
            ))
        }
        this.scheduleOnce(() => this.shotFlag.active = false, 0.25);

        this.plotBg.runAction(cc.sequence(
            cc.scaleTo(0.04, this.plotScale + 0.3),
            cc.scaleTo(0.1, this.plotScale),
        ))

        this.plotBg.runAction(cc.sequence(
            cc.moveBy(0.04, cc.v2(0, 8)),
            cc.moveBy(0.1, cc.v2(0, -8)),
        ))

        this.shot.runAction(cc.sequence(
            cc.moveBy(0.04, cc.v2(0, 30)),
            cc.moveBy(0.1, cc.v2(0, -30)),
        ))

        this.plotMask.runAction(cc.sequence(
            cc.moveBy(0.04, cc.v2(0, 30)),
            cc.moveBy(0.1, cc.v2(0, -30)),
        ))
    },

    // 震屏效果
    // 参数：duration 震屏时间
    shakeEffect: function (duration) {
        this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(0.02, cc.v2(5, 7)),
                    cc.moveTo(0.02, cc.v2(-6, 7)),
                    cc.moveTo(0.02, cc.v2(-13, 3)),
                    cc.moveTo(0.02, cc.v2(3, -6)),
                    cc.moveTo(0.02, cc.v2(-5, 5)),
                    cc.moveTo(0.02, cc.v2(2, -8)),
                    cc.moveTo(0.02, cc.v2(-8, -10)),
                    cc.moveTo(0.02, cc.v2(3, 10)),
                    cc.moveTo(0.02, cc.v2(0, 0))
                )
            )
        );

        setTimeout(() => {
            this.node.stopAllActions();
            this.node.setPosition(0, 0);
        }, duration * 1000);
    },

    //多杀
    multikill: function (killCount, firstGold) {
        if (killCount > 1 && killCount < 5 || killCount == 1 && firstGold > 0) {
            AudioManager.instance.playotherAudio(`${killCount}kill`);
            this.multiKillAni[killCount].node.active = true;
            this.multiKillAni[killCount].play();
        } else if (killCount == 5) {
            AudioManager.instance.playotherAudio(`5kill`);
            this.multiKillAni[5].node.active = true;
            this.multiKillAni[5].play();
        }
    },

    //播放中等金币特效
    playMediumGoldEffect: function (goldType) {
        for (let i = 0; i < 3; ++i) {
            this.multiGoldAni[i].active = false;
        }
        this.multiGoldAni[goldType - 1].active = true;
        this.multiGoldAni[goldType - 1].getChildByName("jinbi").getComponent(cc.ParticleSystem).resetSystem();
    },

    addGoldScore: function (goldTipLb) {
        if (!this.goldLb) {
            this.goldLb = cc.instantiate(this.goldScoreLb);
            this.piaofenNode.addChild(this.goldLb);
        }
        this.goldLb.y = 0;
        this.goldLb.opacity = 255;
        this.goldLb.getComponent(cc.Label).string = `+${goldTipLb}`;

        this.goldLb.runAction(cc.sequence(
            cc.scaleTo(0.15, 2.5),
            cc.scaleTo(0.15, 0.8),
            cc.scaleTo(0.1, 1.2),
            cc.scaleTo(0.1, 1),
            cc.moveBy(0.5, cc.v2(0, 60)),
            cc.fadeOut(0.2)));
    },

    //播放大金币特效
    playBigGoldEffect: function (cardDelta) {
        AudioManager.instance.playotherAudio(`gold4`);
        if (this.bigGoldAni1 == null) {
            let self = this;

            this.scheduleOnce(() => {
                ResourceManager.instance.createPrefab("ef_pendajinbi02", function (node) {
                    self.bigGoldAni2 = node;
                    node.y = -370;
                    self.multiKillNode.addChild(self.bigGoldAni2);
                    self.bigGoldAni2.zIndex = 1;
                })
                this.goldRoll(cardDelta);
            }, 0.3);

            ResourceManager.instance.createPrefab("ef_pendajinbi01", function (node) {
                self.bigGoldAni1 = node;
                node.y = -370;
                self.multiKillNode.addChild(self.bigGoldAni1);
                self.bigGoldAni1.zIndex = 2;
            })
            return;
        }

        this.scheduleOnce(() => {
            this.bigGoldAni2.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
            this.bigGoldAni2.getChildByName("jibi2").getComponent(cc.ParticleSystem).resetSystem();
            this.goldRoll(cardDelta);
        }, 0.3);

        this.bigGoldAni1.getComponent(cc.Animation).play();
    },

    //大金币滚动叠加
    goldRoll: function (cardDelta) {
        let goldRollLb = this.bigGoldAni1.getChildByName("ui").getChildByName("bigLb").getComponent(cc.Label);
        this.bigGoldAni1.getChildByName("ui").getChildByName("jiesuan").active = true;
        let repeat = 48;
        let count = 0;
        this.schedule(() => {
            count++;
            goldRollLb.string = `+${parseInt(cardDelta / repeat) * count}`;
            if (count === repeat) {
                goldRollLb.string = `+${cardDelta}`;
                this.scheduleOnce(function () {
                    this.exitPlot();
                    EventManager.Dispatch("QuitStory");
                }, 3);
            }
        }, 0.01, repeat - 1, 0.01);

        let self = this;
        this.scheduleOnce(function () {
            if (!self.baojinbiAni) {
                ResourceManager.instance.createPrefab("ef_baojinbidi_01", function (node) {
                    self.baojinbiAni = node;
                    self.piaofenNode.addChild(self.baojinbiAni);
                    self.baojinbiAni.y = -cc.winSize.height / 2 - 62 - 30;
                    self.baojinbiAni.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
                })
            } else {
                self.baojinbiAni.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
            }
        }, 1);
    },

});
