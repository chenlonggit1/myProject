var net = require("net");
var util = require("util");
var EnumDefine = require("EnumDefine");
var GameConfig = require("GameConfig");
var DataManager = require("DataManager");
var EventManager = require('EventManager');
var AudioManager = require("AudioManager");
var ResourceManager = require('ResourceManager');

const LONG_PRESS_ATTACK_GERM_TIME = 0.2; //长按攻击细菌时间
const GERM_ESCAPE_ASSET_NAME = "Effect_guaitaopao"; //怪物逃跑特效资源
const cardEffectCount = 6; //卡牌特效 开牌两个、受击两个、消失一个
const boxCount = 5; //宝箱四个
const CLICK_CARD_INTERVAL = 0.05; //点击间隔

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function () {
        this.touchItemTime = 0; //长按卡牌时间
        this.cardChangeTime = 0; //卡牌倒计时
        this.cardUpdateTime = 10; //卡牌刷新时间
        this.isTouchItem = false; //手指是否触摸到卡牌
        this.openPlot = false;

        this.cardButton = this.node.getComponent(cc.Button);
        this.cardBgSprite = this.node.getComponent(cc.Sprite); //卡牌背景
        this.jokerStatusCardBgSprite = this.node.getChildByName("jokerStatusCardBg").getComponent(cc.Sprite); //卡牌背景
        this.cardOpenBg = this.node.getChildByName("cardBg"); //开牌打开背景
        this.chest = this.node.getChildByName("chest"); //箱子
        this.cardEffectNode = this.node.getChildByName("effect"); //卡牌特效节点
        this.germCard = this.node.getChildByName("germNode"); //细菌图片
        this.germCardDown = this.node.getChildByName("germNodeDown");
        this.germCardUp = this.node.getChildByName("germNodeUp");
        this.timeBg = this.node.getChildByName("xb_zjm_kkk").getComponent(cc.ProgressBar);
        this.germTimeBg = this.node.getChildByName("xb_zjm_kkk").getComponent(cc.Sprite);
        this.bossBg = this.node.getChildByName("xb_zjm_kkk4");
        this.lock = this.node.getChildByName("lock"); //锁定

        this.effectListNode = [];
        for (let i = 0; i < cardEffectCount; ++i) {
            this.effectListNode[i] = this.cardEffectNode.getChildByName(`effect_${i}`).getComponent(cc.Animation);
        }

        this.boxListNode = [];
        for (let i = 0; i < boxCount; ++i) {
            this.boxListNode[i] = this.chest.getChildByName(`box0${i + 1}`).getComponent(sp.Skeleton);
        }

        this.boxEffectAni = [];

        this.initEvent();
    },

    //节点隐藏时调用
    onDisable: function () {
        this.touchItemTime = 0;
        this.isTouchItem = false;
        if (DataManager.instance.curTouchCardItemIndex == this.cardIndex) {
            DataManager.instance.curTouchCardItemIndex = -1;
        }
    },

    //注册事件
    initEvent: function () {
        //卡牌点击事件
        this.node.on('click', this.cardOnClick, this);
        //卡牌点击事件
        this.node.on('cardOnClick', (event) => {
            this.cardOnClick(event);
        });
        //手指触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        //手指触摸结束事件
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancel, this);
        //手指取消触摸事件
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        //展示卡牌受击效果
        EventManager.Add("ShowCardAttackedEffect", function (event, data) {
            if (event.cardIndex == data) {
                if (event.combatManager.isCanCombat && event.isGerm) {
                    event.gameCtr.cancelCardLock();
                    event.cardVibrate();
                }
            }
        }, this);

        //刷新卡牌进度
        EventManager.Add("UpdateCardItemProgress", function (event, data) {
            if (event.cardIndex == data.Index) {
                let roleInfo = GameConfig.getMonsterInfoWithID(data.RoleID);
                if (roleInfo != null) {
                    if (roleInfo.Type == EnumDefine.GermType.JOKER) {
                        event.cardUpdateTime = roleInfo.LiveTime;
                    } else {
                        if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTO_OPEN_CARD) {
                            event.cardUpdateTime = roleInfo.Type == EnumDefine.GermType.BOSS ? roleInfo.LiveTime : 3;
                        } else {
                            event.cardUpdateTime = roleInfo.LiveTime;
                        }
                    }
                }

                event.cardChangeTime = 0;
                let germTimeBgName = "xb_zjm_kkk2";
                if (roleInfo.Type == EnumDefine.GermType.BOSS) {
                    germTimeBgName = "xb_zjm_kkk3";
                } else if (roleInfo.Type == EnumDefine.GermType.JOKER) {
                    germTimeBgName = "xb_zjm_kkk5";
                }

                ResourceManager.instance.setSpriteWithName(germTimeBgName, function (sprite) {
                    event.germTimeBg.spriteFrame = sprite;
                })

                if (roleInfo.Type == EnumDefine.GermType.BOSS) {
                    event.bossBg.active = true;
                    event.bossBg.setScale(5);
                    event.bossBg.runAction(cc.scaleTo(0.3, 1));
                }
                event.timeBg.progress = 0;
                event.timeBg.node.active = true;
            }
        }, this);

        //自动翻牌
        EventManager.Add("AutoOpenCard", function (event, data) {
            if (event.cardIndex == data) {
                event.cardOnClickHandler(false);
            }
        }, this);
    },

    //卡牌初始化
    cardItemInit(gameCtr, cardIndex, isPlayAni = false, modelType = EnumDefine.ModelType.NORMAL) {
        this.node.active = true; //节点显示
        if (isPlayAni) {
            this.node.runAction(cc.sequence(
                cc.scaleTo(0.1, 1.5),
                cc.scaleTo(0.1, 0.7),
                cc.scaleTo(0.1, 1.2),
                cc.scaleTo(0.1, 1),
            ));
        }

        this.gameCtr = gameCtr;
        this.cardIndex = cardIndex; //卡牌编号
        this.combatManager = this.gameCtr.conbatManagerJs;

        this.initData(modelType);
    },

    initData(modelType) {
        this.isBoxAniFinish = false; //宝箱动画进行中
        this.isGoldAniFinish = false; //金币动画进行中
        this.isBoxOpen = false; //盒子是否打开
        this.isGerm = false; //是否细菌
        this.isOpenCard = false; //是否翻牌
        this.timeBg.progress = 0;
        this.timeBg.node.active = false;
        if (modelType == EnumDefine.ModelType.JOKER) {
            this.isJokerBox = true;
            this.cardBgSprite.enabled = false;
            this.jokerStatusCardBgSprite.enabled = true;
        } else {
            this.isJokerBox = false;
            this.cardBgSprite.enabled = true;
            this.jokerStatusCardBgSprite.enabled = false;
        }

        this.cardOpenBg.active = false; //隐藏卡牌打开背景
        this.germCard.active = false;
        this.isBoss = false;
        this.cardEffectNode.active = false; //隐藏特效
        this.lock.active = false;
        this.bossBg.active = false;
        this.chest.active = false; //隐藏箱子
        this.cardDelta = 0;
        this.Ratio = 0;

        this.hideBox();
        this.hideEffect();
    },

    onTouchStart: function () {
        //刷新场景中
        if (DataManager.instance.isRefreshScene) {
            return;
        }
        if (DataManager.instance.curTouchCardItemIndex >= 0) {
            return;
        }

        this.isTouchItem = true;
        this.touchItemTime = 0;
        DataManager.instance.curTouchCardItemIndex = this.cardIndex;
    },

    onTouchCancel: function () {
        if (DataManager.instance.curTouchCardItemIndex == this.cardIndex) {
            DataManager.instance.curTouchCardItemIndex = -1;
        }
        this.isTouchItem = false;
        this.touchItemTime = 0;
    },

    //移除事件
    removeEvent: function () {
        //手指触摸事件
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        //手指触摸结束事件
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchCancel, this);
        //手指取消触摸事件
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        EventManager.Remove("ShowCardAttackedEffect", this);
        EventManager.Remove("UpdateCardItemProgress", this);
        EventManager.Remove("AutoOpenCard", this);
    },

    update: function (dt) {
        //怪物出现时间倒计时
        if (this.timeBg.node.active) {
            this.cardChangeTime += dt;
            this.timeBg.progress = (this.cardUpdateTime - this.cardChangeTime) / this.cardUpdateTime;
            if (this.cardChangeTime >= this.cardUpdateTime) {
                this.cardChangeTime = 0;
                this.timeBg.progress = 0;
                this.timeBg.node.active = false;

                let entity_id = DataManager.instance.getCardEntityIDWithIndex(this.cardIndex);
                if (entity_id > 0) {
                    net.KillEntityReq(entity_id);
                    this.playGermEscapeEffect();
                }
            }
        }

        //长按攻击怪物
        if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.CLICK_INTERVAL ||
            DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTO_OPEN_CARD) {
            if (this.isTouchItem && this.isGerm) {
                this.touchItemTime += dt;
                if (this.touchItemTime >= LONG_PRESS_ATTACK_GERM_TIME) {
                    this.touchItemTime -= LONG_PRESS_ATTACK_GERM_TIME;
                    let entity_id = DataManager.instance.getCardEntityIDWithIndex(this.cardIndex);
                    if (entity_id > 0) {
                        let myMoney = DataManager.instance.getClientMoney();
                        let betVal = GameConfig.meetingMultipleRate[DataManager.instance.multipleIndex] * this.combatManager.getMaxBetMultiply();
                        if (myMoney >= betVal) {
                            EventManager.Dispatch("startAttackGerm", entity_id);
                            // if (this.gameCtr.tipText.active)
                            //     this.gameCtr.tipText.active = false;
                        }
                    }
                }
            }
        }
    },

    setCardBtnEnabled: function (isEnabled) {
        this.cardButton.enabled = isEnabled;
    },

    //卡牌点击
    cardOnClick(event) {
        //已经触摸了别的卡牌节点
        if (DataManager.instance.curTouchCardItemIndex >= 0) {
            return;
        }

        //处于小丑剧情模式，点击无效
        if (DataManager.instance.isJokerFreeStatus) {
            return;
        }

        this.cardOnClickHandler(true);
    },

    cardOnClickHandler: function (bForceClickCard) {
        //刷新场景中
        if (DataManager.instance.isRefreshScene) {
            return;
        }

        if (this.isOpenCard && this.isBoxAniFinish) {
            //手动打开宝箱
            this.openBox();
            return;
        }

        let myMoney = DataManager.instance.getClientMoney();
        let betVal = GameConfig.meetingMultipleRate[DataManager.instance.multipleIndex] * this.combatManager.getMaxBetMultiply();
        if (myMoney >= betVal) {
            if (this.isOpenCard) {
                if (this.isGerm) {
                    let entity_id = DataManager.instance.getCardEntityIDWithIndex(this.cardIndex);
                    if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC ||
                        DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.ATTACK_CLICK_CARD) {
                        if (entity_id > 0) {
                            if (bForceClickCard) {
                                if (DataManager.instance.isCanAttackGerm == false) {
                                    return;
                                }

                                DataManager.instance.isCanAttackGerm = false;
                                this.scheduleOnce(function () {
                                    DataManager.instance.isCanAttackGerm = true;
                                }, CLICK_CARD_INTERVAL)

                                if (DataManager.instance.curAttackedGerm != entity_id) {
                                    DataManager.instance.curAttackedGerm = entity_id;
                                }
                                EventManager.Dispatch("startAttackGerm", entity_id)
                                EventManager.Dispatch("ForceClearAutoAttackTime")
                            } else {
                                DataManager.instance.curAttackedGerm = entity_id;
                            }
                        }
                    } else {
                        if (DataManager.instance.isCanAttackGerm == false) {
                            return;
                        }

                        DataManager.instance.isCanAttackGerm = false;
                        this.scheduleOnce(function () {
                            DataManager.instance.isCanAttackGerm = true;
                        }, CLICK_CARD_INTERVAL)

                        if (entity_id > 0) {
                            EventManager.Dispatch("startAttackGerm", entity_id)
                        }
                    }
                } else {
                    this.isOpenCard = false;
                    return;
                }
            } else {
                this.setCardBtnEnabled(false);
                this.isOpenCard = true;
                net.OpenOneCardReq(this.cardIndex, this.combatManager.getMaxBetMultiply(), GameConfig.meetingMultipleRate[DataManager.instance.multipleIndex]);
                DataManager.instance.setClientMoney(DataManager.instance.getClientMoney() - betVal);
                EventManager.Dispatch('changeMoney');
            }
        } else {
            EventManager.Dispatch("goldLack");
        }
    },

    //卡牌回应
    openCardRsp(data) {
        if (data.ItemTypeID === EnumDefine.CardType.PLOT) {
            this.cardBgSprite.enabled = false;
            this.playOpenCardEffect();
            return;
        }

        //无效、宝箱、英雄、怪物、剧情、空道具
        //宝箱一种状态（完成）、怪物三种状态（打开、使用、完成）
        if ((data.Status === EnumDefine.CardStatus.COMPLETE && data.ItemTypeID === EnumDefine.CardType.BOX) ||
            (data.Status === EnumDefine.CardStatus.OPEN && data.ItemTypeID === EnumDefine.CardType.GERM)) {
            this.setCardBtnEnabled(true);
            //播放翻牌特效
            this.cardBgSprite.enabled = false;
            AudioManager.instance.playotherAudio("card");
            if (data.ItemTypeID === EnumDefine.CardType.BOX) {
                this.isBoxAniFinish = true;
                this.operIndex = data.ItemID - 100;
                this.chest.active = true;
                this.boxListNode[this.operIndex].node.active = true;
                this.boxListNode[this.operIndex].setAnimation(0, "stand01", false);
                this.playBoxEffect(1);

                //宝箱五秒不操作自动打开
                this.node.runAction(cc.sequence(
                    cc.delayTime(5),
                    cc.callFunc(function () {
                        this.openBox()
                    }.bind(this))
                ));
            } else if (data.ItemTypeID === EnumDefine.CardType.GERM) {
                this.playOpenCardEffect();
                this.isGerm = true;
                net.UseOneCardReq(this.cardIndex);
                let openCardCallBack = () => {
                    let self = this;
                    ResourceManager.instance.setSpriteWithName(`xb_fp_g${data.ItemID}`, function (sprite) {
                        self.germCard.getComponent(cc.Sprite).spriteFrame = sprite;
                    })

                    let monsterInfo = GameConfig.getMonsterInfoWithID(data.ItemID);
                    if (monsterInfo.Type == EnumDefine.GermType.BOSS) {
                        this.isBoss = true;
                    }

                    if (monsterInfo.Type == EnumDefine.GermType.JOKER) {
                        this.germCard.setPosition(0, 0.5);
                        this.timeBg.node.setParent(this.germCardDown)
                    } else {
                        this.germCard.setPosition(0, -4.5)
                        this.timeBg.node.setParent(this.germCardUp)
                    }

                    this.cardOpenBg.active = true;
                    this.germCard.active = true;
                };
                this.scheduleOnce(openCardCallBack, 0.3);
            }
        } else if (data.Status === EnumDefine.CardStatus.COMPLETE && data.ItemTypeID === EnumDefine.CardType.GERM) {
            if (this.cardDelta > 0) {
                this.germHide();
                this.addGameGold();
            } else {
                this.scheduleOnce(() => EventManager.Dispatch('updateOneCard', this.cardIndex), 0.5);
            }
        } else if (data.Status === EnumDefine.CardStatus.COMPLETE && data.ItemTypeID === EnumDefine.CardType.EMPTY_PROPS) {
            this.germHide();
            this.scheduleOnce(() => EventManager.Dispatch('updateOneCard', this.cardIndex), 0.5);
        }
    },

    //更新金币
    updateGold: function (data) {
        this.Ratio = parseInt(data.Ratio);
        this.cardDelta = parseInt(data.Delta);
    },

    //打开宝箱
    openBox: function () {
        if (!this.isBoxOpen) {
            this.isBoxOpen = true;
            this.setCardBtnEnabled(false);

            if (this.boxListNode[this.operIndex].node.active) {
                this.boxListNode[this.operIndex].setAnimation(0, "stand02", false);
            }

            if (!this.isJokerBox) {
                this.scheduleOnce(() => {
                    this.playBoxEffect(2);
                    this.playBoxEffect(3);

                    if (this.cardDelta > 0) {
                        this.addGameGold();
                    }
                }, 0.4)
            } else {
                if (this.cardDelta > 0) {
                    this.addGameGold();
                }
            }
        }
    },

    //播放宝箱特效
    playBoxEffect: function (boxStatus) {
        if (this.boxEffectAni[boxStatus] == null) {
            let self = this;
            ResourceManager.instance.createPrefab(`ef_baoxian_0${boxStatus}`, function (node) {
                self.boxEffectAni[boxStatus] = node.getComponent(cc.Animation);
                self.boxEffectAni[boxStatus].node.setParent(self.boxListNode[self.operIndex].node);
                self.boxEffectAni[boxStatus].resume();
                self.boxEffectAni[boxStatus].play();
                self.boxEffectAni[boxStatus].node.active = true;
            })
        } else {
            if (boxStatus == 2) {
                this.boxEffectAni[1].node.active = false;
            }

            this.boxEffectAni[boxStatus].node.setParent(this.boxListNode[this.operIndex].node);
            this.boxEffectAni[boxStatus].resume();
            this.boxEffectAni[boxStatus].play();
            this.boxEffectAni[boxStatus].node.active = true;
        }
    },

    //播放打开卡牌特效
    playOpenCardEffect: function () {
        this.cardEffectNode.active = true;
        this.hideEffect();
        this.effectListNode[0].node.active = true;
        this.effectListNode[0].play();

        this.effectListNode[1].node.active = true;
        this.effectListNode[1].play();
        this.scheduleOnce(() => this.cardEffectNode.active = false, 0.4);
    },

    //播放受击特效
    playShoujiEffect: function () {
        this.cardEffectNode.active = true;
        this.hideEffect();
        this.effectListNode[2].node.active = true;
        this.effectListNode[2].play();
        this.effectListNode[3].node.active = true;
        this.effectListNode[3].play();
    },

    //播放卡牌消失特效
    playXiaoshiEffect: function () {
        this.cardEffectNode.active = true;
        this.hideEffect();
        this.effectListNode[4].node.active = true;
        this.effectListNode[4].play();
    },

    //播放怪物逃跑的特效
    playGermEscapeEffect: function () {
        this.cardEffectNode.active = true;
        this.hideEffect();
        this.hideNode();

        this.showGermEscapeEffect = function () {
            this.germEscapeEffect.resume(GERM_ESCAPE_ASSET_NAME);
            this.germEscapeEffect.play(GERM_ESCAPE_ASSET_NAME);
            this.germEscapeEffect.node.active = true;
            this.scheduleOnce(() => this.germEscapeEffect.node.active = false, 0.3);
        }

        if (this.germEscapeEffect == null) {
            let self = this;
            ResourceManager.instance.createPrefab(GERM_ESCAPE_ASSET_NAME, function (node) {
                self.germEscapeEffect = node.getComponent(cc.Animation);
                self.germEscapeEffect.node.setParent(self.node);
                self.germEscapeEffect.node.setPosition(0, 0);
                self.showGermEscapeEffect();
            })
        } else {
            this.showGermEscapeEffect();
        }
    },

    //小丑模式播放打开卡牌特效
    playOpenCardEffectInJokerStatus: function (callback) {
        this.setCardBtnEnabled(true);
        this.cardBgSprite.enabled = false;
        this.jokerStatusCardBgSprite.enabled = false;
        AudioManager.instance.playotherAudio("card");

        this.cardEffectNode.active = true;
        this.hideEffect();
        this.effectListNode[5].node.active = true;

        this.effectListNode[5].play();

        this.effectListNode[1].node.active = true;
        this.effectListNode[1].play();
        this.scheduleOnce(function () {
            this.cardEffectNode.active = false
            if (callback) {
                callback();
            }
        }.bind(this), 0.3);
    },

    //隐藏特效
    hideEffect: function () {
        for (let i = 0; i < cardEffectCount; ++i) {
            if (this.effectListNode[i].node.active) {
                this.effectListNode[i].node.active = false;
            }
        }
    },

    //隐藏宝箱
    hideBox: function () {
        for (let i = 0; i < boxCount; ++i) {
            if (this.boxListNode[i].node.active) {
                this.boxListNode[i].node.active = false;
            }
        }
    },

    //卡牌振动
    cardVibrate: function () {
        if (!this.cardOpenBg.active) {
            return;
        }
        //锁定图标
        if (!this.lock.active) {
            if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.ATTACK_CLICK_CARD ||
                DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC) {
                this.lock.active = true;
            }
        }

        this.playShoujiEffect();
        this.moveAction = cc.sequence(
            cc.moveBy(0.04, 0, 5),
            cc.moveBy(0.06, 0, -10),
            cc.moveBy(0.04, 0, 5),
        )
        this.rotateAction = cc.sequence(
            cc.rotateTo(0.04, 5),
            cc.rotateTo(0.06, -5),
            cc.rotateTo(0.04, 0),
            cc.rotateTo(0.04, 3),
            cc.rotateTo(0.04, -3),
            cc.rotateTo(0.04, 0)
        )
        this.node.runAction(this.moveAction);
        this.node.runAction(this.rotateAction);
    },

    //怪物隐藏
    germHide: function () {
        this.playXiaoshiEffect();
        this.hideNode();
    },

    hideNode: function () {
        this.cardOpenBg.active = false;
        this.cardBgSprite.enabled = false;
        this.germCard.active = false;
        this.timeBg.node.active = false;
        this.bossBg.active = false;
        this.lock.active = false;
    },

    //取消锁定
    cancelLock: function () {
        if (this.lock.active) {
            this.lock.active = false;
        }
    },

    //添加金币飘分
    addGameGold: function () {
        let self = this;
        this.setCardBtnEnabled(false);
        this.isGoldAniFinish = true;
        if (this.isJokerBox) {
            AudioManager.instance.playotherAudio("Medium_gold_COINS");
            this.gameCtr.playJokerBoxEffect(this.node, function (baojinbiNode) {
                self.scheduleOnce(function () {
                    self.gameCtr.onJokerBoxEffectKill(baojinbiNode);
                    self.goldFinish();
                }.bind(self), 2);
            });
            this.gameCtr.jokerGoldFly(this.node, this.cardDelta);
        } else if (this.isBoss) {
            AudioManager.instance.playotherAudio("Big_gold_coin");
            this.gameCtr.playBigGoldEffect(this.cardDelta);
            this.scheduleOnce(() => {
                this.goldFinish();
                EventManager.Dispatch('updateOneCard', this.cardIndex);
            }, 3);
        } else if (!this.isGerm && this.operIndex == 2) {
            AudioManager.instance.playotherAudio("Treasure_chest_gold_COINS");
            this.gameCtr.playGoldBoxEffect(this.node, function (baojinbiNode) {
                self.scheduleOnce(function () {
                    self.gameCtr.onGoldBoxKill(baojinbiNode);
                    self.goldFinish();
                }.bind(self), 3);
            });
            this.gameCtr.addGoldScoreLb(this.node, `+${this.cardDelta}`, true);
        } else if (this.cardDelta / this.Ratio > 15) {
            AudioManager.instance.playotherAudio("Medium_gold_COINS");
            this.gameCtr.playMediumGoldEffect(this.node, function (baojinbiNode) {
                self.scheduleOnce(function () {
                    self.gameCtr.onMediumGoldKill(baojinbiNode);
                    self.goldFinish();
                }.bind(self), 2);
            });
            this.gameCtr.addGoldScoreLb(this.node, `+${this.cardDelta}`);
        } else {
            AudioManager.instance.playotherAudio("get_gold");
            this.gameCtr.playGoldEffect(self.node, function (baojinbiNode) {
                let goldList = [];
                let goldCallback = function () {
                    for (let i = 1; i < 9; ++i) {
                        goldList[i] = baojinbiNode.getChildByName(`jb0${i}`);
                        let targetNode = self.gameCtr.node.getChildByName("goldNode").getChildByName("gold").getChildByName("goldSp");
                        let curPos = util.getDistance(targetNode, goldList[i]);

                        goldList[i].runAction(cc.sequence(
                            cc.delayTime(0.03 * i),
                            cc.moveTo(0.5, cc.v2(goldList[i].x + curPos.x, goldList[i].y + curPos.y)).easing(cc.easeCubicActionInOut()),
                            cc.callFunc(function () {
                                goldList[i].active = false;
                                if (i === 8) {
                                    self.gameCtr.onBaojinbiKill(baojinbiNode);
                                    self.goldFinish();
                                }
                            }.bind(self))));
                    }
                }.bind(self);
                self.scheduleOnce(goldCallback, 0.3);
            });
            this.gameCtr.addGoldScoreLb(this.node, `+${this.cardDelta}`);
        }
    },

    //金币动画完成
    goldFinish: function () {
        this.isBoxAniFinish = false;
        this.isGoldAniFinish = false;
        this.node.active = false;
        this.chest.active = false;
        if (!this.isJokerBox) {
            this.gameCtr.goldAni();
            DataManager.instance.setClientMoney(DataManager.instance.getClientMoney() + this.cardDelta);
            EventManager.Dispatch('changeMoney');
        }
        this.node.stopAllActions();
        if (this.boxEffectAni.length > 0) {
            this.boxEffectAni[1].node.active = false;
            this.boxEffectAni[2].node.active = false;
            this.boxEffectAni[3].node.active = false;
        }
    },

    //剧情关闭卡牌
    closeCard: function () {
        if (this.timeBg.node.active) {
            this.timeBg.progress = 0;
            this.timeBg.node.active = false;
            this.playGermEscapeEffect();
        }
    },

    //小丑模式下关闭卡牌
    closeCardInJokerStatus: function () {
        this.closeCard();
        this.bossBg.active = false;
    },

    //节点被销毁时调用
    onDestroy: function () {
        this.removeEvent();
    },

    //小丑模式下打开卡牌
    openCardInJokerStatus: function (data) {
        this.playOpenCardEffectInJokerStatus(function () {
            if (data.Type == EnumDefine.JokerStatusCardType.EMPTY) {
                //空宝箱
                this.germHide();
            } else if (data.Type == EnumDefine.JokerStatusCardType.JOKER) {
                //小丑
                let openCardCallBack = function () {
                    this.isGerm = false;
                    this.isBoss = false;
                    this.isBoxAniFinish = false;
                    this.cardOpenBg.active = true;
                    this.germCard.active = true;
                    this.germCard.setPosition(0, 0.5)
                    this.timeBg.node.setParent(this.germCardDown)

                    let self = this;
                    ResourceManager.instance.setSpriteWithName(`xb_fp_g404`, function (sprite) {
                        self.germCard.getComponent(cc.Sprite).spriteFrame = sprite;
                    })
                }.bind(this);

                //翻开卡牌
                this.scheduleOnce(openCardCallBack, 0.3);

                //播放卡牌消失效果，并且增加免费次数（需求强制为1）
                this.scheduleOnce(function () {
                    this.playGermEscapeEffect();
                    EventManager.Dispatch("CreaseJokerFreeAmount", GameConfig.blackJokerCreaseFreeAmount)
                }, 0.8);
            } else if (data.Type == EnumDefine.JokerStatusCardType.BOX) {
                //宝箱
                this.isGerm = false;
                this.isOpenCard = true;
                this.isBoxAniFinish = true;
                this.operIndex = 4;
                this.chest.active = true;
                this.cardDelta = parseInt(data.Delta);
                this.boxListNode[this.operIndex].node.active = true;
                this.boxListNode[this.operIndex].clearTracks();
                this.boxListNode[this.operIndex].addAnimation(0, "stand01", false, 0);
                this.boxListNode[this.operIndex].addAnimation(1, "stand02", false, 0);

                //打开宝箱
                this.openBox();
            }
        }.bind(this));
    },
});