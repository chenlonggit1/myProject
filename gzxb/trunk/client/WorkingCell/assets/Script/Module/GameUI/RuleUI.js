var EnumDefine = require("EnumDefine");
var GameConfig = require("GameConfig");
var EventManager = require('EventManager');
var WindowManager = require("WindowManager");
var ResourceManager = require('ResourceManager');

const ruleCfg = [
    // "点击卡牌可翻开细菌或者宝箱，也有一定几率免费触发剧情模式。",
    "点击卡牌可翻开细菌或者宝箱。",
    "点击怪物卡牌进行攻击，有一定几率可以获得金币。",
    "点击细胞界面，里面附有细胞详情介绍。",
    "刷新场景和细菌卡牌。",
    "可选择投入倍数。",
    "系统自动翻牌和攻击细菌卡牌。",
    "系统自动翻牌，不会自动攻击细菌。",
    "锁定某一个细菌，系统会持续进行攻击。",
    "点击可以单次攻击，长按卡牌可以持续攻击。",
];

cc.Class({
    extends: cc.Component,

    properties: {
        ruleItem: cc.Prefab,
        explainItem: cc.Prefab,
    },

    onLoad: function () {
        this.isGermRate = 0;
        this.isFirstOpen = [];
        for (let i = 0; i < 3; ++i) {
            this.isFirstOpen[i] = true;
        }
        let dikuangNode = this.node.getChildByName("dikuang");
        this.rateLayer = dikuangNode.getChildByName("beilv");
        this.introduceLayer = dikuangNode.getChildByName("jiesao");
        this.explain = dikuangNode.getChildByName("shuoming");
        this.setRuleBtnStatu();

        this.germInfo = this.node.getChildByName("germInfo");
        this.germDescSprite = this.node.getChildByName("germInfo").getChildByName("texture").getComponent(cc.Sprite);
        if (cc.view.getVisibleSize().height < 1100) {
            this.germDescSprite.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height + 50);
        }

        this.initEvent();
    },

    //注册事件
    initEvent: function () {
        //关闭窗口
        EventManager.Add("CloseWindow", function (event, data) {
            WindowManager.instance.closeWindow(event.name);
            event.node.destroy();
        }, this);
    },

    //移除事件
    onDestroy: function () {
        EventManager.Remove("CloseWindow", this);
    },

    initData: function (name, data) {
        this.name = name;
    },

    //规则点击
    ruleBtnClick: function (event, customEventData) {
        let btnNode = event.target;
        if (btnNode.name === "xb_guanbi") {
            WindowManager.instance.closeWindow(this.name);
            this.node.destroy();
        }
        if (customEventData) {
            if (this.isGermRate != customEventData) {
                this.isGermRate = customEventData;
                this.setRuleBtnStatu();
            }
        }
    },

    //设置规则按钮状态
    setRuleBtnStatu: function () {
        this.rateLayer.active = this.isGermRate == 0;
        this.introduceLayer.active = this.isGermRate == 1;
        this.explain.active = this.isGermRate == 2;

        if (this.isGermRate == 0) {
            if (this.isFirstOpen[0]) {
                this.isFirstOpen[0] = false;
                let germRuleNode = this.rateLayer.getChildByName("view").getChildByName("content").getChildByName("germ");
                let bossRuleNode = this.rateLayer.getChildByName("view").getChildByName("content").getChildByName("boss");
                let specialRuleNode = this.rateLayer.getChildByName("view").getChildByName("content").getChildByName("special");
                germRuleNode.getComponent(cc.Layout).enabled = true;
                bossRuleNode.getComponent(cc.Layout).enabled = true;
                specialRuleNode.getComponent(cc.Layout).enabled = true;


                let self = this;
                for (let i = 0; i < GameConfig.monsterInfos.length; ++i) {
                    if (GameConfig.monsterInfos[i].isShowInRule == 1) {
                        let ruleItemNode = cc.instantiate(this.ruleItem);
                        if (GameConfig.monsterInfos[i].Type === EnumDefine.GermType.Common) {
                            germRuleNode.addChild(ruleItemNode);
                            ResourceManager.instance.setSpriteWithName(`xiaoguai${GameConfig.monsterInfos[i].ID}`, function (sprite) {
                                ruleItemNode.getComponent(cc.Sprite).spriteFrame = sprite;
                                self.setGermState(GameConfig.monsterInfos[i].ID, GameConfig.monsterInfos[i].Type, ruleItemNode);
                                ruleItemNode.getComponent("RuleItem").initRuleItem(self, GameConfig.monsterInfos[i].ID);
                            })
                        } else if (GameConfig.monsterInfos[i].Type === EnumDefine.GermType.BOSS) {
                            bossRuleNode.addChild(ruleItemNode);
                            ResourceManager.instance.setSpriteWithName(`daguai${GameConfig.monsterInfos[i].ID}`, function (sprite) {
                                ruleItemNode.getComponent(cc.Sprite).spriteFrame = sprite;
                                self.setGermState(GameConfig.monsterInfos[i].ID, GameConfig.monsterInfos[i].Type, ruleItemNode);
                                ruleItemNode.getComponent("RuleItem").initRuleItem(self, GameConfig.monsterInfos[i].ID);
                            })
                        } else if (GameConfig.monsterInfos[i].Type === EnumDefine.GermType.JOKER || GameConfig.monsterInfos[i].Type === EnumDefine.GermType.SPECIAL) {
                            specialRuleNode.addChild(ruleItemNode);
                            ResourceManager.instance.setSpriteWithName(`daguai${GameConfig.monsterInfos[i].ID}`, function (sprite) {
                                ruleItemNode.getComponent(cc.Sprite).spriteFrame = sprite;
                                self.setGermState(GameConfig.monsterInfos[i].ID, GameConfig.monsterInfos[i].Type, ruleItemNode);
                                ruleItemNode.getComponent("RuleItem").initRuleItem(self, GameConfig.monsterInfos[i].ID);
                            })
                        }
                    }
                }

                let updateData = function () {
                    germRuleNode.getComponent(cc.Layout).enabled = false;
                    bossRuleNode.getComponent(cc.Layout).enabled = false;
                    specialRuleNode.getComponent(cc.Layout).enabled = false;
                    germRuleNode.getChildByName("germTitle").active = true;
                    bossRuleNode.getChildByName("bossTitle").active = true;
                    specialRuleNode.getChildByName("specialTitle").active = true;
                }.bind(this);
                this.scheduleOnce(updateData, 0.1);
            }
        } else if (this.isGermRate == 1) {
            if (this.isFirstOpen[1]) {
                this.isFirstOpen[1] = false;
                let contentNode = this.introduceLayer.getChildByName("view").getChildByName("content");
                for (let i = 0; i < 9; ++i) {
                    contentNode.children[i].getChildByName("ruleText").getComponent(cc.Label).string = ruleCfg[i];
                }
            }
        } else if (this.isGermRate == 2) {
            if (this.isFirstOpen[2]) {
                this.isFirstOpen[2] = false;

                for (let i = 1; i < 5; ++i) {
                    let curLevelInfo = GameConfig.levelInfos[i - 1].Explain;
                    let curNode = this.explain.getChildByName(`shuoming${i}`).getChildByName("layout");
                    for (let j = 0; j < curLevelInfo.length; ++j) {
                        let explainNode = cc.instantiate(this.explainItem);
                        curNode.addChild(explainNode);
                        ResourceManager.instance.setSpriteWithName(`daguai${curLevelInfo[j]}`, function (sprite) {
                            explainNode.getComponent(cc.Sprite).spriteFrame = sprite;
                        })
                    }
                }
            }
        }
    },

    ruleOnClick: function (ruleIndex) {
        let self = this;
        ResourceManager.instance.setSpriteWithName(ruleIndex.toString(), function (sprite) {
            self.germDescSprite.spriteFrame = sprite;
            self.germInfo.active = true;
        })
    },

    pictureClick: function (event) {
        this.germInfo.active = false;
    },

    //设置怪物状态
    setGermState: function (germIndex, germType, germEntity) {
        let germInfo = GameConfig.getMonsterInfoWithID(germIndex);
        if (germType == EnumDefine.GermType.JOKER || germType == EnumDefine.GermType.SPECIAL) {
            germEntity.getChildByName("text").getComponent(cc.Label).string = "随机";
        } else {
            germEntity.getChildByName("text").getComponent(cc.Label).string = germInfo.RatioText.join('-');
        }
    },
});