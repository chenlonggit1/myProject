var uitl = require("util")
var EnumDefine = require("EnumDefine")
var GameConfig = require("GameConfig")
var EventManager = require("EventManager")

const cardCount = 16;

var DataManager = cc.Class({
    extends: cc.Component,

    properties: {},

    statics: {
        instance: null,
    },

    onLoad: function () {
        //设置单例
        DataManager.instance = this;

        this.unionid = "";

        this.openid = "";

        this.nickName = "";

        this.headUrl = "";

        this.cert = "";

        //战斗中的细胞
        this.combatCells = [];

        //即将上阵的细胞
        this.willCombatCells = [];

        //战斗中的细胞实体
        this.combatCellEntitys = [];

        //战斗中的细菌实体
        this.combatGermEntitys = [];

        //已经解锁的英雄列表
        this.unlockCellList = [];

        //当前关卡数
        this.round = 0;

        //关卡ID
        this.level = 0;

        //关卡类型
        this.levelType = 0;

        //金币
        this.money = 0;

        //点券
        this.voucher = 0;

        //卡牌信息
        this.cards = [];

        //倍率索引
        this.multipleIndex = 0;

        //卡牌对应实体ID
        this.cardEntityIdList = [];

        //正在刷新场景
        this.isRefreshScene = false;

        //可以刷新
        this.isCanRefresh = true;

        //细胞攻击类型
        this.cellAttackStyle = EnumDefine.CellAttackStyle.CLICK_INTERVAL;

        //待攻击细胞实体ID列表
        this.beAttackCells = [];

        //当前正在受击的细菌
        this.curAttackedGerm = -1;

        //待攻击细菌实体ID列表
        this.beAttackGerms = [];

        //当前声音设置
        this.isPlayMusic = true;

        //跳过动画设置
        this.isSkipAni = false;

        //客户端缓存金币
        this.clientMoney = 0;

        //自动攻击总时间
        this.autoAttackTotalTime = 0;

        //自动翻牌总时间
        this.autoOpenCardTotalTime = 0;

        //是否可以刷新翻牌总时间
        this.isCanUpdateOpenCardTotalTime = false;

        //当前点击的卡牌索引
        this.curTouchCardItemIndex = -1;

        //自动兑换
        this.audtoDuiHuan = false;

        //当前总击杀细菌数量
        this.totalKillGermCount = 0;

        //当前是否可以攻击细菌
        this.isCanAttackGerm = true;

        //剧情状态
        this.isStoryDataStatus = false;

        //进入剧情前攻击类型
        this.storyAttackStyle = EnumDefine.CellAttackStyle.CLICK_INTERVAL;

        //小丑模式免费翻牌轮数
        this.JokerFreeAmount = 0;

        //小丑模式当前回合
        this.jokerCurrentRound = 0;

        //是否处于小丑模式下
        this.isJokerFreeStatus = false;

        //小丑模式下翻到小王增加的次数
        this.jokerCreaseFreeAmountDatas = [];

        //是否在播放小丑模式增加次数动画
        this.isPlayingCreaseFreeAmountAnim = false;

        //小丑剧情每一轮的卡牌数据
        this.jokerCardDatas = [];

        //小丑剧情总奖励
        this.jokerTotalRewardAmount = 0;

        //小丑剧情同步金币
        this.jokerMoney = 0;
    },

    //获取点券
    getVoucher: function () {
        return this.voucher;
    },

    //设置点券
    setVoucher: function (voucher) {
        this.voucher = voucher;
        if (this.voucher < 0) {
            this.voucher = 0;
        }
    },

    //获取金币
    getMoney: function () {
        return this.money;
    },

    //设置金币
    setMoney: function (money) {
        this.money = money;
        if (this.money < 0) {
            this.money = 0;
        }
    },

    //获取客户端金币
    getClientMoney: function () {
        return this.clientMoney;
    },

    //设置客户端金币
    setClientMoney: function (clientMoney) {
        this.clientMoney = clientMoney;
        if (this.clientMoney < 0) {
            this.clientMoney = 0;
        }
    },

    //同步细胞信息
    synCombatCell: function (data) {
        this.combatCells[data.Position] = data;
    },

    //根据索引获取细胞信息
    getCombatCellWithIndex: function (tempIndex) {
        for (let index = 0; index < this.combatCells.length; index++) {
            if (this.combatCells[index].Position == tempIndex) {
                return this.combatCells[index];
            }
        }

        return null;
    },

    //根据角色ID获取细胞的位置索引
    getCombatCellPositionWithRoleID: function (role_id) {
        let position = -1;
        for (let index = 0; index < this.combatCells.length; index++) {
            if (this.combatCells[index].RoleID == role_id) {
                position = this.combatCells[index].Position;
            }
        }

        console.log("getCombatCellPositionWithRoleID position = " + position)
        return position;
    },

    //同步细胞实体信息
    synCombatCellEntity: function (data) {
        let temp = null;
        let tempIndex = -1;
        for (let index = 0; index < this.combatCellEntitys.length; index++) {
            if (this.combatCellEntitys[index] != null) {
                if (this.combatCellEntitys[index].ID == data.ID) {
                    temp = this.combatCellEntitys[index];
                    tempIndex = index;
                    break;
                }
            }
        }

        if (temp == null) {
            this.combatCellEntitys.push(data);
        } else {
            this.combatCellEntitys[tempIndex] = temp;
        }
    },

    //同步细菌实体信息
    synCombatGermEntity: function (data) {
        let temp = null;
        let tempIndex = -1;
        for (let index = 0; index < this.combatGermEntitys.length; index++) {
            if (this.combatGermEntitys[index] != null) {
                if (this.combatGermEntitys[index].ID == data.ID) {
                    temp = this.combatGermEntitys[index];
                    tempIndex = index;
                    break;
                }
            }
        }

        if (temp == null) {
            this.combatGermEntitys.push(data);
        } else {
            this.combatGermEntitys[tempIndex] = temp;
        }
    },

    //随机出一个被攻击的细菌返回该实体的ID
    randomAttackedGerm: function () {
        if (this.combatGermEntitys.length == 1) {
            return this.combatGermEntitys[0].ID;
        } else if (this.combatGermEntitys.length > 1) {
            let index = uitl.random(0, this.combatGermEntitys.length - 1);
            return this.combatGermEntitys[index].ID;
        } else {
            return -1;
        }
    },

    //杀死角色实体（现在只有细菌会死亡）
    killEntity: function (entity_id) {
        let entity = null;
        let isDeal = false;
        for (let index = 0; index < this.combatCellEntitys.length; index++) {
            if (this.combatCellEntitys[index].ID == entity_id) {
                entity = this.combatCellEntitys[index];
                this.combatCellEntitys.splice(index, 1)
                isDeal = true;
                break;
            }
        }

        if (isDeal == false) {
            for (let index = 0; index < this.combatGermEntitys.length; index++) {
                if (this.combatGermEntitys[index].ID == entity_id) {
                    entity = this.combatGermEntitys[index];
                    this.combatGermEntitys.splice(index, 1)
                    isDeal = true;
                    break;
                }
            }
        }

        return entity;
    },

    //刷新卡片信息
    updataCard: function (cardData) {
        for (let index = 0; index < this.cards.length; index++) {
            if (this.cards[index].Index == cardData.Index) {
                this.cards[index] = cardData;
                break;
            }
        }
    },

    //初始化卡牌对应实体ID信息
    initCardEntityIdList: function () {
        for (let cardIndex = 0; cardIndex < cardCount; ++cardIndex) {
            this.cardEntityIdList[cardIndex] = 0;
        }
    },

    //刷新卡牌对应实体ID信息
    updataCardEntityIdList: function (cardIndex, entityId) {
        for (let index = 0; index < cardCount; index++) {
            if (index == cardIndex) {
                this.cardEntityIdList[index] = entityId;
                break;
            }
        }
    },

    //根据卡牌ID获取对应的实体ID
    getCardEntityIDWithIndex: function (cardIndex) {
        for (let index = 0; index < this.cardEntityIdList.length; index++) {
            if (index == cardIndex) {
                return this.cardEntityIdList[index];
            }
        }

        return -1;
    },

    //根据实体ID获取对应的卡牌ID
    getIndexWithCardEntityID: function (entityID) {
        for (let index = 0; index < this.cardEntityIdList.length; index++) {
            if (this.cardEntityIdList[index] == entityID) {
                return index;
            }
        }

        return -1;
    },

    //刷新解锁的细胞列表
    updateUnlockCellList: function (data) {
        let isExist = false;
        for (let index = 0; index < this.unlockCellList.length; index++) {
            if (this.unlockCellList[index] == data) {
                this.unlockCellList[index] = data;
                isExist = true;
            }
        }

        if (!isExist) {
            this.unlockCellList.push(data);
        }
    },

    //检测英雄是否已经上阵
    checkCellIsCombat: function (hero_id) {
        for (let index = 0; index < this.combatCells.length; index++) {
            if (this.combatCells[index].RoleID == hero_id) {
                return true;
            }
        }

        return false;
    },

    //根据位置检测英雄是否已经上阵
    checkCellIsCombatWithPosition: function (position) {
        if (position < 0 || position > 4) {
            return false;
        }

        return this.combatCells[position].RoleID > 0;
    },

    //检测英雄是否解锁
    checkCellIsUnlock: function (hero_id) {
        for (let index = 0; index < this.unlockCellList.length; index++) {
            if (this.unlockCellList[index] == hero_id) {
                return true;
            }
        }

        return false;
    },

    //获取战斗中的细胞数量
    getCombatCellCount: function () {
        let combatCellCount = 0;
        for (let index = 0; index < this.combatCells.length; index++) {
            if (this.combatCells[index].RoleID > 0) {
                let roleInfo = GameConfig.getHeroInfoWithID(this.combatCells[index].RoleID)
                if (roleInfo.AttackType == EnumDefine.RoleAttackType.FAR_ATTACK) {
                    combatCellCount++;
                }
            }
        }

        return combatCellCount;
    },

    //检测是否为战斗英雄
    checkIsFarAttackCell: function (hero_id) {
        for (let index = 0; index < GameConfig.heroInfos.length; index++) {
            if (GameConfig.heroInfos[index].ID == hero_id) {
                let roleInfo = GameConfig.getHeroInfoWithID(hero_id)
                if (roleInfo != null && roleInfo.AttackType == EnumDefine.RoleAttackType.FAR_ATTACK) {
                    return true;
                }
            }
        }

        return false;
    },

    //刷新英雄攻击方式
    updateCellAttackStyle: function (cellAttackStyle) {
        if (cellAttackStyle == this.cellAttackStyle) {
            return false;
        }

        this.cellAttackStyle = cellAttackStyle;

        this.curAttackedGerm = -1;

        EventManager.Dispatch("UpdateCellAttackStyle", cellAttackStyle);

        return true;
    },

    //获取英雄攻击方式
    getCellAttackStyle: function () {
        return this.cellAttackStyle;
    },

    //检测是否为自动攻击模式
    checkIsAutomaticStyle: function () {
        return this.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC;
    },

    //刷新可被攻击的细胞列表
    updateBeAttackCells: function (entity_id, isCombat) {
        if (isCombat) {
            //上阵英雄
            this.beAttackCells.push(entity_id);
        } else {
            for (let index = this.beAttackCells.length - 1; index >= 0; index--) {
                if (this.beAttackCells[index] == entity_id) {
                    this.beAttackCells.splice(index, 1);
                    break;
                }
            }
        }
    },

    //刷新可被攻击的细菌列表
    updateBeAttackGerms: function (entity_id, isCombat) {
        if (isCombat) {
            //上阵英雄
            this.beAttackGerms.push(entity_id);
        } else {
            for (let index = this.beAttackGerms.length - 1; index >= 0; index--) {
                if (this.beAttackGerms[index] == entity_id) {
                    this.beAttackGerms.splice(index, 1);
                }
            }
        }
    },

    //检测是否为自动攻击模式
    checkIsAutimaticStyle: function () {
        return this.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC;
    },

    //随机一个被攻击的细胞
    randomAttackedCell: function () {
        let entity_id = -1;
        if (this.beAttackCells.length == 1) {
            entity_id = this.beAttackCells[0];
        } else if (this.beAttackCells.length > 1) {
            let index = uitl.random(0, this.beAttackCells.length - 1);

            entity_id = this.beAttackCells[index]
        }

        return entity_id;
    },

    //根据实体ID获取实体类型
    getEntityTypeWithEntityId: function (entity_id) {
        let isDealWith = false;
        let type = EnumDefine.RoleType.NONE;


        for (let index = 0; index < this.beAttackCells.length; index++) {
            if (this.beAttackCells[index] == entity_id) {
                type = EnumDefine.RoleType.CELL;
                isDealWith = true;
                break;
            }
        }

        if (!isDealWith) {
            for (let index = 0; index < this.beAttackGerms.length; index++) {
                if (this.beAttackGerms[index] == entity_id) {
                    type = EnumDefine.RoleType.GERM;
                    isDealWith = true;
                    break;
                }
            }
        }

        return type;
    },

    //小丑模式下获取卡牌数据
    getJokerCardDataWithIndex: function (cardIndex) {
        for (let index = 0; index < this.jokerCardDatas.length; index++) {
            if (index == cardIndex) {
                return this.jokerCardDatas[cardIndex];
            }
        }

        return null;
    },

    //刷新后重置数据
    resetDataAfterRefresh: function () {
        this.curAttackedGerm = -1;
        this.beAttackCells = [];
        this.beAttackGerms = [];
        this.combatCellEntitys = [];
        this.combatGermEntitys = [];
        this.initCardEntityIdList();
    },

    //重置小丑数据
    clearJokerStatusData: function () {
        this.JokerFreeAmount = 0;
        this.jokerCurrentRound = 0;
        this.isJokerFreeStatus = false;
        this.jokerCreaseFreeAmountDatas = [];
        this.isPlayingCreaseFreeAmountAnim = false;
        this.jokerCardDatas = [];
        this.jokerTotalRewardAmount = 0;
    },

    //重置所有数据
    resetAllData: function () {
        this.combatCells = [];
        this.willCombatCells = [];
        this.combatCellEntitys = [];
        this.combatGermEntitys = [];
        this.unlockCellList = [];
        this.round = 0;
        this.level = 0;
        this.levelType = 0;
        this.money = 0;
        this.voucher = 0;
        this.multipleIndex = 0;
        this.cardEntityIdList = [];
        this.isRefreshScene = false;
        this.isCanRefresh = true;
        this.cellAttackStyle = EnumDefine.CellAttackStyle.CLICK_INTERVAL;
        this.beAttackCells = [];
        this.curAttackedGerm = -1;
        this.beAttackGerms = [];
        this.clientMoney = 0;
        this.autoAttackTotalTime = 0;
        this.autoOpenCardTotalTime = 0;
        this.isCanUpdateOpenCardTotalTime = false;
        this.curTouchCardItemIndex = -1;
        this.initCardEntityIdList();
    }
});