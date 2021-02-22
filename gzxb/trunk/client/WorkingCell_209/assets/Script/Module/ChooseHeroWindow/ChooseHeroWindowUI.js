var net = require("net")
var DragNode = require("DragNode")
var EnumDefine = require("EnumDefine");
var GameConfig = require("GameConfig");
var DataManager = require("DataManager");
var EventManager = require("EventManager");
var WindowManager = require("WindowManager");
var ResourceManager = require("ResourceManager");
var ChooseHeroItem = require("ChooseHeroItem")

const MAX_COMBAT_HERO_COUNT = 5;

cc.Class({
    extends: cc.Component,

    properties: {
        topHeroItem: {
            default: null,
            type: cc.Node,
        },
        centerHeroItem: {
            default: null,
            type: cc.Node,
        },
        dragHeroItem: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad: function () {
        this.curSelectIndex = 0;
        this.chooseHeroName = this.node.getChildByName("HeroInformation").getChildByName("NameText").getComponent(cc.Label);
        this.chooseHeroIntroduce = this.node.getChildByName("HeroInformation").getChildByName("Introduce").getComponent(cc.Label);
        this.chooseHeroCharacter = this.node.getChildByName("HeroInformation").getChildByName("Character").getComponent(cc.Sprite);
        this.chooseHeroTitle = this.node.getChildByName("HeroInformation").getChildByName("Title").getComponent(cc.Label);
        this.chooseHeroEffectOfTheBattle = this.node.getChildByName("HeroInformation").getChildByName("EffectOfTheBattle").getComponent(cc.Label);
        this.chooseHeroTips = this.node.getChildByName("HeroInformation").getChildByName("Tips");
        this.chooseHeroKillGermCount = this.node.getChildByName("HeroInformation").getChildByName("KillGermCount").getComponent(cc.Label);

        //上阵英雄时拖动的节点
        this.topDragNode = this.node.getChildByName("TopDragNode").getComponent(DragNode);
        this.topDragNode.init(EnumDefine.DragNodeType.TOP);
        this.topBackground = this.node.getChildByName("TopDragNode").getChildByName("Background")
        this.topBackgroundSelect = this.node.getChildByName("TopDragNode").getChildByName("Background_Select")
        this.topDragNodeIcon = this.node.getChildByName("TopDragNode").getChildByName("Icon").getComponent(cc.Sprite);

        this.centerHeroView = this.node.getChildByName("HeroList_Center");

        //顶部Item选中提示
        this.topSelectTips = this.node.getChildByName("HeroList_Top").getChildByName("Background").getChildByName("SelectTips")

        //顶部Item容器
        this.topItemContent = this.node.getChildByName("HeroList_Top").getChildByName("Background").getChildByName("ScrollView").getChildByName("view").getChildByName("content");

        //顶部英雄列表
        this.topHeroItems = [];

        //
        this.centerSelectIndex = -1;

        //中间英雄列表
        this.centerHeroItems = [];

        //底部英雄列表
        this.bottomHeroItems = [];

        //下阵英雄时拖动的节点
        this.bottomDragNode = this.node.getChildByName("BottomDragNode").getComponent(DragNode);
        this.bottomDragNode.init(EnumDefine.DragNodeType.BOTTOM);
        this.bottomDragNodeIcon = this.node.getChildByName("BottomDragNode").getChildByName("Icon").getComponent(cc.Sprite);

        this.heroDatas = GameConfig.heroInfos;
        this.heroDatas.sort(function (data1, data2) {
            return data1.ShowIndex - data2.ShowIndex;
        });

        //初始化事件
        this.initEvent();

        //加载顶部英雄列表
        this.loadTopHeroList();

        //加载中间英雄列表
        this.loadCenterHeroList();

        //加载底部英雄列表
        this.loadBottomHeroList();

        //刷新顶部Item
        this.updateTopHeroItemList();

        //刷新顶部选中英雄信息
        if (this.heroDatas.length > 0) {
            let heroInfo = this.heroDatas[0];
            this.updateChooseHeroInfo(heroInfo.ID);
            this.updateTopSelectTips(this.curSelectIndex);
        } else {
            this.updateTopSelectTips(-1);
        }

        //刷新中间Item列表
        this.updateCenterHeroItemList();

        //刷新底部Item列表
        this.updateBottomHeroItemList();
    },

    //初始化数据
    initData: function (name) {
        this.name = name;
    },

    //初始化事件
    initEvent: function () {
        //显示拖动节点
        EventManager.Add("ShowDragNode", function (event, data) {
            if (data.type == EnumDefine.DragNodeType.TOP) {
                event.updateTopDragNodeAndShow(data.index, data.hero_id);
            } else {
                event.updateBottomDragNodeAndShow(data.index, data.hero_id);
            }
        }, this);

        //新英雄上阵
        EventManager.Add("HeroEnterCombat", function (event, data) {
            net.EquipHeroReq(data.index, data.hero_id)
        }, this);

        //新英雄下阵
        EventManager.Add("HeroExitCombat", function (event, data) {
            if (DataManager.instance.checkIsFarAttackCell(data.hero_id)) {
                if (DataManager.instance.getCombatCellCount() > 1) {
                    net.UnEquipHeroReq(data.index)
                } else {
                    WindowManager.instance.showTips({
                        desc: "场上必须有一个攻击细胞！",
                    });
                }
            } else {
                net.UnEquipHeroReq(data.index)
            }
        }, this);

        //英雄改变位置
        EventManager.Add("HeroChangePosition", function (event, data) {
            net.ChangePositionReq(data.sourcePosition, data.targetPosition)
        }, this);

        //上阵英雄
        EventManager.Add("SpawnEntity", function (event, data) {
            if (data.Type == EnumDefine.RoleType.CELL) {
                let heroIndex = GameConfig.getHeroIndexWithID(data.RoleID)
                event.updateTopHeroItem(heroIndex, data.RoleID);
                event.updateCenterHeroItem(heroIndex, data.RoleID);
                event.updateBottomHeroItemList();
            }
        }, this);

        //同步英雄信息
        EventManager.Add("SyncPosition", function (event, data) {
            event.updateTopHeroItemList();
            event.updateCenterHeroItemList();
            event.updateBottomHeroItemList();

            event.hideCenterHeroView();
        }, this);

        //刷新当前细胞数量
        EventManager.Add("UpdateTotalKillGermCount", function (event, data) {
            event.updateChooseHeroUnlockTips();
        }, this);

        //关闭窗口
        EventManager.Add("CloseWindow", function (event, data) {
            WindowManager.instance.closeWindow(event.name);
            event.node.destroy();
        }, this);

        //英雄手指触摸提示
        EventManager.Add("HeroTouchStart", function (event, data) {
            event.playTishiAni(data);
        }, this);
    },

    //移除事件
    removeEvent: function () {
        EventManager.Remove("ShowDragNode", this);
        EventManager.Remove("HeroEnterCombat", this);
        EventManager.Remove("HeroExitCombat", this);
        EventManager.Remove("HeroChangePosition", this);
        EventManager.Remove("SpawnEntity", this);
        EventManager.Remove("SyncPosition", this);
        EventManager.Remove("UpdateTotalKillGermCount", this);
        EventManager.Remove("CloseWindow", this);
        EventManager.Remove("HeroTouchStart", this);
    },

    //加载顶部英雄列表
    loadTopHeroList: function () {
        if (this.topHeroItem == null) {
            return;
        }

        for (let index = 0; index < this.heroDatas.length; index++) {
            let heroInfo = this.heroDatas[index];
            if (heroInfo != null) {
                let item = {};
                item.gameObject = cc.instantiate(this.topHeroItem);
                item.button = item.gameObject.getComponent(cc.Button);
                item.mask = item.gameObject.getChildByName("Mask");
                item.lockTips = item.gameObject.getChildByName("LockTips");
                item.battleTips = item.gameObject.getChildByName("BattleTips");
                item.heroIcon = item.gameObject.getChildByName("Icon").getComponent(cc.Sprite);
                item.heroItem = item.gameObject.getComponent(ChooseHeroItem);
                item.heroItem.init(this.topDragNode);
                item.heroItem.setData(index, heroInfo.ID, false);
                item.background = item.gameObject.getChildByName("Background");
                item.backgroundSelect = item.gameObject.getChildByName("Background_Select");

                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "ChooseHeroWindowUI";
                clickEventHandler.handler = "onTopHeroItemClicked";
                clickEventHandler.customEventData = {
                    "index": index,
                    "hero_id": heroInfo.ID
                };

                item.gameObject.setParent(this.topItemContent);

                item.gameObject.setScale(1);

                item.gameObject.setPosition(75 + index * 140, 0);

                item.button.clickEvents.push(clickEventHandler);

                this.topHeroItems.push(item);
            }
        }
    },

    //刷新顶部英雄Item信息
    updateTopHeroItem: function (index, hero_id) {
        let item = this.topHeroItems[index];
        if (item != null) {
            let heroInfo = GameConfig.getHeroInfoWithID(hero_id);
            if (heroInfo != null) {
                ResourceManager.instance.setSpriteWithName(heroInfo.Icon, function (sprite) {
                    item.heroIcon.spriteFrame = sprite;
                    let spriteFrameSize = sprite.getOriginalSize();
                    item.heroIcon.node.width = spriteFrameSize.width * 0.8;
                    item.heroIcon.node.height = spriteFrameSize.height * 0.8;
                });

                let isCombat = DataManager.instance.checkCellIsCombat(hero_id);
                item.battleTips.active = isCombat;

                let isLock = !DataManager.instance.checkCellIsUnlock(hero_id) || (heroInfo.isUnlock == 0);
                item.lockTips.active = isLock;

                if (isLock) {
                    item.mask.active = true;
                } else {
                    item.mask.active = false;
                }

                if (this.curSelectIndex == index) {
                    item.background.active = false;
                    item.backgroundSelect.active = true;
                } else {
                    item.background.active = true;
                    item.backgroundSelect.active = false;
                }

                item.heroItem.setData(index, heroInfo.ID, isLock);

                item.gameObject.active = true;
            }
        }
    },

    //顶部Item点击事件
    onTopHeroItemClicked: function (event, customEventData) {
        this.curSelectIndex = customEventData.index;
        this.updateTopHeroItemList();
        this.updateTopSelectTips(this.curSelectIndex);
        this.updateChooseHeroInfo(customEventData.hero_id);
    },

    //刷新顶部Item选中提示
    updateTopSelectTips: function (index) {
        if (index >= 0) {
            let item = this.topHeroItems[index];
            this.topSelectTips.setParent(item.gameObject);
            this.topSelectTips.setPosition(0, 96.5);
        } else {
            this.topSelectTips.active = false;
        }
    },

    //刷新顶部列表
    updateTopHeroItemList: function () {
        for (let index = 0; index < this.heroDatas.length; index++) {
            if (this.heroDatas[index] != null) {
                this.updateTopHeroItem(index, this.heroDatas[index].ID);
            } else {
                this.updateTopHeroItem(index, -1);
            }
        }
    },

    //加载中间英雄列表
    loadCenterHeroList: function () {
        if (this.centerHeroItem == null) {
            return;
        }

        let parent = this.node.getChildByName("HeroList_Center").getChildByName("Layout");
        for (let index = 0; index < this.heroDatas.length; index++) {
            let heroInfo = this.heroDatas[index];
            if (heroInfo != null) {
                let item = {};
                item.gameObject = cc.instantiate(this.centerHeroItem);
                item.button = item.gameObject.getComponent(cc.Button);
                item.mask = item.gameObject.getChildByName("Mask");
                item.lockTips = item.gameObject.getChildByName("LockTips");
                item.battleTips = item.gameObject.getChildByName("BattleTips");
                item.heroIcon = item.gameObject.getChildByName("Icon").getComponent(cc.Sprite);
                item.heroID = 0;

                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "ChooseHeroWindowUI";
                clickEventHandler.handler = "onCenterHeroItemClicked";
                clickEventHandler.customEventData = {
                    "index": index,
                    "hero_id": heroInfo.ID,
                };

                item.button.clickEvents.push(clickEventHandler);

                item.gameObject.setParent(parent);

                item.gameObject.setScale(1);

                this.centerHeroItems.push(item);
            }
        }
    },

    //刷新中部英雄Item
    updateCenterHeroItem: function (index, hero_id) {
        let item = this.centerHeroItems[index];
        if (item != null) {
            let heroInfo = GameConfig.getHeroInfoWithID(hero_id)
            if (heroInfo != null) {
                item.heroID = hero_id;

                ResourceManager.instance.setSpriteWithName(heroInfo.Icon, function (sprite) {
                    item.heroIcon.spriteFrame = sprite;
                });

                let isCombat = DataManager.instance.checkCellIsCombat(hero_id);
                item.battleTips.active = isCombat;

                let isLock = !DataManager.instance.checkCellIsUnlock(hero_id) || (heroInfo.isUnlock == 0);
                item.lockTips.active = isLock;

                if (isCombat || isLock) {
                    item.mask.active = true;
                    item.button.interactable = false;
                } else {
                    item.mask.active = false;
                    item.button.interactable = true;
                }

                item.gameObject.active = true;
            }
        }
    },

    //中间Item点击事件
    onCenterHeroItemClicked: function (event, customEventData) {
        net.EquipHeroReq(this.centerSelectIndex, customEventData.hero_id);
    },

    //隐藏中间列表
    hideCenterHeroView: function () {
        this.centerHeroView.active = false;
    },

    //刷新中间列表
    updateCenterHeroItemList: function () {
        for (let index = 0; index < this.heroDatas.length; index++) {
            if (this.heroDatas[index] != null) {
                this.updateCenterHeroItem(index, this.heroDatas[index].ID);
            } else {
                this.updateCenterHeroItem(index, -1);
            }
        }
    },

    //加载底部英雄列表
    loadBottomHeroList: function () {
        for (let index = 0; index < MAX_COMBAT_HERO_COUNT; index++) {
            let item = {};
            item.gameObject = this.node.getChildByName("HeroList_Bottom").getChildByName("Background").getChildByName(index.toString());
            item.chooseBtn = item.gameObject.getChildByName("ChooseBtn");
            item.combatCell = item.gameObject.getChildByName("CombatCell");
            item.tishiNode = item.gameObject.getChildByName("tishi");
            item.heroIcon = item.combatCell.getChildByName("Icon").getComponent(cc.Sprite);
            item.heroName = item.combatCell.getChildByName("Name").getComponent(cc.Label);
            item.heroItem = item.combatCell.getComponent(ChooseHeroItem);
            item.heroItem.init(this.bottomDragNode);
            item.heroID = -1;

            this.bottomHeroItems.push(item);
        }
    },

    //刷新底部英雄Item
    updateBottomHeroItem: function (index, hero_id) {
        let item = this.bottomHeroItems[index];
        if (item != null) {
            if (hero_id < 0) {
                item.chooseBtn.active = true;
                item.combatCell.active = false;
                item.heroID = -1;
            } else {
                item.chooseBtn.active = false;
                item.combatCell.active = true;
                let heroInfo = GameConfig.getHeroInfoWithID(hero_id);
                if (heroInfo != null) {
                    item.heroName.string = heroInfo.Name;
                    ResourceManager.instance.setSpriteWithName(heroInfo.Gaine, function (sprite) {
                        item.heroIcon.spriteFrame = sprite;
                    });
                }

                item.heroItem.setData(index, hero_id, false);
            }
        }
    },

    playTishiAni: function (isPlay) {
        for (let index = 0; index < this.bottomHeroItems.length; index++) {
            this.bottomHeroItems[index].tishiNode.active = isPlay;
            if (isPlay) {
                this.bottomHeroItems[index].tishiNode.getComponent(cc.Animation).play();
            }
        }
    },

    onBottomHeroItemClicked: function (event, customEventData) {
        this.centerSelectIndex = parseInt(customEventData);
        this.centerHeroView.active = true;
        WindowManager.instance.windowAniPlay(this.centerHeroView);
    },

    //刷新底部英雄列表
    updateBottomHeroItemList: function () {
        for (let index = 0; index < MAX_COMBAT_HERO_COUNT; index++) {
            if (DataManager.instance.combatCells[index] != null) {
                if (DataManager.instance.combatCells[index].RoleID != 0) {
                    this.updateBottomHeroItem(index, DataManager.instance.combatCells[index].RoleID);
                } else {
                    this.updateBottomHeroItem(index, -1);
                }
            } else {
                this.updateBottomHeroItem(index, -1);
            }
        }
    },

    //从底部英雄Item获取上面的英雄id
    getHeroIdFromBottomItem: function (index) {
        let item = this.bottomHeroItems[index];
        if (item != null) {
            return item.heroID;
        }

        return 0;
    },

    //更新选中的英雄信息
    updateChooseHeroInfo: function (hero_id) {
        if (this.heroDatas == null) {
            return;
        }

        let self = this;
        let heroInfo = GameConfig.getHeroInfoWithID(hero_id)

        this.chooseHeroName.string = heroInfo.Name;
        this.chooseHeroIntroduce.string = heroInfo.Desc;
        ResourceManager.instance.setSpriteWithName(heroInfo.Character, function (sprite) {
            self.chooseHeroCharacter.spriteFrame = sprite
        });
        this.chooseHeroTitle.string = heroInfo.Title;
        this.chooseHeroEffectOfTheBattle.string = heroInfo.EffectOfTheBattle;

        this.updateChooseHeroUnlockTips();
    },

    //刷新英雄解锁
    updateChooseHeroUnlockTips: function () {
        let item = this.topHeroItems[this.curSelectIndex];
        if (item != null) {
            let hero_id = item.heroItem.getHeroID();
            let heroInfo = GameConfig.getHeroInfoWithID(hero_id);
            if (heroInfo != null) {
                if (heroInfo.isUnlock == 0) {
                    this.chooseHeroTips.active = false;
                    this.chooseHeroKillGermCount.node.active = false;
                } else {
                    let isLock = !DataManager.instance.checkCellIsUnlock(hero_id);
                    if (isLock) {
                        this.chooseHeroTips.active = true;
                        this.chooseHeroKillGermCount.string = (DataManager.instance.totalKillGermCount.toString() + "/" + heroInfo.Condition.toString());
                        if (this.chooseHeroKillGermCount.node.active == false) {
                            this.chooseHeroKillGermCount.node.active = true;
                        }
                    } else {
                        this.chooseHeroTips.active = false;
                        this.chooseHeroKillGermCount.node.active = false;
                    }
                }
            }
        }
    },

    //刷新并显示上阵拖动节点上的信息
    updateTopDragNodeAndShow: function (index, hero_id) {
        let self = this;
        let heroInfo = GameConfig.getHeroInfoWithID(hero_id);
        if (heroInfo == null) {
            console.logError("Can not get hero info from config.");
            return;
        }

        ResourceManager.instance.setSpriteWithName(heroInfo.Icon, function (sprite) {
            self.topDragNodeIcon.spriteFrame = sprite;
            let spriteFrameSize = sprite.getOriginalSize();
            self.topDragNodeIcon.node.width = spriteFrameSize.width * 0.8;
            self.topDragNodeIcon.node.height = spriteFrameSize.height * 0.8;
        });

        let item = this.topHeroItems[index]
        let temp = this.topItemContent.position.x + item.gameObject.position.x;
        this.topDragNode.node.position = cc.v2(temp, -174);

        if (this.curSelectIndex == index) {
            this.topBackground.active = false;
            this.topBackgroundSelect.active = true;
        } else {
            this.topBackground.active = true;
            this.topBackgroundSelect.active = false;
        }

        this.topDragNode.node.active = true;
    },

    //刷新并显示下阵拖动节点上的信息
    updateBottomDragNodeAndShow: function (index, hero_id) {
        let self = this;
        let heroInfo = GameConfig.getHeroInfoWithID(hero_id);
        if (heroInfo == null) {
            console.logError("Can not get hero info from config.");
            return;
        }

        let spriteFrame = ResourceManager.instance.setSpriteWithName(heroInfo.Gaine, function (sprite) {
            self.bottomDragNodeIcon.spriteFrame = sprite;
            let spriteFrameSize = sprite.getOriginalSize();
            self.bottomDragNodeIcon.node.width = spriteFrameSize.width;
            self.bottomDragNodeIcon.node.height = spriteFrameSize.height;
            self.bottomDragNode.node.position = cc.v2(120 * index - 240, -453);
            self.bottomDragNode.node.active = true;
        });
    },

    //关闭英雄界面
    closeWindow: function () {
        WindowManager.instance.closeWindow(this.name);
        this.node.destroy();
    },

    //销毁界面时被调用
    onDestroy: function () {
        this.removeEvent();
    },
});