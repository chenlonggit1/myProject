const ResourceManager = require('ResourceManager');
var util = require("util");

const stoneNum = 4;
const shovelNum = 3;
cc.Class({
    extends: cc.Component,

    properties: {
        goldScoreLb: cc.Prefab, //金币奖励
    },

    onLoad() {
        this.shovelNode = this.node.getChildByName("shovelSp");
        this.piaofenNode = this.node.getChildByName("piaofen");
        this.burrow = [];
        this.sign = [];
        this.stoneItem = [];
        for (let i = 0; i < stoneNum; ++i) {
            this.stoneItem[i] = this.node.getChildByName(`stone${i}`);
            this.burrow[i] = this.stoneItem[i].getChildByName(`burrow`);
            this.sign[i] = this.stoneItem[i].getChildByName(`sign`);
        }

        this.shovelList = [];
        for (let i = 0; i < shovelNum; ++i) {
            this.shovelList[i] = this.node.getChildByName("shovelNode").getChildByName(`shovel${i}`);
        }

        this.moveTime = 0; //移动时间
        this.moveCloudNode = this.node.getChildByName("cloudNode");
    },

    update(dt) {
        this.moveTime += dt;
        if (this.moveTime >= 0.1) {
            this.moveTime = 0;
            this.moveCloudNode.runAction(cc.moveBy(0.1, cc.v2(-1, 0)));
        }
        if (this.moveCloudNode.x < -700) {
            this.moveCloudNode.setPosition(450, 0);
        }
    },

    initStone() {
        this.playSignAni();

        this.stoneClickNum = 0;
        this.stoneList = [];
        for (let i = 0; i < stoneNum; ++i) {
            this.stoneList[i] = false;
            this.sign[i].active = true;
            this.burrow[i].active = false;
        }
        for (let i = 0; i < shovelNum; ++i) {
            this.shovelList[i].active = true;
        }
    },

    stoneClick: function (event) {
        for (let i = 0; i < stoneNum; ++i) {
            if (event.target.name === `stone${i}`) {
                if (!this.stoneList[i] && this.stoneClickNum < stoneNum - 1) {
                    this.stoneClickNum++;
                    this.stoneList[i] = true;
                    this.playStoneAni(i);
                    return;
                }
            }
        }
    },

    playSignAni: function () {
        this.signCallBack = () => {
            for (let i = 0; i < stoneNum; ++i) {
                this.sign[i].runAction(cc.sequence(
                    cc.scaleTo(0.3, 1.2),
                    cc.delayTime(i * 0.05),
                    cc.scaleTo(0.3, 0.8),
                    cc.delayTime(i * 0.05),
                ))
            }
        }
        this.schedule(this.signCallBack, 1);
    },

    playStoneAni: function (stoneIndex) {
        this.shovelNode.active = true;
        this.burrow[stoneIndex].active = true;
        this.sign[stoneIndex].active = false;
        this.shovelNode.setPosition(this.stoneItem[stoneIndex].getPosition());
        this.shovelNode.runAction(cc.sequence(
            cc.delayTime(40 / 30),
            cc.callFunc(() => {
                this.shovelNode.active = false;

                this.playMediumGoldEffect(this.stoneItem[stoneIndex]);
                this.scheduleOnce(() => this.addGoldScore(this.stoneItem[stoneIndex], 2000), 0.1);
                this.shovelList[shovelNum - this.stoneClickNum].active = false;
                if (this.stoneClickNum === shovelNum) {
                    this.scheduleOnce(() => this.playBigGoldEffect(10000), 3);
                }
            })
        ))
    },

    //播放中等金币特效
    playMediumGoldEffect: function (mediumGoldNode, callback) {
        this.showMediumGoldEffect = function (node) {
            let piaofen = util.getDistance(mediumGoldNode, this.piaofenNode);
            node.setPosition(piaofen);
            node.y -= 60;
            node.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
            if (callback != null) {
                callback(node);
            }
        }
        if (!this.piaofenAni) {
            let self = this;
            ResourceManager.instance.createPrefab("ef_baojinbi_02", function (node) {
                self.piaofenAni = node;
                self.piaofenNode.addChild(node);
                self.showMediumGoldEffect(self.piaofenAni);
            })
        } else {
            this.showMediumGoldEffect(this.piaofenAni);
        }
    },

    addGoldScore: function (mediumGoldNode, goldTipLb) {
        if (!this.goldLb) {
            this.goldLb = cc.instantiate(this.goldScoreLb);
            this.piaofenNode.addChild(this.goldLb);
        }
        let piaofen = util.getDistance(mediumGoldNode, this.piaofenNode);
        this.goldLb.setPosition(piaofen);
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
        if (this.bigGoldAni1 == null) {
            let self = this;

            this.scheduleOnce(() => {
                ResourceManager.instance.createPrefab("ef_pendajinbi02", function (node) {
                    self.bigGoldAni2 = node;
                    self.piaofenNode.addChild(self.bigGoldAni2);
                    self.bigGoldAni2.zIndex = 1;
                })
                this.goldRoll(cardDelta);
            }, 0.3);

            ResourceManager.instance.createPrefab("ef_pendajinbi01", function (node) {
                self.bigGoldAni1 = node;
                self.piaofenNode.addChild(self.bigGoldAni1);
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
                this.scheduleOnce(() => {
                    this.unscheduleAllCallbacks();
                    this.node.active = false;
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
