const EventManager = require('EventManager');
const WindowManager = require("WindowManager");
const ResourceManager = require('ResourceManager');
var CacheManager = require("CacheManager");
var AudioManager = require("AudioManager");
var DataManager = require("DataManager");
var EnumDefine = require("EnumDefine");
var GameConfig = require("GameConfig");
var util = require("util");
var net = require("net");

const cardCount = 16; //卡牌个数
const refreshTime = 8; //刷新时间
//小丑模式下自动翻牌数据
const JOKER_OPEN_CARD_DATAS = [
    [12],
    [13, 8],
    [14, 9, 4],
    [15, 10, 5, 0],
    [11, 6, 1],
    [7, 2],
    [3]
]
//小丑模式下自动翻牌间隔
const JOKER_OPEN_CARD_INTERVAL = 0.25;

//小丑模式下自动打开宝箱的延迟时间
const JOKER_OPEN_CARD_BOX_DELAY = 2.5;

cc.Class({
    extends: cc.Component,

    properties: {
        cardItem: cc.Prefab, //卡牌
        MultipleRateUI: cc.Prefab,
        goldScoreLb: cc.Prefab, //金币奖励
        tipLb: cc.Prefab, //提示文本
        dianjiFab: cc.Prefab,
    },

    onLoad: function () {
        //适配
        let rate = cc.view.getVisibleSize().width / cc.view.getVisibleSize().height;
        let canvas = this.node.getComponent(cc.Canvas);
        let isMoreWidth = rate > (1136 / 640);
        if (rate < 1) {
            canvas.fitWidth = isMoreWidth;
            canvas.fitHeight = !isMoreWidth;
        }
        let curWinSize = cc.winSize;
        let tempRatio = curWinSize.height / curWinSize.width;
        if (tempRatio > 1.34) {
            canvas.fitWidth = !isMoreWidth;
            canvas.fitHeight = isMoreWidth;
        }

        this.conbatManagerJs = this.node.getChildByName("bg").getChildByName("combat").getComponent("CombatManager");
        //卡牌
        this.cardContent = this.node.getChildByName("bg").getChildByName("card").getChildByName("cardLayout");
        //多种比率
        this.multipleRate = this.node.getChildByName("MultipleRate");
        //金币
        this.goldValueLb = this.node.getChildByName("goldNode").getChildByName("gold").getChildByName("goldLb").getComponent(cc.Label);
        //提示
        this.tipNode = this.node.getChildByName("tipNode");
        //选择英雄攻击方式界面
        this.heroAttackStyle = this.node.getChildByName("heroAttackStyle");
        //四种模式按钮
        this.accackBtn = this.heroAttackStyle.getChildByName("attackBtn");
        //选择全自动模式按钮
        this.attackStyleAutomatic = this.accackBtn.getChildByName("automatic");
        //选择自动翻牌模式按钮
        this.attackStyleAutoOpenCard = this.accackBtn.getChildByName("autoOpenCard");
        //选择锁定攻击模式按钮
        this.attackStyleAttackClickCard = this.accackBtn.getChildByName("attackClickCard");
        //选择跟随点击频率模式按钮
        this.attackStyleClickInterval = this.accackBtn.getChildByName("clickInterval");
        //攻击方式修改
        this.heroAttackStyleSelectTips = this.heroAttackStyle.getChildByName("selectTip")
        //声音
        this.voiceBtnSprite = this.node.getChildByName("voice").getComponent(cc.Sprite);
        this.operBtn = this.node.getChildByName("operBtn");
        //刷新
        this.changeNode = this.operBtn.getChildByName("change").getComponent(cc.Button);
        this.changeProgressBar = this.changeNode.node.getChildByName("xb_shuaxindx").getComponent(cc.ProgressBar);
        this.changeText = this.changeNode.node.getChildByName("changeTime").getComponent(cc.Label);
        //特效
        this.germEffectNode = this.node.getChildByName("bg").getChildByName("combat").getChildByName("germEffect");
        //飘分
        this.piaofenNode = this.node.getChildByName("piaofenNode");
        //剧情
        this.plot = this.node.getChildByName("plot");
        //账号绑定按钮
        this.bindAccountBtn = this.node.getChildByName("bindAccountBtn");
        //小丑模式Layer
        this.jokerLayer = this.node.getChildByName("jokerLayer");
        //小丑模式免费次数
        this.jokerFreeAmount = this.node.getChildByName("jokerFreeAmount");
        this.jokerFreeAmountText = this.jokerFreeAmount.getChildByName("Text").getChildByName("Amount").getComponent(cc.Label);
        this.jokerScore = this.jokerFreeAmount.getChildByName("Score").getChildByName("ScoreLb").getComponent(cc.Label);
        this.jokerPiaofen = this.jokerFreeAmount.getChildByName("piaofen");
        //小丑模式增加的免费次数
        this.jokerCreaseAmountTexts = [];
        this.jokerCreaseAmount = this.node.getChildByName("jokerLayer").getChildByName("jokerCreaseAmount");
        //小丑模式大结算动画
        this.jokerTotalRewardAnim = this.node.getChildByName("jokerLayer").getChildByName("jokerRewardEffect").getComponent(cc.Animation);
        //小丑模式大结算数字
        this.jokerTotalRewardAmountText = this.node.getChildByName("jokerLayer").getChildByName("jokerRewardEffect").getChildByName("Amount").getComponent(cc.Label);
        //小丑模式下特效
        this.jokerStatusEffect = this.node.getChildByName("jokerStatusEffect").getComponent(cc.Animation);

        this.node.getChildByName("shipei").active = true;
        //规则按钮
        this.ruleBtn = this.node.getChildByName("rule");

        this.initNodePool();

        this.initEvent();

        this.setVoice();

        canvas.alignWithScreen();

        AudioManager.instance.playGameBackgroundAudio("bgm");

        //请求账号绑定信息
        if (GameConfig.isDebugGame == false) {
            net.GetAccountBindInfo(function (data) {
                if (data.res == "sucess" && data.flag == 0) {
                    EventManager.Dispatch("UpdateBindAccountStatus", true);
                } else {
                    EventManager.Dispatch("UpdateBindAccountStatus", false);
                }
            });
        }

        //开始游戏
        net.StartGameReq();
    },

    start: function () {
        this.init(); //初始化数据
        this.jokerScoreNum = 0;
        this.checkSwitchTime = 0; //检测切换时间
        this.isLocked = false;
        this.isEnterPlot = false;
        let tempMultipleRate = cc.instantiate(this.MultipleRateUI);
        this.multipleRate.addChild(tempMultipleRate);
        tempMultipleRate.getComponent("MultipleRateUI").initGameCtr(this);

        EventManager.Dispatch('refreshUserDianJuan');
    },

    update: function (dt) {
        //刷新按钮8秒CD
        if (!DataManager.instance.isCanRefresh) {
            this.checkSwitchTime += dt;
            this.changeProgressBar.progress = (refreshTime - this.checkSwitchTime) / refreshTime;
            if (`${refreshTime - parseInt(this.checkSwitchTime)}s` !== this.changeText.string) {
                this.changeText.string = `${refreshTime - parseInt(this.checkSwitchTime)}s`;
            }
            if (this.checkSwitchTime >= refreshTime) {
                this.checkSwitchTime = 0;
                DataManager.instance.isCanRefresh = true;
                this.changeNode.interactable = true;
                this.changeProgressBar.node.active = false;
                this.changeText.node.active = false;
            }
        }
    },

    initEvent: function () {
        EventManager.Add("GameBegin", function (event, data) {
            DataManager.instance.setClientMoney(parseInt(DataManager.instance.getMoney()));
            event.goldValueLb.string = util.numberConvert(DataManager.instance.getClientMoney());
        }, this);
        //改变金币
        EventManager.Add("changeMoney", function (event, data) {
            if (event.goldValueLb) {
                event.goldValueLb.string = util.numberConvert(DataManager.instance.getClientMoney());
            }
        }, this);
        //刷新点券
        EventManager.Add("refreshUserDianJuan", function (event, data) {
            net.RefreshUserDianJuanReq(function (dianquanData) {
                //请求成功后处理 
                if (dianquanData) {
                    var result = JSON.parse(dianquanData);
                    if (result.res == "sucess") {
                        DataManager.instance.setVoucher(result.ticket);
                        EventManager.Dispatch('changeVoucher');
                    } else {
                        console.log("刷新点券失败");
                    }
                }
            })
        }, this);

        //同步卡牌信息
        EventManager.Add("SyncCard", function (event, data) {
            if (event.isGameBegin) {
                event.cardListJs[data.Index].openCardRsp(data);
            }
        }, this);

        //下注回应
        EventManager.Add("UpdateBetRsp", function (event, data) {
            if (event.isGameBegin) {
                event.cardListJs[data.Info.BetIndex].updateGold(data);
            }
        }, this);

        //播放细菌出现特效
        EventManager.Add("GermLightEffect", function (event, data) {
            event.playGermLightEffect(data);
        }, this);

        //播放细菌死亡特效
        EventManager.Add("GermDieEffect", function (event, data) {
            event.playGermDieEffect(data);
        }, this);

        //更新一张卡牌
        EventManager.Add("updateOneCard", function (event, data) {
            if (event.isEnterPlot)
                return;

            if (DataManager.instance.isJokerFreeStatus)
                return;

            event.scheduleOnce(function () {
                event.cardListJs[data].cardItemInit(event, data, true, EnumDefine.ModelType.NORMAL);
                event.cardListJs[data].setCardBtnEnabled(true);
            }, util.random(1, 2));
        }, this);

        //金币不足，更新状态
        EventManager.Add("goldLack", function (event, data) {
            if ((DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC ||
                    DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTO_OPEN_CARD)) {
                DataManager.instance.updateCellAttackStyle(EnumDefine.CellAttackStyle.CLICK_INTERVAL);
                event.updateAutoState();
                event.cancelCardLock();
                WindowManager.instance.showTips({
                    "desc": "金币不足，取消自动",
                    "confirmCallBack": function () {
                        WindowManager.instance.showWindow("ShopWindow")
                    },
                })
            } else {
                WindowManager.instance.showTips({
                    "desc": "金币不足，请充值",
                    "confirmCallBack": function () {
                        WindowManager.instance.showWindow("ShopWindow")
                    },
                })
            }
        }, this);

        //网络异常
        EventManager.Add("NetClose", function (event, data) {
            if ((DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC ||
                    DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTO_OPEN_CARD)) {
                DataManager.instance.updateCellAttackStyle(EnumDefine.CellAttackStyle.CLICK_INTERVAL);
                event.updateAutoState();
                event.cancelCardLock();
            }

            //断线后，清除小丑模式数据
            DataManager.instance.clearJokerStatusData();
        }, this);

        //登录成功事件
        EventManager.Add("LoginSuccess", function (event, data) {
            EventManager.Dispatch("ChangeScene");
            cc.director.loadScene("game");
            event.conbatManagerJs.resetData();
            event.resetData();
        }, this);

        //刷新绑定账号状态
        EventManager.Add("UpdateBindAccountStatus", function (event, data) {
            event.bindAccountBtn.active = data;
            if (data == true) {
                WindowManager.instance.showWindow("BindAccountWindow")
            }
        }, this);

        //客户端解锁
        EventManager.Add("CardUnLock", function (event, data) {
            event.cardListJs[data].setCardBtnEnabled(true);
            event.cardListJs[data].isOpenCard = false;
        }, this);

        //进入剧情
        EventManager.Add("EnterStoryRsp", function (event, data) {
            event.isEnterPlot = true;
            AudioManager.instance.playGameBackgroundAudio("plotBgm");
            event.cardListJs[data.Index].closeCard();
            event.playPlotAni(event.cardListJs[data.Index].node);
            event.switchScene(EnumDefine.ModelType.PLOT, true);
            EventManager.Dispatch("CloseWindow");
        }, this);

        //退出剧情
        EventManager.Add("QuitStory", function (event, data) {
            AudioManager.instance.playGameBackgroundAudio("bgm");
            event.isGameBegin = false;
            event.isEnterPlot = false;
            event.scheduleOnce(function () {
                event.init();
                net.RestartGameReq();
            }, 1);
        }, this);

        //进入小丑模式
        EventManager.Add("EnterJokerStatus", function (event, data) {
            event.jokerScoreNum = 0;
            event.jokerScore.string = `${event.jokerScoreNum}`;
            AudioManager.instance.playGameBackgroundAudio("xiaochouBgm");
            event.ruleBtn.active = false;
            event.voiceBtnSprite.node.active = false;
            DataManager.instance.isJokerFreeStatus = true;
            event.jokerFreeAmountText.string = "x" + data
            event.setAttackBtn(false);
            event.switchScene(EnumDefine.ModelType.JOKER, true);
            event.creaseJokerStatusAmount(data, false)
            event.jokerStatusEffect.play();
            event.jokerStatusEffect.node.active = true;
            EventManager.Dispatch("CloseWindow");

            event.operBtn.runAction(cc.moveBy(1, cc.v2(0, -150)));
            event.multipleRate.runAction(cc.moveBy(1, cc.v2(0, -150)));
        }, this);

        //小丑模式杀死卡牌
        EventManager.Add("KillCardInJokerStaus", function (event, data) {
            console.log("KillCardInJokerStaus data = " + data)
            event.cardListJs[data].closeCard();
        }, this);

        //小丑模式增加免费轮数
        EventManager.Add("CreaseJokerFreeAmount", function (event, data) {
            if (DataManager.instance.isPlayingCreaseFreeAmountAnim == false) {
                event.creaseJokerStatusAmount(data, true);
            } else {
                DataManager.instance.jokerCreaseFreeAmountDatas.push(data);
            }
        }, this);

        //小丑模式翻牌
        EventManager.Add("JokerStatusOpenCards", function (event, data) {
            event.autoOpenCardInJokerStatus();
        }, this);

        //退出小丑模式
        EventManager.Add("ExitJokerStatus", function (event, data) {
            AudioManager.instance.playGameBackgroundAudio("bgm");
            event.ruleBtn.active = true;
            event.voiceBtnSprite.node.active = true;
            event.jokerStatusEffect.pause();
            event.jokerStatusEffect.node.active = false;

            DataManager.instance.isJokerFreeStatus = false;

            //操作面板动画
            event.scheduleOnce(() => {
                event.operBtn.runAction(cc.moveBy(1, cc.v2(0, +150)));
                event.multipleRate.runAction(cc.moveBy(1, cc.v2(0, +150)));
            }, 2.5)

            //顶部小丑模式轮数面板动画
            event.jokerFreeAmount.runAction(cc.sequence(cc.moveBy(0.25, cc.v2(0, 180)), cc.callFunc(function () {
                event.jokerFreeAmount.active = false;
            }.bind(event))));

            //小丑模式大结算
            event.showJokerTotalReward();

            //清理小丑结算服务器缓存
            net.ResetClownSettleFlagReq();
        }, this);
    },

    onDestroy: function () {
        EventManager.Remove("GameBegin", this);
        EventManager.Remove("changeMoney", this);
        EventManager.Remove("refreshUserDianJuan", this);
        EventManager.Remove("SyncCard", this);
        EventManager.Remove("UpdateBetRsp", this);
        EventManager.Remove("GermLightEffect", this);
        EventManager.Remove("GermDieEffect", this);
        EventManager.Remove("updateOneCard", this);
        EventManager.Remove("goldLack", this);
        EventManager.Remove("NetClose", this);
        EventManager.Remove("LoginSuccess", this);
        EventManager.Remove("UpdateBindAccountStatus", this);
        EventManager.Remove("CardUnLock", this);
        EventManager.Remove("EnterStoryRsp", this);
        EventManager.Remove("QuitStory", this);
        EventManager.Remove("EnterJokerStatus", this);
        EventManager.Remove("KillCardInJokerStaus", this);
        EventManager.Remove("CreaseJokerFreeAmount", this);
        EventManager.Remove("JokerStatusOpenCards", this);
        EventManager.Remove("ExitJokerStatus", this);
    },

    //初始化
    init: function (modelType = EnumDefine.ModelType.NORMAL) {
        const cardPos = cc.v2(-225, 83.5);
        const cardPosX = 149;
        const cardPosY = 157;

        this.cardListJs = [];
        //实例化16张卡牌
        for (let i = 0; i < cardCount; ++i) {
            let tempCard = this.cardPool.size() > 0 ? this.cardPool.get() : cc.instantiate(this.cardItem);
            this.cardContent.addChild(tempCard);
            this.cardListJs[i] = tempCard.getComponent("CardItemUI");
            this.cardListJs[i].cardItemInit(this, i, false, modelType);
            this.cardListJs[i].setCardBtnEnabled(false);
            let posX = i % 4;
            let posY = parseInt(i / 4);
            tempCard.setPosition(cardPos.x + posX * cardPosX, cardPos.y + posY * cardPosY + 1000);
            tempCard.zIndex = cardCount - i;
        }
        //卡牌掉下动画
        const cardTime = modelType === EnumDefine.ModelType.JOKER ? 0.2 : 0.1;
        for (let count = 0; count < cardCount; ++count) {
            const curDelayTime = modelType === EnumDefine.ModelType.JOKER ? count % 4 * cardTime : count * cardTime;
            this.cardListJs[count].node.runAction(cc.sequence(
                cc.delayTime(curDelayTime),
                cc.moveBy(0.25, cc.v2(0, -1000)),
                cc.moveBy(0.05, cc.v2(0, +20)),
                cc.moveBy(0.05, cc.v2(0, -20)),
                cc.moveBy(0.05, cc.v2(0, +10)),
                cc.moveBy(0.05, cc.v2(0, -10)),
                cc.callFunc(() => {
                    if (count === cardCount - 1) {
                        for (let i = 0; i < cardCount; ++i) {
                            this.cardListJs[i].setCardBtnEnabled(true);
                        }
                        if (DataManager.instance.checkIsAutimaticStyle()) {
                            this.autoOpenCard();
                        }
                        this.isGameBegin = true;
                        DataManager.instance.isRefreshScene = false;
                        DataManager.instance.updateCellAttackStyle(DataManager.instance.storyAttackStyle);
                        this.updateAutoState();

                        if (DataManager.instance.isJokerFreeStatus) {
                            if (DataManager.instance.JokerFreeAmount > 0) {
                                net.ClownOpenAllCardReq(DataManager.instance.jokerCurrentRound);
                            }
                        }
                    }
                })
            ))
            if (modelType === EnumDefine.ModelType.JOKER) {
                this.scheduleOnce(() => AudioManager.instance.playotherAudio("xiaochouCardFall"), curDelayTime);
            } else {
                this.scheduleOnce(() => AudioManager.instance.playotherAudio("The_CARDS_fall"), curDelayTime);
            }

        }
        DataManager.instance.initCardEntityIdList();
    },

    //初始对象池
    initNodePool: function () {
        let self = this;

        //卡牌对象池
        this.cardPool = new cc.NodePool();
        for (let i = 0; i < cardCount; ++i) {
            let card = cc.instantiate(this.cardItem);
            this.cardPool.put(card);
        }

        //爆金币特效对象池
        this.baojinbiPool = new cc.NodePool();
        for (let i = 0; i < 5; ++i) {
            ResourceManager.instance.createPrefab("ef_baojinbi_01", function (node) {
                self.baojinbiPool.put(node);
            })
        }

        //金币文字对象池
        this.goldPool = new cc.NodePool();
        for (let i = 0; i < 5; ++i) {
            let goldScoreItem = cc.instantiate(this.goldScoreLb);
            this.goldPool.put(goldScoreItem);
        }

        //怪出现特效对象池
        this.germOutPool = new cc.NodePool();
        for (let i = 0; i < 5; ++i) {
            ResourceManager.instance.createPrefab("ef_guaichuxian_01", function (node) {
                self.germOutPool.put(node);
            })
        }

        //死亡特效对象池
        this.germDiePool = new cc.NodePool();
        for (let i = 0; i < 5; ++i) {
            ResourceManager.instance.createPrefab("ef_siwangyanwu_01", function (node) {
                self.germDiePool.put(node);
            })
        }

        //提示文本对象池
        this.tipLbPool = new cc.NodePool();
        for (let i = 0; i < 5; ++i) {
            let tipLbItem = cc.instantiate(this.tipLb);
            this.tipLbPool.put(tipLbItem);
        }

        //金宝箱对象池
        this.goldBoxPool = new cc.NodePool();
        for (let i = 0; i < 3; ++i) {
            ResourceManager.instance.createPrefab("ef_baojinbi_02", function (node) {
                self.goldBoxPool.put(node);
            })
        }

        //中等金币对象池
        this.mediumGoldPool = new cc.NodePool();
        for (let i = 0; i < 3; ++i) {
            ResourceManager.instance.createPrefab("ef_baojinbi_03", function (node) {
                self.mediumGoldPool.put(node);
            })
        }

        //小丑宝箱特效对象池
        this.jokerBoxEffectPool = new cc.NodePool();
        for (let i = 0; i < 3; ++i) {
            ResourceManager.instance.createPrefab("ef_xiaocoubaoxian02", function (node) {
                self.jokerBoxEffectPool.put(node);
            })
        }
    },

    //回收卡牌
    onCardKill: function (card) {
        this.cardPool.put(card);
    },

    //回收爆金币特效
    onBaojinbiKill: function (jinbi) {
        this.baojinbiPool.put(jinbi);
        for (let i = 1; i < 9; ++i) {
            jinbi.getChildByName(`jb0${i}`).active = true;
        }
    },

    //回收金币文字
    onGoldScoreKill: function (gold) {
        this.goldPool.put(gold);
        gold.opacity = 255;
        gold.setScale(1);
    },

    //怪出现特效
    onGermOutKill: function (germOut) {
        this.germOutPool.put(germOut);
    },

    //回收死亡特效
    onGermDieKill: function (germDie) {
        this.germDiePool.put(germDie);
    },

    //回收提示文本
    onTipLbKill: function (tipLabel) {
        this.tipLbPool.put(tipLabel);
        tipLabel.opacity = 255;
    },

    //回收金宝箱特效
    onGoldBoxKill: function (goldBox) {
        this.goldBoxPool.put(goldBox);
    },

    //回收中等金币
    onMediumGoldKill: function (mediumGold) {
        this.mediumGoldPool.put(mediumGold);
    },

    //回收小丑宝箱特效
    onJokerBoxEffectKill: function (jokerBoxEffect) {
        this.jokerBoxEffectPool.put(jokerBoxEffect);
    },

    //切换场景
    switchScene: function (modelType, bSaveStoryAttackStyle) {
        DataManager.instance.isRefreshScene = true;
        this.setAutoBtn(false);
        this.cardBoxOpen();

        if (bSaveStoryAttackStyle) {
            DataManager.instance.storyAttackStyle = DataManager.instance.getCellAttackStyle();
        } else {
            DataManager.instance.storyAttackStyle = EnumDefine.CellAttackStyle.CLICK_INTERVAL;
        }

        this.unschedule(this.autoCallBack);
        this.autoCallBack = null;
        DataManager.instance.updateCellAttackStyle(EnumDefine.CellAttackStyle.CLICK_INTERVAL);
        this.updateAttackStyleText();
        this.setAttackBtn(false);
        this.cancelCardLock();

        this.node.runAction(cc.sequence(
            cc.delayTime(3.5),
            cc.callFunc(function () {
                EventManager.Dispatch("UpdateCombatState", false);
                DataManager.instance.isRefreshScene = false;
                this.setAutoBtn(true);
                this.clearLayer();
                if (modelType == EnumDefine.ModelType.NORMAL) {
                    net.RestartGameReq();
                    this.unscheduleAllCallbacks();
                    this.init();
                } else if (modelType == EnumDefine.ModelType.JOKER) {
                    DataManager.instance.setClientMoney(parseInt(DataManager.instance.jokerMoney));
                    EventManager.Dispatch('changeMoney');
                    this.unscheduleAllCallbacks();
                    this.init(modelType);
                }
            }.bind(this))));
    },

    setAutoBtn: function (isAutoBtnClick) {
        this.attackStyleAutomatic.getComponent(cc.Button).interactable = isAutoBtnClick;
        this.attackStyleAutoOpenCard.getComponent(cc.Button).interactable = isAutoBtnClick;
        this.attackStyleAttackClickCard.getComponent(cc.Button).interactable = isAutoBtnClick;
        this.attackStyleClickInterval.getComponent(cc.Button).interactable = isAutoBtnClick;
    },

    //清理
    clearLayer: function () {
        if (this.cardContent.childrenCount > 0) {
            for (let i = 0; i < cardCount; ++i) {
                this.cardListJs[i].node.stopAllActions();
                this.cardListJs[i].unscheduleAllCallbacks();
                this.onCardKill(this.cardListJs[i].node);
            }
        }
    },

    buttonClick: function (event) {
        let btnNode = event.target;
        let btnName = btnNode.name;
        if (btnName === "voice") {
            DataManager.instance.isPlayMusic = !DataManager.instance.isPlayMusic;
            CacheManager.instance.saveGameData();
            this.setVoice();
            AudioManager.instance.playGameBackgroundAudio("bgm");
        } else if (btnName === "rule") {
            // WindowManager.instance.showWindow("Rule");
            this.plot.getComponent("Plot").startStone();
        } else if (btnName === "cell") {
            if (DataManager.instance.isJokerFreeStatus) {
                return;
            }
            WindowManager.instance.showWindow("ChooseHeroWindow");
        } else if (btnName === "auto") {
            if (DataManager.instance.isJokerFreeStatus) {
                return;
            }
            this.heroAttackStyle.active = true;
            this.setAttackBtn(true);
        } else if (btnName === "change") {
            if (DataManager.instance.isJokerFreeStatus) {
                return;
            }
            if (!DataManager.instance.isRefreshScene && DataManager.instance.isCanRefresh) {
                DataManager.instance.isCanRefresh = false;
                this.changeNode.interactable = false;
                this.changeProgressBar.node.active = true;
                this.changeProgressBar.progress = 1;
                this.changeText.node.active = true;
                this.changeText.string = `${refreshTime}s`;
                this.addTipLb("刷新中...");
                this.switchScene(EnumDefine.ModelType.NORMAL, false);
            }
        } else if (btnName === "goldNode") {
            WindowManager.instance.showWindow("ShopWindow");
        } else if (btnName === "automatic") {
            DataManager.instance.updateCellAttackStyle(EnumDefine.CellAttackStyle.AUTOMATIC);
            this.updateAutoState();
            this.setAttackBtn(false);
        } else if (btnName === "autoOpenCard") {
            DataManager.instance.updateCellAttackStyle(EnumDefine.CellAttackStyle.AUTO_OPEN_CARD);
            this.updateAutoState();
            this.setAttackBtn(false);
            this.cancelCardLock();
        } else if (btnName === "attackClickCard") {
            DataManager.instance.updateCellAttackStyle(EnumDefine.CellAttackStyle.ATTACK_CLICK_CARD);
            this.updateAutoState();
            this.setAttackBtn(false);
        } else if (btnName === "clickInterval") {
            DataManager.instance.updateCellAttackStyle(EnumDefine.CellAttackStyle.CLICK_INTERVAL);
            this.updateAutoState();
            this.setAttackBtn(false);
            this.cancelCardLock();
        } else if (btnName === "Canvas") {
            if (this.cdCLickLock) return;
            let vec = event.getLocation();
            this.playClickAni(vec);
            this.cdCLickLock = true;
            this.scheduleOnce(function () {
                this.cdCLickLock = false;
            }, 0.15);
        } else if (btnName === "heroAttackStyleMask") {
            this.setAttackBtn(false);
        } else if (btnName == "bindAccountBtn") {
            WindowManager.instance.showWindow("BindAccountWindow");
        }
    },

    setAttackBtn: function (isShow) {
        if (this.isLocked) {
            return;
        }

        this.isLocked = true;
        for (let i = 0; i < 4; i++) {
            let item = this.accackBtn.children[i];
            if (isShow) {
                item.runAction(cc.sequence(cc.scaleTo(0.03 * i, 1), cc.moveTo(0.1, cc.v2(0, item.position.y)),
                    cc.moveBy(0.05, cc.v2(+20, 0)),
                    cc.moveBy(0.05, cc.v2(-20, 0)),
                    cc.moveBy(0.05, cc.v2(+10, 0)),
                    cc.moveBy(0.05, cc.v2(-10, 0)),
                    cc.callFunc(function () {
                        if (i == 3) {
                            this.isLocked = false;
                        }
                    }.bind(this))));
            } else {
                if (!this.heroAttackStyle.active) {
                    this.isLocked = false;
                    return;
                }
                item.runAction(cc.sequence(cc.scaleTo(0.03 * i, 1), cc.moveTo(0.1, cc.v2(-236, item.position.y)),
                    cc.callFunc(function () {
                        if (i == 3) {
                            this.heroAttackStyle.active = false;
                            this.isLocked = false;
                        }
                    }.bind(this))
                ));
            }
        }
        if (isShow) {
            AudioManager.instance.playotherAudio("ratio_open");
            this.heroAttackStyleSelectTips.runAction(cc.sequence(cc.scaleTo(0.03 * (4 - DataManager.instance.getCellAttackStyle()), 1), cc.moveTo(0.1, cc.v2(0, this.heroAttackStyleSelectTips.position.y)),
                cc.moveBy(0.05, cc.v2(+20, 0)),
                cc.moveBy(0.05, cc.v2(-20, 0)),
                cc.moveBy(0.05, cc.v2(+10, 0)),
                cc.moveBy(0.05, cc.v2(-10, 0))));
        } else {
            AudioManager.instance.playotherAudio("ratio_close");
            this.heroAttackStyleSelectTips.runAction(cc.sequence(cc.scaleTo(0.03 * (4 - DataManager.instance.getCellAttackStyle()), 1), cc.moveTo(0.1, cc.v2(-236, this.heroAttackStyleSelectTips.position.y))));
        }

    },

    playClickAni: function (point) {
        if (!this.dianjiAni) {
            this.dianjiAni = cc.instantiate(this.dianjiFab);
            this.dianjiAni.setPosition(point);
            cc.director.getScene().addChild(this.dianjiAni);
            return;
        }
        this.dianjiAni.setPosition(point);
        this.dianjiAni.getComponent(cc.Animation).play();
    },

    setVoice: function () {
        if (this.voiceOn == null) {
            this.voiceOn = this.node.getChildByName("voice").getChildByName("on");
        }
        if (this.voiceOff == null) {
            this.voiceOff = this.node.getChildByName("voice").getChildByName("off");
        }

        if (DataManager.instance.isPlayMusic) {
            this.voiceOn.active = true;
            this.voiceOff.active = false;
        } else {
            this.voiceOn.active = false;
            this.voiceOff.active = true;
        }
    },

    updateAttackStyleText: function () {
        if (this.attackStyleText == null) {
            this.attackStyleText = this.operBtn.getChildByName("auto").getChildByName("xb_zidongzi").getComponent(cc.Label);
        }

        if (this.attackStyleText != null) {
            if (DataManager.instance.getCellAttackStyle() == EnumDefine.CellAttackStyle.CLICK_INTERVAL) {
                this.attackStyleText.string = "手动攻击";
                this.heroAttackStyleSelectTips.setParent(this.attackStyleClickInterval);
            } else if (DataManager.instance.getCellAttackStyle() == EnumDefine.CellAttackStyle.ATTACK_CLICK_CARD) {
                this.attackStyleText.string = "锁定攻击";
                this.heroAttackStyleSelectTips.setParent(this.attackStyleAttackClickCard);
            } else if (DataManager.instance.getCellAttackStyle() == EnumDefine.CellAttackStyle.AUTO_OPEN_CARD) {
                this.attackStyleText.string = "自动翻牌";
                this.heroAttackStyleSelectTips.setParent(this.attackStyleAutoOpenCard);
            } else if (DataManager.instance.getCellAttackStyle() == EnumDefine.CellAttackStyle.AUTOMATIC) {
                this.attackStyleText.string = "全自动";
                this.heroAttackStyleSelectTips.setParent(this.attackStyleAutomatic);
            }
            this.heroAttackStyleSelectTips.setPosition(0, 0);
        }
    },

    //更新自动状态
    updateAutoState: function () {
        this.autoOpenCard();
        this.updateAttackStyleText();
    },

    //播放细菌出现特效
    playGermLightEffect: function (germNode) {
        let curPos = util.getDistance(germNode, this.germEffectNode);

        this.showGermLightEffect = function (node) {
            this.germEffectNode.addChild(node);
            node.setPosition(curPos);

            let germOutAni = node.getComponent(cc.Animation);
            germOutAni.play();
            germOutAni.on('finished', () => this.onGermOutKill(node), this);
        }

        let effect = null;
        if (this.germOutPool.size() > 0) {
            effect = this.germOutPool.get();
            this.showGermLightEffect(effect);
        } else {
            let self = this;
            ResourceManager.instance.createPrefab("ef_guaichuxian_01", function (node) {
                effect = node;
                self.showGermLightEffect(effect);
            })
        }
    },

    //播放细菌死亡特效
    playGermDieEffect: function (germNode) {
        let curPos = util.getDistance(germNode, this.germEffectNode);

        this.showGermDieEffect = function (node) {
            this.germEffectNode.addChild(node);
            node.setPosition(curPos.x + 35, curPos.y + 20);

            let germDieAni = node.getComponent(cc.Animation);
            germDieAni.play();
            germDieAni.on('finished', () => this.onGermDieKill(node), this);
        }

        let effect = null;
        if (this.germDiePool.size() > 0) {
            effect = this.germDiePool.get();
            this.showGermDieEffect(effect);
        } else {
            let self = this;
            ResourceManager.instance.createPrefab("ef_siwangyanwu_01", function (node) {
                effect = node;
                self.showGermDieEffect(effect);
            })
        }
    },

    //自动翻牌
    autoOpenCard: function () {
        if ((DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC ||
                DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTO_OPEN_CARD) &&
            !DataManager.instance.isRefreshScene &&
            !DataManager.instance.isJokerFreeStatus) {
            //三秒自动翻牌，检测是否还有未翻牌
            if (!this.autoCallBack) {
                this.autoCallBack = function () {
                    let tempArr = this.getNoOpenCard();
                    if (tempArr.length > 0) {
                        let tempIndex = -1; //目标数据
                        do {
                            let num = Math.ceil(Math.random() * cardCount) - 1;
                            if (-1 != tempArr.indexOf(num)) {
                                tempIndex = num;
                            }
                        }
                        while (tempIndex < 0)

                        EventManager.Dispatch("AutoOpenCard", tempIndex)

                        //翻牌时间被重置，因此
                        if (DataManager.instance.isCanUpdateOpenCardTotalTime) {
                            DataManager.instance.isCanUpdateOpenCardTotalTime = false;
                            this.conbatManagerJs.updateAutoOpenCardTime(true);
                            if (this.autoCallBack) {
                                this.unschedule(this.autoCallBack);
                                this.schedule(this.autoCallBack, DataManager.instance.autoOpenCardTotalTime);
                            }
                        }
                    }
                }
                this.schedule(this.autoCallBack, DataManager.instance.autoOpenCardTotalTime);
            }
        } else {
            if (this.autoCallBack) {
                this.unschedule(this.autoCallBack);
                this.autoCallBack = null;
            }
            if (DataManager.instance.isRefreshScene) {
                DataManager.instance.updateCellAttackStyle(EnumDefine.CellAttackStyle.CLICK_INTERVAL);
                this.updateAttackStyleText();
            }
        }
    },

    //获取未开牌
    getNoOpenCard: function () {
        let tempArr = [];
        for (let i = 0; i < cardCount; ++i) {
            if (!this.cardListJs[i].isOpenCard) {
                tempArr.push(i);
            }
        }
        return tempArr;
    },

    //刷新时卡牌宝箱自动打开
    cardBoxOpen: function () {
        for (let i = 0; i < cardCount; ++i) {
            let cardJs = this.cardListJs[i];
            if (cardJs.isOpenCard && cardJs.isBoxAniFinish) {
                cardJs.openBox(cardJs.operIndex);
            }
        }
    },

    //隐藏所有卡牌
    closeAllCards: function () {
        for (let i = 0; i < cardCount; ++i) {
            this.cardListJs[i].closeCardInJokerStatus();
        }
    },

    //取消卡牌锁定
    cancelCardLock: function () {
        for (let i = 0; i < cardCount; ++i) {
            let cardJs = this.cardListJs[i];
            cardJs.cancelLock();
        }
    },

    //添加提示
    addTipLb: function (curTipLb) {
        let tipNodeLb = this.tipLbPool.size() > 0 ? this.tipLbPool.get() : cc.instantiate(this.tipLb);;
        tipNodeLb.getComponent(cc.Label).string = curTipLb;
        this.tipNode.addChild(tipNodeLb);
        tipNodeLb.setPosition(0, -(this.tipNode.childrenCount - 1) * 60);
        tipNodeLb.runAction(cc.sequence(
            cc.moveBy(1, cc.v2(0, 200)),
            cc.fadeOut(0.3),
            cc.callFunc(function () {
                this.onTipLbKill(tipNodeLb);
            }.bind(this))));
    },

    //剧情动画
    playPlotAni: function (cardNode) {
        let self = this;
        //花展开动画
        let plotAniCallBack = function () {
            self.plotAni.setScale(1);
            let plotAniPos = util.getDistance(cardNode, self.plot);
            self.plotAni.setPosition(plotAniPos.x, plotAniPos.y - 20);
            self.plotAni.getComponent(sp.Skeleton).setAnimation(0, "stand01", false);

            //花瓣散开动画
            self.scheduleOnce(function () {
                self.plotAni.runAction(cc.scaleTo(0.3, 2));
                self.plotAni.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(0, 0)), cc.delayTime(0.1), cc.callFunc(function () {
                    AudioManager.instance.playotherAudio(`petal`);
                    self.plotAni.getComponent(sp.Skeleton).setAnimation(0, "stand02", false);
                    let data = {};
                    EventManager.Dispatch("EnterStory", data);

                    //花瓣散开动画
                    self.scheduleOnce(function () {
                        if (self.huabanAni == null) {
                            ResourceManager.instance.createPrefab("Effect_HuaBan", function (node) {
                                self.huabanAni = node;
                                self.plot.addChild(self.huabanAni);
                            })
                        } else {
                            self.huabanAni.getComponent(cc.Animation).play();
                            self.huabanAni.getChildByName("HuaBan").getComponent(cc.ParticleSystem).resetSystem();
                        }

                        self.plotAni.active = false;
                    }, 0.2);
                })));
            }, 2.5);
        }
        if (this.plotAni == null) {
            ResourceManager.instance.createPrefab("huafenguomin", function (node) {
                self.plotAni = node;
                self.plot.addChild(self.plotAni);
                plotAniCallBack();
            })
        } else {
            self.plotAni.active = true;
            plotAniCallBack();
        }
    },

    //金币动画
    goldAni: function () {
        let goldNode = this.node.getChildByName("goldNode").getChildByName("gold");
        goldNode.runAction(cc.sequence(
            cc.scaleTo(0.1, 1.1, 1.1),
            cc.scaleTo(0.1, 1.0, 1.0),
        ));
    },

    //播放爆金币特效
    playGoldEffect: function (goldEffectNode, callback) {
        let effect = null;

        this.showGoldEffect = function (node) {
            this.piaofenNode.addChild(node);
            let piaofen = util.getDistance(goldEffectNode, this.piaofenNode);
            node.setPosition(piaofen);
            node.getComponent(cc.Animation).play();
            if (callback != null) {
                callback(node);
            }
        }

        if (this.baojinbiPool.size() > 0) {
            effect = this.baojinbiPool.get();
            this.showGoldEffect(effect);
        } else {
            let self = this;
            ResourceManager.instance.createPrefab("ef_baojinbi_01", function (node) {
                effect = node;
                self.showGoldEffect(effect);
            })
        }
    },

    //播放金宝箱特效
    playGoldBoxEffect: function (goldBoxNode, callback) {
        let goldBoxAni = null;
        this.showGoldBoxEffect = function (node) {
            this.piaofenNode.addChild(node);
            let piaofen = util.getDistance(goldBoxNode, this.piaofenNode);
            node.setPosition(piaofen);
            node.y -= 40;
            node.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
            if (callback != null) {
                callback(node);
            }
        }

        if (this.goldBoxPool.size() > 0) {
            goldBoxAni = this.goldBoxPool.get();
            this.showGoldBoxEffect(goldBoxAni);
        } else {
            let self = this;
            ResourceManager.instance.createPrefab("ef_baojinbi_02", function (node) {
                goldBoxAni = node;
                self.showGoldBoxEffect(goldBoxAni);
            })
        }
    },

    //播放中等金币特效
    playMediumGoldEffect: function (mediumGoldNode, callback) {
        let mediumGoldAni = null;
        this.showMediumGoldEffect = function (node) {
            this.piaofenNode.addChild(node);
            let piaofen = util.getDistance(mediumGoldNode, this.piaofenNode);
            node.setPosition(piaofen);
            node.y -= 40;
            node.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
            if (callback != null) {
                callback(node);
            }
        }

        if (this.mediumGoldPool.size() > 0) {
            mediumGoldAni = this.mediumGoldPool.get();
            this.showMediumGoldEffect(mediumGoldAni);
        } else {
            let self = this;
            ResourceManager.instance.createPrefab("ef_baojinbi_03", function (node) {
                mediumGoldAni = node;
                self.showMediumGoldEffect(mediumGoldAni);
            })
        }
    },

    //播放大金币特效
    playBigGoldEffect: function (cardDelta) {
        if (this.bigGoldAni1 == null) {
            let self = this;

            this.scheduleOnce(function () {
                ResourceManager.instance.createPrefab("ef_pendajinbi02", function (node) {
                    self.bigGoldAni2 = node;
                    self.piaofenNode.addChild(self.bigGoldAni2);
                    self.bigGoldAni2.zIndex = 1;
                })
                this.goldRoll(cardDelta);
            }.bind(this), 0.3);

            ResourceManager.instance.createPrefab("ef_pendajinbi01", function (node) {
                self.bigGoldAni1 = node;
                self.piaofenNode.addChild(self.bigGoldAni1);
                self.bigGoldAni1.zIndex = 2;
            })
            return;
        }

        this.scheduleOnce(function () {
            this.bigGoldAni2.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
            this.bigGoldAni2.getChildByName("jibi2").getComponent(cc.ParticleSystem).resetSystem();
            this.goldRoll(cardDelta);
        }.bind(this), 0.3);

        this.bigGoldAni1.getComponent(cc.Animation).play();
    },

    //播放小丑宝箱特效
    playJokerBoxEffect: function (cardNode, callback) {
        let jokerBoxEffect = null;
        this.showJokerBoxEffect = function (node) {
            this.piaofenNode.addChild(node);
            let piaofen = util.getDistance(cardNode, this.piaofenNode);
            node.setPosition(piaofen);
            node.y -= 40;
            let animation = node.getComponent(cc.Animation);
            node.getChildByName("jinbi").getComponent(cc.ParticleSystem).resetSystem();
            node.getChildByName("caidai").getComponent(cc.ParticleSystem).resetSystem();
            node.getChildByName("caidai2").getComponent(cc.ParticleSystem).resetSystem();
            node.getChildByName("caidai3").getComponent(cc.ParticleSystem).resetSystem();
            animation.resume();
            animation.play();
            if (callback != null) {
                callback(node);
            }
        }

        if (this.jokerBoxEffectPool.size() > 0) {
            jokerBoxEffect = this.jokerBoxEffectPool.get();
            this.showJokerBoxEffect(jokerBoxEffect);
        } else {
            let self = this;
            ResourceManager.instance.createPrefab("ef_xiaocoubaoxian02", function (node) {
                jokerBoxEffect = node;
                self.showJokerBoxEffect(jokerBoxEffect);
            })
        }
    },

    //大金币滚动叠加
    goldRoll: function (cardDelta) {
        let goldRollLb = this.bigGoldAni1.getChildByName("ui").getChildByName("bigLb").getComponent(cc.Label);
        let repeat = 48;
        let count = 0;
        this.schedule(function () {
            count++;
            goldRollLb.string = `+${parseInt(cardDelta / repeat) * count}`;
            if (count === repeat) {
                goldRollLb.string = `+${cardDelta}`;
            }
        }, 0.01, repeat - 1, 0.01);

        let self = this;
        this.scheduleOnce(function () {
            if (!self.baojinbiAni) {
                ResourceManager.instance.createPrefab("ef_baojinbidi_01", function (node) {
                    self.baojinbiAni = node;
                    self.piaofenNode.addChild(self.baojinbiAni);
                    self.baojinbiAni.y = -cc.winSize.height / 2 - 62;
                    self.baojinbiAni.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
                })
            } else {
                self.baojinbiAni.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
            }
        }, 1);
    },

    //添加金币文字
    addGoldScoreLb: function (goldScoreNode, goldTipLb, bIsDelayTime = false) {
        let curPos = util.getDistance(goldScoreNode, this.piaofenNode);

        let goldLb = this.goldPool.size() > 0 ? this.goldPool.get() : cc.instantiate(this.goldScoreLb);
        this.piaofenNode.addChild(goldLb);
        goldLb.getComponent(cc.Label).string = goldTipLb;
        goldLb.setPosition(curPos);

        let tempDelayTime = bIsDelayTime ? 1.3 : 0.3;

        goldLb.runAction(cc.sequence(
            cc.scaleTo(0.15, 2.5),
            cc.scaleTo(0.15, 0.8),
            cc.scaleTo(0.1, 1.2),
            cc.scaleTo(0.1, 1),
            cc.delayTime(tempDelayTime),
            cc.moveBy(0.5, cc.v2(0, 60)),
            cc.fadeOut(0.2),
            cc.callFunc(function () {
                EventManager.Dispatch('updateOneCard', goldScoreNode.getComponent("CardItemUI").cardIndex);
                this.onGoldScoreKill(goldLb);
            }.bind(this))));
    },

    //小丑模式金币飞出
    jokerGoldFly: function (goldScoreNode, goldTipLb) {
        let curPos = util.getDistance(goldScoreNode, this.jokerPiaofen);

        let goldLb = this.goldPool.size() > 0 ? this.goldPool.get() : cc.instantiate(this.goldScoreLb);
        this.jokerPiaofen.addChild(goldLb);
        goldLb.getComponent(cc.Label).string = `+${goldTipLb}`;
        goldLb.setScale(1.2);
        goldLb.setPosition(curPos);
        this.scheduleOnce(() => {
            goldLb.runAction(cc.scaleTo(0.8, 0.5));
            goldLb.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.fadeOut(0.3)
            ))
            goldLb.runAction(cc.sequence(
                cc.moveTo(0.8, cc.Vec2.ZERO).easing(cc.easeCubicActionInOut()),
                cc.callFunc(function () {
                    this.jokerScoreNum += goldTipLb;
                    this.jokerScore.string = `${this.jokerScoreNum}`;
                    this.jokerScore.node.runAction(cc.sequence(
                        cc.scaleTo(0.1, 1.1, 1.1),
                        cc.scaleTo(0.1, 1.0, 1.0)
                    ));
                    EventManager.Dispatch('updateOneCard', goldScoreNode.getComponent("CardItemUI").cardIndex);
                    this.onGoldScoreKill(goldLb);
                }.bind(this))
            ));
        }, 0.5);

    },

    //增加小丑模式下次数
    creaseJokerStatusAmount: function (amount, bBlackJoker) {
        if (DataManager.instance.isPlayingCreaseFreeAmountAnim == true)
            return;

        DataManager.instance.isPlayingCreaseFreeAmountAnim = true;
        let tweenTime = 0.25;
        let data = this.getJokerCreaseAmountText();
        let jokerCreaseAmountNode = data["Node"];
        let jokerCreaseAmountMask = data["Mask"]
        let jokerCreaseAmountText = data["Amount"];
        let blackJoker = data["BlackJoker"];
        let redJokerSpeketon = data["RedJoker"];
        if (bBlackJoker) {
            AudioManager.instance.playotherAudio("xiaowang");
            blackJoker.active = true;
            redJokerSpeketon.node.active = false;
            jokerCreaseAmountText.node.active = true;
        } else {
            AudioManager.instance.playotherAudio("dawang");
            DataManager.instance.JokerFreeAmount += amount;
            blackJoker.active = false;
            redJokerSpeketon.node.active = true;
            redJokerSpeketon.setAnimation(0, "stand", false);
            jokerCreaseAmountText.node.active = true;

            this.scheduleOnce(function () {
                jokerCreaseAmountText.node.active = false;
            }.bind(this), 2)
        }

        jokerCreaseAmountText.string = amount.toString();
        jokerCreaseAmountNode.setPosition(0, -105);
        jokerCreaseAmountNode.active = true;
        jokerCreaseAmountMask.active = true;

        if (this.jokerFreeAmount.active == false) {
            this.jokerFreeAmount.active = true;
            this.jokerFreeAmount.runAction(cc.sequence(cc.moveBy(tweenTime, cc.v2(0, -180)),
                cc.moveBy(0.05, cc.v2(0, -100)),
                cc.moveBy(0.05, cc.v2(0, 100)),
                cc.moveBy(0.05, cc.v2(0, -50)),
                cc.moveBy(0.05, cc.v2(0, 50))));
        }

        if (bBlackJoker) {
            jokerCreaseAmountNode.setScale(0);
            jokerCreaseAmountNode.runAction(cc.sequence(cc.scaleTo(0.15, 1.5), cc.scaleTo(0.15, 0.8), cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1), cc.delayTime(0.5),
                cc.callFunc(function () {
                    if (bBlackJoker) {
                        DataManager.instance.JokerFreeAmount += amount;
                    }

                    DataManager.instance.isPlayingCreaseFreeAmountAnim = false;
                    if (DataManager.instance.jokerCreaseFreeAmountDatas.length > 0) {
                        let temp = DataManager.instance.jokerCreaseFreeAmountDatas.shift();
                        this.creaseJokerStatusAmount(temp, true);
                    }
                    jokerCreaseAmountMask.active = false;
                }.bind(this)),
                cc.spawn(cc.moveTo(tweenTime, cc.v2(this.jokerFreeAmountText.node.parent.parent.x, this.jokerFreeAmountText.node.parent.parent.y)),
                    cc.scaleTo(tweenTime, 0)), cc.callFunc(function () {
                    jokerCreaseAmountNode.active = false;
                    this.jokerCreaseAmountTexts.push(data);
                    this.jokerFreeAmountText.string = "x" + DataManager.instance.JokerFreeAmount.toString();
                    this.jokerFreeAmountText.node.runAction(cc.sequence(cc.scaleTo(tweenTime, 2), cc.scaleTo(tweenTime, 1)));
                }.bind(this))));
        } else {
            jokerCreaseAmountNode.setScale(1);
            this.scheduleOnce(function () {
                DataManager.instance.isPlayingCreaseFreeAmountAnim = false;
                jokerCreaseAmountNode.active = false;
            }, 2.5);
        }
    },

    //获取小丑模式
    getJokerCreaseAmountText: function () {
        let data = null;
        if (this.jokerCreaseAmountTexts.length > 0) {
            data = this.jokerCreaseAmountTexts.shift();
        } else {
            let node = cc.instantiate(this.jokerCreaseAmount);
            node.setParent(this.jokerLayer);
            data = {};
            data["Node"] = node;
            data["Mask"] = node.getChildByName("Mask");
            data["Amount"] = node.getChildByName("Amount").getComponent(cc.Label);
            data["RedJoker"] = node.getChildByName("RedJoker").getComponent(sp.Skeleton);
            data["BlackJoker"] = node.getChildByName("BlackJoker");
        }

        return data;
    },

    //减少小丑模式下次数
    decreaseJokerStatusAmount: function () {
        let tweenTime = 0.25;
        DataManager.instance.JokerFreeAmount--;
        this.jokerFreeAmountText.string = "x" + DataManager.instance.JokerFreeAmount.toString();
        this.jokerFreeAmountText.node.runAction(cc.sequence(cc.scaleTo(tweenTime, 2), cc.scaleTo(tweenTime, 1)));
    },

    //小丑模式下自动翻牌
    autoOpenCardInJokerStatus: function () {
        this.decreaseJokerStatusAmount();
        let self = this;
        for (let i = 0; i < JOKER_OPEN_CARD_DATAS.length; i++) {
            this.scheduleOnce(function () {
                for (let j = 0; j < JOKER_OPEN_CARD_DATAS[i].length; j++) {
                    let index = JOKER_OPEN_CARD_DATAS[i][j];
                    let cardData = DataManager.instance.getJokerCardDataWithIndex(index);
                    self.cardListJs[index].openCardInJokerStatus(cardData);
                }

                if (i == (JOKER_OPEN_CARD_DATAS.length - 1)) {
                    //播放完宝箱特效后，重新开始初始化卡牌
                    self.scheduleOnce(function () {
                        if (DataManager.instance.JokerFreeAmount == 0) {
                            DataManager.instance.isJokerFreeStatus = false;

                            if (DataManager.instance.jokerTotalRewardAmount > 0) {
                                //派发退出小丑模式事件
                                EventManager.Dispatch("ExitJokerStatus");
                            }

                            //切换场景
                            self.switchScene(EnumDefine.ModelType.NORMAL, true);
                        } else {
                            self.clearLayer();
                            self.init(EnumDefine.ModelType.JOKER);
                        }
                    }, JOKER_OPEN_CARD_BOX_DELAY)
                }
            }, JOKER_OPEN_CARD_INTERVAL * i)
        }
    },

    //展示小丑模式大结算
    showJokerTotalReward: function () {
        let self = this;
        let count = 0;
        let repeat = 48;
        this.schedule(function () {
            count++;
            let temp = parseInt(DataManager.instance.jokerTotalRewardAmount / repeat) * count
            self.jokerTotalRewardAmountText.string = `+` + temp;
            if (count == repeat) {
                self.jokerTotalRewardAmountText.string = `+${DataManager.instance.jokerTotalRewardAmount}`;

                //清理小丑结算数据
                DataManager.instance.clearJokerStatusData();
            }
        }, 0.01, repeat - 1, 0.01);

        this.jokerTotalRewardAmountText.node.active = true;
        this.jokerTotalRewardAmountText.node.parent.active = true;
        this.jokerTotalRewardAnim.resume("ef_zhuanfanle");
        this.jokerTotalRewardAnim.play();

        //金币音效
        AudioManager.instance.playotherAudio("Big_gold_coin");

        //中间大金币特效
        if (!this.jokerTotalRewardCenterGoldEffect) {
            this.jokerTotalRewardCenterGoldEffect = this.jokerTotalRewardAnim.node.getChildByName("ef_pendajinbi02");
        }

        this.jokerTotalRewardCenterGoldEffect.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
        this.jokerTotalRewardCenterGoldEffect.getChildByName("jibi2").getComponent(cc.ParticleSystem).resetSystem();
        this.jokerTotalRewardCenterGoldEffect.active = true;

        //底部大金币特效

        this.scheduleOnce(function () {
            if (!this.jokerTotalRewardBottomGoldEffect) {
                ResourceManager.instance.createPrefab("ef_baojinbidi_01", function (node) {
                    self.jokerTotalRewardBottomGoldEffect = node;
                    self.jokerTotalRewardAnim.node.addChild(self.jokerTotalRewardBottomGoldEffect);
                    self.jokerTotalRewardAnim.zIndex = 1;
                    self.jokerTotalRewardBottomGoldEffect.y = -cc.winSize.height / 2 - 62;
                    self.jokerTotalRewardBottomGoldEffect.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
                })
            } else {
                this.jokerTotalRewardBottomGoldEffect.getChildByName("jibi1").getComponent(cc.ParticleSystem).resetSystem();
                this.jokerTotalRewardBottomGoldEffect.active = true;
            }
        }.bind(this), 0.3);

        //隐藏金币数字
        this.scheduleOnce(function () {
            this.jokerTotalRewardAmountText.node.active = false;
        }.bind(this), 2.5);

        //隐藏金币特效
        this.scheduleOnce(function () {
            this.jokerTotalRewardAmountText.node.parent.active = false;
        }.bind(this), 3);
    },

    //重置数据
    resetData: function () {
        this.cardPool.clear();
        this.goldPool.clear();
        this.tipLbPool.clear();
        this.germOutPool.clear();
        this.germDiePool.clear();
        this.goldBoxPool.clear();
        this.baojinbiPool.clear();
        this.mediumGoldPool.clear();
        this.jokerBoxEffectPool.clear();
    }
});