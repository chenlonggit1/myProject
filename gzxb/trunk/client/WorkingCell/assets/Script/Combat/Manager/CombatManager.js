var util = require("util")
var BaseRole = require("BaseRole")
var GameConfig = require("GameConfig")
var EnumDefine = require("EnumDefine")
var DataManager = require("DataManager")
var BuffManager = require("BuffManager")
var EventManager = require("EventManager")
var MultipleRateUI = require("MultipleRateUI")
var ResourceManager = require("ResourceManager")
var AudioManager = require("AudioManager")
var CombatEffectManager = require("CombatEffectManager")

const ATTACK_CLICK_CARD_INTERVAL = 0.3; //自动攻击选中卡牌模式攻击间隔

const AUTOMATIC_INTERVAL = 0.3; //全自动模式攻击间隔

const ATTACK_OPEN_CARD_INTERVAL = 0.5; //自动翻牌时间间隔

const GERM_OFFSET_MIN = -280; //细菌落点偏移值最小值

const GERM_OFFSET_MAX = 20; //细菌落点偏移值最大值

const GERM_DISAPPEAR_ASSET_NAME = "ef_guaixiaoshi";

var CombatManager = cc.Class({
    extends: cc.Component,

    onLoad: function () {
        this.isCanCombat = false; //是否可以战斗（因为怪物需要移动到指定点后才能开始攻击）

        //战斗节点
        this.cellLayer = this.node.getChildByName('cellLayer');
        this.germLayer = this.node.getChildByName('germLayer');
        //飘分
        this.cellPiaofen = this.node.getChildByName("cellPiaofen");
        this.germPiaofen = this.node.getChildByName("germPiaofen");

        //细胞实体
        this.cellEntitys = [];

        //未激活的细胞实体
        this.inactiveCellEntitys = {};

        //细菌实体
        this.germEntitys = [];

        //未激活的细菌实体
        this.inactiveGermEntitys = {};

        //自动攻击时间
        this.autoAttackTime = 0;

        //是否可以刷新自动攻击总时间
        this.isCanUpdateAutoAttackTotalTime = false;

        //细胞场景Buff管理器
        this.cellSceneBuffManager = this.node.getChildByName("cellSceneBuffManager").getComponent(BuffManager);
        this.cellSceneBuffManager.init(GameConfig.CellSceneBuffManagerID);

        //细菌场景Buff管理器
        this.germSceneBuffManager = this.node.getChildByName("germSceneBuffManager").getComponent(BuffManager);
        this.germSceneBuffManager.init(GameConfig.GermSceneBuffManagerID);

        //技能特效管理器
        this.combatEffectManager = this.node.getComponent(CombatEffectManager);
        this.combatEffectManager.init(this);

        //注册事件
        this.initEvent();
    },

    start: function () {
        var canvas = cc.director.getScene().getChildByName('Canvas');
        if (canvas != null) {
            let node = canvas.getChildByName("MultipleRate").getChildByName("MultipleRateUI");
            if (node != null) {
                this.multipleRate = node.getComponent(MultipleRateUI);
                if (this.multipleRate != null) {
                    this.multipleRate.updateMultipLeRate();
                    this.multipleRate.updataSlect();
                }
            }
        }
    },

    //注册事件
    initEvent: function () {
        EventManager.Add("GameBegin", function (event, data) {
            event.updateAutoOpenCardTime();
        }, this);

        EventManager.Add("GameEnd", function (event, data) {
            event.isCanCombat = false;
            EventManager.Dispatch("PutSkillEffect");

            //隐藏细胞实体
            for (let index = event.cellEntitys.length - 1; index >= 0; index--) {
                event.cellEntitys[index].unscheduleAllCallbacks();
                event.cellEntitys[index].node.color = cc.Color.WHITE;
                event.cellEntitys[index].updateCurrentHp(0);
                event.cellEntitys[index].node.active = false;
                event.cellEntitys[index].node.stopAllActions();
                event.removeNaturalBuff(event.cellEntitys[index].getID(), event.cellEntitys[index].getRoleType());
                event.putEntityToInactiveCell(event.cellEntitys[index]);
                event.cellEntitys.splice(index, 1);
            }

            //隐藏细菌实体
            for (let index = event.germEntitys.length - 1; index >= 0; index--) {
                event.germEntitys[index].unscheduleAllCallbacks();
                event.germEntitys[index].updateCurrentHp(0);
                event.germEntitys[index].node.active = false;
                event.germEntitys[index].node.stopAllActions();
                event.putEntityToInactiveGerm(event.germEntitys[index]);
                event.germEntitys.splice(index, 1);
            }
        }, this);

        //剧情隐藏细菌
        EventManager.Add("EnterPlot", function (event, data) {
            event.isCanCombat = false;
            //隐藏细菌实体
            for (let index = event.germEntitys.length - 1; index >= 0; index--) {
                event.germEntitys[index].updateCurrentHp(0);
                event.germEntitys[index].node.active = false;
                event.germEntitys[index].node.stopAllActions();
                event.putEntityToInactiveGerm(event.germEntitys[index]);
                event.germEntitys.splice(index, 1);
            }
        }, this);

        //更新战斗状态
        EventManager.Add("UpdateCombatState", function (event, data) {
            if (data != event.isCanCombat) {
                event.updateIsCanCombat(data);
            }
        }, this);

        //生成实体
        EventManager.Add("SpawnEntity", function (event, data) {
            if (data.Type == EnumDefine.RoleType.CELL) {
                event.createNormalCell(data);
            } else {
                event.createGerm(data);
            }

            //创建天赋Buff
            event.createNaturalBuff(data.RoleID, data.ID);
        }, this);

        //杀死细胞实体
        EventManager.Add("KillCellEntity", function (event, data) {
            let cell = null;
            for (let index = 0; index < event.cellEntitys.length; index++) {
                if (event.cellEntitys[index].getEntityID() == data.EntityID) {
                    cell = event.cellEntitys[index];
                    cell.updateCurrentHp(0);
                    event.cellEntitys.splice(index, 1);
                    break;
                }
            }

            if (cell != null) {
                cell.stopCombat();
                cell.changeState(EnumDefine.RoleState.DEAD);
                cell.node.active = false;
                event.putEntityToInactiveCell(cell);
                event.removeNaturalBuff(cell.getID(), cell.getRoleType());
            }
        }, this);

        //杀死细菌实体
        EventManager.Add("KillGermEntity", function (event, data) {
            let germ = null;
            for (let index = 0; index < event.germEntitys.length; index++) {
                if (event.germEntitys[index].getEntityID() == data.EntityID) {
                    germ = event.germEntitys[index];
                    germ.updateCurrentHp(0);
                    event.germEntitys.splice(index, 1);
                    break;
                }
            }

            if (germ != null) {
                germ.stopCombat();

                if (data.Normal) {
                    //被击杀
                    germ.changeState(EnumDefine.RoleState.DEAD, function () {
                        germ.node.active = false;
                        event.putEntityToInactiveGerm(germ);
                        event.removeNaturalBuff(germ.getID(), germ.getRoleType());
                    });

                    event.node.runAction(cc.sequence(
                        cc.delayTime(0.6),
                        cc.callFunc(function () {
                            EventManager.Dispatch("GermDieEffect", germ.node);
                        })));
                } else {
                    //倒计时完怪物消失
                    germ.changeState(EnumDefine.RoleState.IDLE);

                    //播放消失特效
                    event.playGermDisappearEffect(germ);

                    //隐藏细胞
                    germ.node.active = false;
                    event.putEntityToInactiveGerm(germ);
                    event.removeNaturalBuff(germ.getID(), germ.getRoleType());
                }
            }

            //重新设置当前被攻击的细细菌
            if (event.germEntitys.length == 0) {
                EventManager.Dispatch("UpdateCombatState", false)
            }
        }, this);

        //切换攻击细胞
        EventManager.Add("startAttackGerm", function (event, data) {
            event.farCellStartCombat(data);
            AudioManager.instance.playotherAudio("attack_germ");
        }, this);

        //创建Buff
        EventManager.Add("CreateBuff", function (event, data) {
            if (data.buff_target_type == EnumDefine.BuffTargetType.SCENE) {
                if (data.entity_type == EnumDefine.RoleType.CELL) {
                    event.cellSceneBuffManager.addBuff(data.buff_info.ID)
                } else {
                    event.germSceneBuffManager.addBuff(data.buff_info.ID)
                }

                if (data.buff_info.Type == EnumDefine.BuffType.INCREASE_AUTO_ATTACK_SPEED) {
                    event.updateAutoAttackTotalTime();
                } else if (data.buff_info.Type == EnumDefine.BuffType.INCREASE_OPEN_CARD_SPEED) {
                    event.updateAutoOpenCardTime();
                }
            } else if (data.buff_target_type == EnumDefine.BuffTargetType.HERO) {
                if (data.entity_type == EnumDefine.RoleType.CELL) {
                    for (let jndex = 0; jndex < event.cellEntitys.length; jndex++) {
                        event.cellEntitys[jndex].addBuffToHero(data.buff_info.ID);
                    }
                } else {
                    for (let jndex = 0; jndex < event.germEntitys.length; jndex++) {
                        event.germEntitys[jndex].addBuffToHero(data.buff_info.ID);
                    }
                }
            }

            //刷新倍率UI
            if (event.multipleRate != null) {
                event.multipleRate.updataSlect();
                event.multipleRate.updateMultipLeRate();
            }
        }, this);

        //创建Buff
        EventManager.Add("RemoveBuff", function (event, data) {
            if (data.Type == EnumDefine.BuffType.INCREASE_AUTO_ATTACK_SPEED) {
                event.updateAutoAttackTotalTime();
            } else if (data.Type == EnumDefine.BuffType.INCREASE_OPEN_CARD_SPEED) {
                event.updateAutoOpenCardTime();
            }

            //刷新倍率UI
            if (event.multipleRate != null) {
                event.multipleRate.updataSlect();
                event.multipleRate.updateMultipLeRate();
            }
        }, this);

        //切换游戏模式
        EventManager.Add("UpdateCellAttackStyle", function (event, data) {
            event.autoAttackTime = 0;
            event.updateAutoAttackTotalTime();

            event.cellStopCombat();

            if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC) {
                if (event.isCanCombat) {
                    event.nearCellStartCombat();
                }
            }
        }, this);

        //修改英雄位置
        EventManager.Add("ChangeHeroPosition", function (event, data) {
            for (let index = 0; index < event.cellEntitys.length; index++) {

                if (data.SourceEntityID > 0) {
                    if (event.cellEntitys[index].getEntityID() == data.SourceEntityID) {
                        event.cellEntitys[index].node.setPosition(GameConfig.cellPosition[data.TargetPosition].x, GameConfig.cellPosition[data.TargetPosition].y);
                        event.cellEntitys[index].node.zIndex = data.TargetPosition;
                    }
                }

                if (data.TargetEntityID > 0) {
                    if (event.cellEntitys[index].getEntityID() == data.TargetEntityID) {
                        event.cellEntitys[index].node.setPosition(GameConfig.cellPosition[data.SourcePosition].x, GameConfig.cellPosition[data.SourcePosition].y);
                        event.cellEntitys[index].node.zIndex = data.SourcePosition;
                    }
                }
            }
        }, this);

        //修改倍率
        EventManager.Add("UpdateRatio", function (event, data) {
            if (event.multipleRate != null) {
                event.multipleRate.updataSlect();
            }
        }, this);

        //强制刷新自动攻击事件
        EventManager.Add("ForceClearAutoAttackTime", function (event, data) {
            event.autoAttackTime = 0;
        }, this);
    },

    removeEvent: function () {
        EventManager.Remove("GameBegin", this);
        EventManager.Remove("GameEnd", this);
        EventManager.Remove("EnterPlot", this);
        EventManager.Remove("UpdateCombatState", this);
        EventManager.Remove("SpawnEntity", this);
        EventManager.Remove("KillCellEntity", this);
        EventManager.Remove("KillGermEntity", this);
        EventManager.Remove("startAttackGerm", this);
        EventManager.Remove("CreateBuff", this);
        EventManager.Remove("RemoveBuff", this);
        EventManager.Remove("UpdateCellAttackStyle", this);
        EventManager.Remove("ChangeHeroPosition", this);
        EventManager.Remove("UpdateRatio", this);
        EventManager.Remove("ForceClearAutoAttackTime", this);
    },

    update: function (dt) {
        if (this.isCanCombat) {
            this.autoAttackTime += dt;
            if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.ATTACK_CLICK_CARD) {
                if (this.isCanUpdateAutoAttackTotalTime) {
                    DataManager.instance.autoAttackTotalTime = ATTACK_CLICK_CARD_INTERVAL * this.getIncreaseAutoAttackSpeed();
                    this.isCanUpdateAutoAttackTotalTime = false;
                    EventManager.Dispatch("UpdateCombatAnimTime", DataManager.instance.autoAttackTotalTime);
                }
                if (this.autoAttackTime >= DataManager.instance.autoAttackTotalTime) {
                    this.autoAttackTime -= DataManager.instance.autoAttackTotalTime;
                    if (DataManager.instance.beAttackGerms.length > 0) {
                        if (DataManager.instance.curAttackedGerm <= 0) {
                            return;
                        }

                        let tempIndex = DataManager.instance.getIndexWithCardEntityID(DataManager.instance.curAttackedGerm);
                        if (tempIndex >= 0) {
                            EventManager.Dispatch('startAttackGerm', DataManager.instance.curAttackedGerm);
                        }
                    }
                }
            } else if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC) {
                if (this.isCanUpdateAutoAttackTotalTime) {
                    DataManager.instance.autoAttackTotalTime = AUTOMATIC_INTERVAL * this.getIncreaseAutoAttackSpeed();
                    this.isCanUpdateAutoAttackTotalTime = false;
                    EventManager.Dispatch("UpdateCombatAnimTime", DataManager.instance.autoAttackTotalTime);
                }
                if (this.autoAttackTime >= DataManager.instance.autoAttackTotalTime) {
                    this.autoAttackTime -= DataManager.instance.autoAttackTotalTime;
                    if (DataManager.instance.beAttackGerms.length > 0) {
                        if (DataManager.instance.curAttackedGerm <= 0) {
                            let entity_id = DataManager.instance.randomAttackedGerm();
                            DataManager.instance.curAttackedGerm = entity_id;
                        }

                        let tempIndex = DataManager.instance.getIndexWithCardEntityID(DataManager.instance.curAttackedGerm);

                        if (tempIndex >= 0) {
                            EventManager.Dispatch('startAttackGerm', DataManager.instance.curAttackedGerm);
                        }
                    }
                }
            }
        }
    },

    //初始化角色属性
    initRole: function (role, roleInfo, data, isCloneEntity = false) {
        let temp = {};

        for (let key in roleInfo) {
            temp[key] = roleInfo[key];
        }

        //设置角色信息
        role.init(data.RoleID, data.ID, data.Type, temp, this, isCloneEntity);
    },

    //根据角色id和等级获取角色属性表对应ID
    getRoleAttrIdWithRoleIdAndLv: function (id, level) {
        return id * 10 + level;
    },

    //创建细胞
    createCell: function (data, callback) {
        let roleInfo = GameConfig.getHeroInfoWithID(data.RoleID);
        let self = this;
        ResourceManager.instance.createPrefab(roleInfo.AssetName, function (node) {
            let cell = node.getComponent(BaseRole);
            self.cellLayer.addChild(cell.node);
            cell.node.setScale(0.3);
            if (callback != null) {
                callback(cell);
            }
        });
    },

    //创建细胞
    createNormalCell: function (data) {
        let self = this;

        this.actionAfterCreateCell = function (cell) {
            this.cellEntitys.push(cell);
            this.initRole(cell, roleInfo, data, false);

            let cellIndex = data.Index;
            cell.node.setPosition(GameConfig.cellPosition[cellIndex].x - 300, GameConfig.cellPosition[cellIndex].y);
            cell.node.zIndex = data.Index;

            cell.node.active = true;
            cell.moveToTarget(function () {
                DataManager.instance.updateBeAttackCells(cell.getEntityID(), true);
                if (self.isCanCombat) {
                    cell.changeState(EnumDefine.RoleState.IDLE);
                }
            });
        }

        let cell = null;
        let roleInfo = GameConfig.getHeroInfoWithID(data.RoleID);
        if (this.inactiveCellEntitys[data.RoleID] != null) {
            if (this.inactiveCellEntitys[data.RoleID].length > 0) {
                cell = this.inactiveCellEntitys[data.RoleID].shift();
                this.actionAfterCreateCell(cell);
            } else {
                this.createCell(data, function (cell) {
                    self.actionAfterCreateCell(cell);
                });
            }
        } else {
            this.createCell(data, function (cell) {
                self.actionAfterCreateCell(cell);
            });
        }
    },

    //将暂时不适用的细菌实体对象放回列表中
    putEntityToInactiveCell: function (cellEntity) {
        if (this.inactiveCellEntitys[cellEntity.getID()] == null) {
            this.inactiveCellEntitys[cellEntity.getID()] = [];
        }

        //将实体缓存到未激活的实体中
        this.inactiveCellEntitys[cellEntity.getID()].push(cellEntity);
    },

    //根据EntityID获取细胞实体对象
    getCellEntityWithEntityID: function (entity_id) {
        for (let index = 0; index < this.cellEntitys.length; index++) {
            if (this.cellEntitys[index].getEntityID() == entity_id) {
                return this.cellEntitys[index];
            }
        }

        return null;
    },

    //创建细菌
    createGerm: function (data) {
        this.actionAfterCreateGerm = function (germ, roleData) {
            this.germEntitys.push(germ);

            let offsetx = util.random(GERM_OFFSET_MIN, GERM_OFFSET_MAX);

            let monsterInfo = GameConfig.getMonsterInfoWithID(roleData.RoleID);
            if (monsterInfo.Type != EnumDefine.GermType.BOSS) {
                germ.node.setPosition(offsetx, Math.ceil(Math.random() * 40) - 45);
            } else {
                germ.node.setPosition(offsetx, -20);
            }
            germ.node.setScale(roleInfo.GermScale);

            germ.node.active = true;

            this.initRole(germ, roleInfo, roleData);

            germ.moveToTarget(function () {
                EventManager.Dispatch("UpdateCardItemProgress", roleData);
                DataManager.instance.updateBeAttackGerms(germ.getEntityID(), true);
            });
        }

        let self = this;
        let germ = null;
        let roleInfo = GameConfig.getMonsterInfoWithID(data.RoleID);
        if (this.inactiveGermEntitys[data.RoleID] != null) {

            if (this.inactiveGermEntitys[data.RoleID].length > 0) {
                germ = this.inactiveGermEntitys[data.RoleID].shift();
                this.actionAfterCreateGerm(germ, data);
            } else {
                ResourceManager.instance.createPrefabAndCallBackWithData(roleInfo.AssetName, function (node, roleData) {
                    germ = node.getComponent(BaseRole);
                    self.germLayer.addChild(germ.node);
                    self.actionAfterCreateGerm(germ, roleData);
                }, data)
            }
        } else {
            ResourceManager.instance.createPrefabAndCallBackWithData(roleInfo.AssetName, function (node, roleData) {
                germ = node.getComponent(BaseRole);
                self.germLayer.addChild(germ.node);
                self.actionAfterCreateGerm(germ, roleData);
            }, data)
        }
    },

    //根据EntityID获取细菌实体对象
    getGermEntityWithEntityID: function (entity_id) {
        for (let index = 0; index < this.germEntitys.length; index++) {
            if (this.germEntitys[index].getEntityID() == entity_id) {
                return this.germEntitys[index];
            }
        }

        return null;
    },

    //将暂时不适用的细菌实体对象放回列表中
    putEntityToInactiveGerm: function (germEntity) {
        if (this.inactiveGermEntitys[germEntity.getID()] == null) {
            this.inactiveGermEntitys[germEntity.getID()] = [];
        }

        //将实体缓存到未激活的实体中
        this.inactiveGermEntitys[germEntity.getID()].push(germEntity);
    },

    //修改战斗状态
    updateIsCanCombat: function (isCanCombat) {
        this.isCanCombat = isCanCombat;

        if (isCanCombat == true) {
            //细胞切换为待机状态
            for (let index = 0; index < this.cellEntitys.length; index++) {
                this.cellEntitys[index].changeState(EnumDefine.RoleState.IDLE);
            }

            this.nearCellStartCombat();

            //细菌开始攻击倒计时
            this.germStartCombat();
        } else {
            //细胞切换为移动状态
            for (let index = 0; index < this.cellEntitys.length; index++) {
                this.cellEntitys[index].changeState(EnumDefine.RoleState.MOVE);
            }
        }
    },

    //近程细胞开始攻击
    nearCellStartCombat: function () {
        //细胞切换为待机状态
        for (let index = 0; index < this.cellEntitys.length; index++) {
            //近程细胞为辅助细胞，攻击频率跟随自己的攻击速度
            //远程细胞为战斗细胞，攻击频率由模式决定，自动攻击、全自动攻击都是0.3秒一次，自动翻牌、手动攻击跟随手的点击频率
            if (this.cellEntitys[index].roleAttackType == EnumDefine.RoleAttackType.NEAR_ATTACK) {
                this.cellEntitys[index].startCombatCountDown();
            }
        }
    },

    //细胞开始战斗
    farCellStartCombat: function (target_entity_id) {
        for (let index = 0; index < this.cellEntitys.length; index++) {
            if (this.cellEntitys[index].roleAttackType == EnumDefine.RoleAttackType.FAR_ATTACK) {
                this.cellEntitys[index].startCombat(target_entity_id);
            }
        }
    },

    //细菌开始战斗，由于细菌是随机攻击场上的任意一个细胞，因此无需指定目标
    germStartCombat: function () {
        for (let index = 0; index < this.germEntitys.length; index++) {
            this.germEntitys[index].startCombat();
        }
    },

    //停止战斗
    stopCombat: function () {
        this.cellStopCombat();
        this.germStopCombat();
    },

    //细胞结束战斗
    cellStopCombat: function () {
        //将列表中的细胞停止战斗
        for (let index = 0; index < this.cellEntitys.length; index++) {
            this.cellEntitys[index].stopCombat();
        }
    },

    //细菌结束战斗
    germStopCombat: function () {
        //将列表中的细胞停止战斗
        for (let index = 0; index < this.germEntitys.length; index++) {
            this.germEntitys[index].stopCombat();
        }
    },

    //创建英雄天赋Buff
    createNaturalBuff: function (role_id, entity_id) {
        let roleInfo = GameConfig.getHeroInfoWithID(role_id);
        if (roleInfo != null) {
            if (roleInfo.NaturalBuff != null && roleInfo.NaturalBuff.length > 0) {
                for (let index = 0; index < roleInfo.NaturalBuff.length; index++) {
                    let buffInfo = GameConfig.getBuffInfoWithID(roleInfo.NaturalBuff[index]);
                    EventManager.Dispatch("CreateBuff", {
                        "entity_id": entity_id,
                        "entity_type": EnumDefine.RoleType.CELL,
                        "buff_info": buffInfo,
                        "buff_target_type": EnumDefine.BuffTargetType.SCENE,
                    })
                }
            }
        } else {
            roleInfo = GameConfig.getMonsterInfoWithID(role_id);
            if (roleInfo != null) {
                if (roleInfo.NaturalBuff != null && roleInfo.NaturalBuff.length > 0) {
                    for (let index = 0; index < roleInfo.NaturalBuff.length; index++) {
                        let buffInfo = GameConfig.getBuffInfoWithID(roleInfo.NaturalBuff[index]);
                        EventManager.Dispatch("CreateBuff", {
                            "entity_id": entity_id,
                            "entity_type": EnumDefine.RoleType.CELL,
                            "buff_info": buffInfo,
                            "buff_target_type": EnumDefine.BuffTargetType.SCENE,
                        })
                    }
                }
            }
        }
    },

    //移除天赋Buff
    removeNaturalBuff: function (role_id, role_type) {
        if (role_type == EnumDefine.RoleType.CELL) {
            let roleInfo = GameConfig.getHeroInfoWithID(role_id)
            if (roleInfo != null && roleInfo.NaturalBuff != null) {
                for (let index = 0; index < roleInfo.NaturalBuff.length; index++) {
                    let buff = this.cellSceneBuffManager.getBuffWithID(roleInfo.NaturalBuff[index]);
                    this.cellSceneBuffManager.removeBuff(roleInfo.NaturalBuff[index]);

                    if (buff != null) {
                        EventManager.Dispatch("RemoveBuff", buff.buffInfo);
                    }
                }
            }
        } else if (role_type == EnumDefine.RoleType.GERM) {
            let roleInfo = GameConfig.getMonsterInfoWithID(role_id)
            if (roleInfo != null && roleInfo.NaturalBuff != null) {
                for (let index = 0; index < roleInfo.NaturalBuff.length; index++) {
                    let buff = this.germSceneBuffManager.getBuffWithID(roleInfo.NaturalBuff[index]);
                    this.germSceneBuffManager.removeBuff(roleInfo.NaturalBuff[index]);

                    if (buff != null) {
                        EventManager.Dispatch("RemoveBuff", buff.buffInfo);
                    }
                }
            }
        }
    },

    //获取下注倍率
    getMaxBetMultiply: function () {
        let temp = [1];
        if (this.cellSceneBuffManager && this.cellSceneBuffManager.buffList) {
            for (let index = 0; index < this.cellSceneBuffManager.buffList.length; index++) {
                let buff = this.cellSceneBuffManager.buffList[index]
                if (buff && buff.bActive == true) {
                    if (buff.buffInfo.Type == EnumDefine.BuffType.DOUBLE_DOWN) {
                        temp.push(2);
                    }
                }
            }
        }

        temp.sort();

        return temp[temp.length - 1];
    },

    //获取添加完Buff后的攻击速度百分比
    getIncreaseAutoAttackSpeed: function () {
        let temp = 0;
        for (let index = 0; index < this.cellSceneBuffManager.buffList.length; index++) {
            let buff = this.cellSceneBuffManager.buffList[index]
            if (buff && buff.bActive == true) {
                if (buff.buffInfo.Type == EnumDefine.BuffType.INCREASE_AUTO_ATTACK_SPEED) {
                    temp += buff.buffInfo.Params[0];
                }
            }
        }

        return (100 - temp) / 100;
    },

    //获取添加完Buff后的翻牌速度百分比
    getIncreaseOpenCardSpeed: function () {
        let temp = 0;
        for (let index = 0; index < this.cellSceneBuffManager.buffList.length; index++) {
            let buff = this.cellSceneBuffManager.buffList[index]
            if (buff && buff.bActive == true) {
                if (buff.buffInfo.Type == EnumDefine.BuffType.INCREASE_OPEN_CARD_SPEED) {
                    temp += buff.buffInfo.Params[0];
                }
            }
        }

        return (100 - temp) / 100;
    },

    //刷新自动攻击速度的时间配置
    updateAutoAttackTotalTime: function () {
        if (this.isCanCombat) {
            if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.ATTACK_CLICK_CARD ||
                DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC) {
                this.isCanUpdateAutoAttackTotalTime = true;
            }
        } else {
            if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.ATTACK_CLICK_CARD) {
                DataManager.instance.autoAttackTotalTime = this.getIncreaseAutoAttackSpeed() * ATTACK_CLICK_CARD_INTERVAL;
            } else if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC) {
                DataManager.instance.autoAttackTotalTime = this.getIncreaseAutoAttackSpeed() * AUTOMATIC_INTERVAL;
            }
            this.isCanUpdateAutoAttackTotalTime = false;

            EventManager.Dispatch("UpdateCombatAnimTime", DataManager.instance.autoAttackTotalTime);
        }
    },

    //刷新自动攻击速度的时间配置
    updateAutoOpenCardTime: function (bForce) {
        if (bForce) {
            DataManager.instance.autoOpenCardTotalTime = this.getIncreaseOpenCardSpeed() * ATTACK_OPEN_CARD_INTERVAL;
        } else {
            if (this.isCanCombat) {
                if (DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTO_OPEN_CARD ||
                    DataManager.instance.cellAttackStyle == EnumDefine.CellAttackStyle.AUTOMATIC) {
                    DataManager.instance.isCanUpdateOpenCardTotalTime = true;
                }
            } else {
                DataManager.instance.autoOpenCardTotalTime = this.getIncreaseOpenCardSpeed() * ATTACK_OPEN_CARD_INTERVAL;
                DataManager.instance.isCanUpdateOpenCardTotalTime = false;
            }
        }
    },

    //播放细菌消失特效
    playGermDisappearEffect: function (germ) {
        if (this.germDisappearEffects == null) {
            this.germDisappearEffects = [];
        }

        this.showGermDisappearEffect = function (effect) {
            let roleInfo = GameConfig.getMonsterInfoWithID(germ.getID())

            effect.node.setPosition(germ.node.position);
            effect.node.setScale(roleInfo.DisappearEffectScale);
            effect.node.active = true;

            effect.resume(GERM_DISAPPEAR_ASSET_NAME);
            effect.play(GERM_DISAPPEAR_ASSET_NAME);
            effect.node.active = true;
            this.scheduleOnce(function () {
                effect.node.active = false;
                this.germDisappearEffects.push(effect);
            }.bind(this), 0.45);
        }

        let effect = null;
        if (this.germDisappearEffects.length > 0) {
            effect = this.germDisappearEffects.shift();
            this.showGermDisappearEffect(effect);
        } else {
            let self = this;
            ResourceManager.instance.createPrefab(GERM_DISAPPEAR_ASSET_NAME, function (node) {
                effect = node.getComponent(cc.Animation);
                self.germLayer.addChild(effect.node);
                self.showGermDisappearEffect(effect);
            })
        }
    },

    onDestroy: function () {
        this.removeEvent();
    },

    //重置数据
    resetData: function () {
        this.isCanCombat = false;

        //销毁细胞实体
        for (let index = this.cellEntitys.length - 1; index >= 0; index--) {
            this.cellEntitys[index].destroy();
        }
        this.cellEntitys = [];

        //销毁未激活的细胞实体
        for (let key in this.inactiveCellEntitys) {
            for (let index = this.inactiveCellEntitys.length - 1; index >= 0; index--) {
                this.inactiveCellEntitys[key][index].destroy();
            }
        }
        this.inactiveCellEntitys = {};

        //细菌实体
        for (let index = this.germEntitys.length - 1; index >= 0; index--) {
            this.germEntitys[index].destroy();
        }
        this.germEntitys = [];

        //未激活的细菌实体
        for (let key in this.inactiveGermEntitys) {
            for (let index = this.inactiveGermEntitys.length - 1; index >= 0; index--) {
                this.inactiveGermEntitys[key][index].destroy();
            }
        }
        this.inactiveGermEntitys = {};

        //自动攻击时间
        this.autoAttackTime = 0;

        //是否可以刷新自动攻击总时间
        this.isCanUpdateAutoAttackTotalTime = false;

        //细胞场景Buff管理器
        if (this.cellSceneBuffManager != null) {
            this.cellSceneBuffManager.node.destroy();
        }

        //细菌场景Buff管理器
        if (this.germSceneBuffManager != null) {
            this.germSceneBuffManager.node.destroy();
        }

        //技能特效管理器
        if (this.combatEffectManager != null) {
            this.combatEffectManager.node.destroy();
        }
    },
});