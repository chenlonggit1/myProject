var net = require("net")
var Skill = require("Skill")
var EnumDefine = require("EnumDefine")
var GameConfig = require("GameConfig")
var SkillEffect = require("SkillEffect")
var DataManager = require("DataManager")
var BuffManager = require("BuffManager")
var EventManager = require('EventManager')
var ResourceManager = require("ResourceManager")

const GERM_UP_TIME = 0.4; //细菌掉下结束时间
const GERM_UP_DELAY_TIME = 0.2; //细菌出场扬尘动画等待时间
const GERM_STRIKED_TIME = 0.5; //细菌受击动画时长
const GERM_STRIKED_ASSET_NAME = "ef_shouji_02"; //细菌受击动画片段名称

cc.Class({
    extends: cc.Component,

    properties: {
        id: 0, //角色ID，对应hero.json和monster.json中的ID
        entityID: 0, //角色实体ID，由服务器下发
        currentHp: 0, //角色Hp
        maxHp: 0, //角色最大Hp
        attack: 0, //角色攻击力
        combatInterval: 0, //角色攻击间隔
        skills: [], //技能实体
        dealAnimTime: 0, //角色死亡动作时间
        roleType: EnumDefine.RoleType.NONE, //角色类型，分为细菌和细胞
        roleAttackType: EnumDefine.RoleAttackType.NONE, //角色攻击类型，角色类型为细菌时，远程细胞攻击才会进行下注，角色类型为细胞时，决定细菌出场的站位
        roleState: EnumDefine.RoleState.IDLE, //角色状态
        curAttackTargetEntityID: 0, //当前攻击实体的实体ID
        germStrikedEffects: [], //受击特效
    },

    onLoad: function () {
        this.skillEffects = {}; //技能特效
        this.skelet = this.node.getComponent(sp.Skeleton);

        this.buffManager = this.node.getComponent(BuffManager);
        if (this.buffManager == null) {
            this.buffManager = this.node.addComponent(BuffManager);
        }

        //初始化事件
        this.initEvent();
    },

    //设置角色信息
    init: function (id, entity_id, roleType, data, combatManager) {
        this.id = id;
        this.entityID = entity_id;
        this.currentHp = 1;
        this.maxHp = 1;
        this.attack = 1;
        this.roleType = roleType;
        this.roleAttackType = data.AttackType || EnumDefine.RoleAttackType.NONE;

        this.buffManager.init(this.entityID)
        this.combatManager = combatManager;

        let roleInfo = GameConfig.getHeroInfoWithID(id);
        if (roleInfo == null) {
            roleInfo = GameConfig.getMonsterInfoWithID(id);
        }

        this.combatInterval = roleInfo.Param[GameConfig.AttackIntervalIndex] / 100;
        this.combatAnimTime = roleInfo.AnimTime[GameConfig.AttackAnimIndex] / 30;
        this.combatAnimTimeCfg = roleInfo.AnimTime[GameConfig.AttackAnimIndex] / 30;
        this.dealAnimTime = roleInfo.AnimTime[GameConfig.DeadAnimIndex] / 30;
        this.attackEffectDelayTime = roleInfo.AttackEffectDelayTime / 30;

        this.skills = [];
        for (let index = 0; index < roleInfo.Skill.length; index++) {
            let skill = new Skill();
            skill.init(roleInfo.Skill[index], this.entityID, this.roleType, this)
            this.skills.push(skill)
        }
    },

    //注册事件
    initEvent: function () {
        //受到伤害
        EventManager.Add("GetHurt", function (event, data) {
            if (event.checkRoleIsAlive()) {
                if (event.entityID == data.be_attack_entity_id && event.entityID != data.attack_entity_id && data.damage > 0) {
                    //由于每个角色都是一个实体，因此派发受到伤害事件时，可能会出现攻击者实体id和受到伤害者实体id一样的情况，这个要排除在外。
                    if (event.roleType == EnumDefine.RoleType.GERM) {
                        let attack_entity = event.combatManager.getCellEntityWithEntityID(data.attack_entity_id);
                        if (attack_entity != null) {
                            //判断金币是否足够
                            let myMoney = DataManager.instance.getClientMoney();
                            let betVal = GameConfig.meetingMultipleRate[DataManager.instance.multipleIndex] * attack_entity.getBetMultiply();
                            if (myMoney >= betVal) {
                                net.AttackEntityReq(data.attack_entity_id, data.be_attack_entity_id, attack_entity.getBetMultiply(), GameConfig.meetingMultipleRate[DataManager.instance.multipleIndex]);
                                DataManager.instance.setClientMoney(DataManager.instance.getClientMoney() - betVal);
                                EventManager.Dispatch('changeMoney');
                            } else {
                                EventManager.Dispatch("goldLack");
                                return;
                            }
                        }
                        event.playGermStrikedEffect(data.position);
                    } else if (event.roleType == EnumDefine.RoleType.CELL) {
                        event.playCellStrikedEffect();
                    }
                }
            }
        }, this);

        //刷新远程攻击细胞的动作时间
        EventManager.Add("UpdateCombatAnimTime", function (event, data) {
            if (event.checkIsCell()) {
                if (event.roleAttackType == EnumDefine.RoleAttackType.FAR_ATTACK) {
                    if (event.combatAnimTimeCfg < data) {
                        event.combatAnimTime = event.combatAnimTimeCfg;
                    } else {
                        event.combatAnimTime = data;
                    }
                }
            }
        }, this);
    },

    //移除事件
    removeEvent: function () {
        EventManager.Remove("GetHurt", this);
        EventManager.Remove("UpdateCombatAnimTime", this);
    },

    //获取角色ID
    getID: function () {
        return this.id;
    },

    //获取实体ID
    getEntityID: function () {
        return this.entityID;
    },

    //获取角色类型
    getRoleType: function () {
        return this.roleType;
    },

    //获取当前伤害值
    getAttack: function () {
        return this.attack;
    },

    //检测该英雄是否为细胞
    checkIsCell: function () {
        return this.roleType == EnumDefine.RoleType.CELL;
    },

    //刷新血量
    updateCurrentHp: function (currentHp) {
        this.currentHp = currentHp;
    },

    //切换状态
    changeState: function (roleState, callBack = null) {
        if (this.roleState == roleState && this.roleState != EnumDefine.RoleState.ATTACK) {
            return;
        }

        this.roleState = roleState;
        if (roleState == EnumDefine.RoleState.IDLE) {
            this.standAnimPlay();
        } else if (roleState == EnumDefine.RoleState.MOVE) {
            this.moveAnimPlay();
        } else if (roleState == EnumDefine.RoleState.ATTACK) {
            this.attackAnimPlay();
        } else if (roleState == EnumDefine.RoleState.DEAD) {
            this.deadAnimPlay(callBack);
        } else if (roleState == EnumDefine.RoleState.UP) {
            this.upAnimPlay();
        }
    },

    //播放掉落动作
    upAnimPlay: function () {
        this.skelet.timeScale = 1;
        this.skelet.clearTracks();
        this.skelet.setAnimation(0, "up", false);
    },

    //播放待机动作
    standAnimPlay: function () {
        this.skelet.timeScale = 1;
        this.skelet.clearTracks();
        let curStandName = this.checkIsCell() ? "stand1" : "stand";
        this.skelet.setAnimation(0, curStandName, true);
    },

    //播放移动动作
    moveAnimPlay: function () {
        this.skelet.timeScale = 1;
        this.skelet.clearTracks();
        this.skelet.setAnimation(0, "walk", true);
    },

    //播放攻击动作
    attackAnimPlay: function () {
        if (this.combatManager.isCanCombat) {
            //播放动作
            this.skelet.clearTracks();
            this.skelet.addAnimation(0, 'attack1', false);

            //攻击回调
            this.attackEndCallBack = function () {
                if (this.checkRoleIsAlive()) {
                    if (this.combatManager.isCanCombat) {
                        if (this.checkIsCell() == false) {
                            //近程细菌触发伤害
                            if (this.roleAttackType == EnumDefine.RoleAttackType.NEAR_ATTACK) {
                                EventManager.Dispatch("GetHurt", {
                                    "attack_entity_id": this.entityID,
                                    "be_attack_entity_id": this.curAttackTargetEntityID,
                                    "damage": damage,
                                });
                            }

                            this.changeState(EnumDefine.RoleState.IDLE);
                            this.startCombatCountDown();
                        } else {
                            this.changeState(EnumDefine.RoleState.IDLE);

                            if (this.roleAttackType == EnumDefine.RoleAttackType.NEAR_ATTACK) {
                                this.startCombatCountDown();
                            }
                        }
                    } else {
                        this.changeState(EnumDefine.RoleState.MOVE);
                    }
                }
            }

            let damage = 0;
            if (this.attackEffectDelayTime > 0) {
                this.scheduleOnce(function () {
                    this.skills[GameConfig.AttackSkillIndex].skillTrigger(this.curAttackTargetEntityID);
                    this.unschedule(this.attackEndCallBack)
                    this.scheduleOnce(this.attackEndCallBack, this.combatAnimTime)
                }, this.attackEffectDelayTime)
            } else {
                this.skills[GameConfig.AttackSkillIndex].skillTrigger(this.curAttackTargetEntityID);
                this.unschedule(this.attackEndCallBack)
                this.scheduleOnce(this.attackEndCallBack, this.combatAnimTime)
            }

            //派发怪物对应的卡牌受击事件
            if (this.roleType == EnumDefine.RoleType.CELL) {
                let cardIndex = DataManager.instance.getIndexWithCardEntityID(this.curAttackTargetEntityID);

                if (cardIndex >= 0) {
                    let skill = this.skills[GameConfig.AttackSkillIndex];
                    if (skill != null) {
                        let damage = skill.getSkillDamage();
                        if (damage > 0) {
                            EventManager.Dispatch("ShowCardAttackedEffect", cardIndex);
                        }
                    }
                }
            }
        }
    },

    //播放死亡动作
    deadAnimPlay: function (callBack = null) {
        this.skelet.timeScale = 1;
        this.currentHp = 0;
        this.skelet.clearTracks();
        this.skelet.addAnimation(0, "die", false);

        this.scheduleOnce(function () {
            if (callBack != null) {
                callBack();
            }
        }, this.dealAnimTime)
    },

    //播放细菌受击动画
    playGermStrikedEffect: function (position) {
        this.showGermStrikedEffect = function (effect) {
            effect.node.setPosition(0, position - 12);
            effect.resume(GERM_STRIKED_ASSET_NAME);
            effect.play(GERM_STRIKED_ASSET_NAME);

            this.node.color = cc.Color.GREEN;
            let colorCallBack = function () {
                this.node.color = cc.Color.WHITE;
            }
            this.scheduleOnce(colorCallBack, 0.15);

            this.scheduleOnce(function () {
                this.germStrikedEffects.push(effect);
            }, GERM_STRIKED_TIME);
        }

        let effect = null;
        if (this.germStrikedEffects.length > 0) {
            effect = this.germStrikedEffects.shift();
            this.showGermStrikedEffect(effect);
        } else {
            let self = this;
            ResourceManager.instance.createPrefab(GERM_STRIKED_ASSET_NAME, function (node) {
                self.node.addChild(node);
                node.setScale(1 / self.node.scale);
                effect = node.getComponent(cc.Animation);
                self.showGermStrikedEffect(effect);
            });
        }
    },

    //播放细胞受击动画
    playCellStrikedEffect: function () {
        let entity = this.node;
        entity.color = cc.Color.RED;
        let colorCallBack = function () {
            entity.color = cc.Color.WHITE;
        }

        this.scheduleOnce(colorCallBack, 0.15);
    },

    //检测角色是否存活
    checkRoleIsAlive: function () {
        return this.currentHp > 0;
    },

    //移动到目标点
    moveToTarget: function (callBack = null) {
        let self = this;
        this.changeState(EnumDefine.RoleState.MOVE);
        if (this.checkIsCell()) {
            this.node.runAction(cc.sequence(cc.moveBy(1.5, cc.v2(300, 0)), cc.callFunc(function () {
                if (callBack != null) {
                    callBack();
                }

                if (self.combatManager.isCanCombat) {
                    self.startCombat();
                }
            })));
        } else {
            this.changeState(EnumDefine.RoleState.UP);
            let callback = cc.callFunc(function () {
                if (callBack != null) {
                    callBack();
                }

                self.changeState(EnumDefine.RoleState.IDLE);

                if (self.combatManager.isCanCombat) {
                    self.curAttackTargetEntityID = DataManager.instance.randomAttackedCell();
                    self.startCombatCountDown();
                }

                EventManager.Dispatch("UpdateCombatState", true);
            });
            this.node.runAction(cc.sequence(cc.delayTime(GERM_UP_TIME), callback));
            this.node.runAction(cc.sequence(cc.delayTime(GERM_UP_DELAY_TIME), cc.callFunc(function () {
                //播放灰尘特效
                EventManager.Dispatch("GermLightEffect", self.node);
            })));
        }
    },

    //开始战斗
    startCombat: function (target_entity_id) {
        if (this.checkRoleIsAlive()) {
            if (this.checkIsCell()) {
                this.curAttackTargetEntityID = target_entity_id;
                if (this.combatManager.isCanCombat) {
                    if (this.roleAttackType == EnumDefine.RoleAttackType.FAR_ATTACK) {
                        this.startAttackGerm(target_entity_id);
                    } else {
                        this.startCombatCountDown();
                    }
                } else {
                    this.changeState(EnumDefine.RoleState.MOVE);
                }
            } else {
                this.curAttackTargetEntityID = DataManager.instance.randomAttackedCell();
                if (this.combatManager.isCanCombat) {
                    this.startCombatCountDown();
                } else {
                    this.changeState(EnumDefine.RoleState.IDLE);
                }
            }
        }
    },

    //开始攻击倒计时
    startCombatCountDown: function () {
        this.combatCountDown = function () {
            if (this.checkRoleIsAlive()) {
                if (this.roleState == EnumDefine.RoleState.IDLE) {
                    if (this.checkIsCell()) {
                        if (this.roleAttackType == EnumDefine.RoleAttackType.NEAR_ATTACK) {
                            this.changeState(EnumDefine.RoleState.ATTACK);
                        }
                    } else {
                        //因为细胞不会死亡，因此细菌只要冷却时间够了，就能攻击
                        this.changeState(EnumDefine.RoleState.ATTACK);
                    }
                }
            }
        }

        this.unschedule(this.combatCountDown);
        this.scheduleOnce(this.combatCountDown, this.combatInterval);
    },

    //开始攻击细菌
    startAttackGerm: function () {
        if (this.combatManager.isCanCombat) {
            this.changeState(EnumDefine.RoleState.ATTACK);
        } else {
            this.changeState(EnumDefine.RoleState.IDLE);
        }
    },

    //停止战斗，此时细菌已经全部死亡，因此直接切换到移动状态
    stopCombat: function () {
        if (this.checkRoleIsAlive()) {
            if (this.combatManager.isCanCombat) {
                if (DataManager.instance.beAttackGerms.length > 0) {
                    this.changeState(EnumDefine.RoleState.IDLE);
                } else {
                    this.changeState(EnumDefine.RoleState.MOVE);
                }
            } else {
                this.changeState(EnumDefine.RoleState.MOVE);
            }

            this.stopCombatCountDown();
        }
    },

    //停止战斗倒计时
    stopCombatCountDown: function () {
        if (this.combatCountDown != null) {
            this.unschedule(this.combatCountDown);
        }
    },

    //为英雄添加Buff
    addBuffToHero: function (buff_id) {
        this.buffManager.addBuff(buff_id);
    },

    //获取下注倍率
    getBetMultiply: function () {
        let maxBetMultiply = this.combatManager.getMaxBetMultiply();

        let temp = [1];
        for (let index = 0; index < this.buffManager.buffList.length; index++) {
            let buff = this.buffManager.buffList[index]
            if (buff && buff.bActive) {
                if (buff.type == EnumDefine.BuffType.DOUBLE_DOWN) {
                    temp.push(2);
                }
            }
        }

        temp.sort();

        if (maxBetMultiply > temp[temp.length - 1]) {
            return maxBetMultiply;
        } else {
            return temp[temp.length - 1];
        }
    },

    //从缓存池中获取特效
    getSkillEffectFromPool: function (effect_id, callback) {
        let self = this;
        let effect = null;
        let effectInfo = GameConfig.getSkillEffectInfoWithID(effect_id);
        if (effectInfo != null) {
            if (this.skillEffects[effect_id] == null) {
                this.skillEffects[effect_id] = [];
            }

            if (this.skillEffects[effect_id].length > 0) {
                effect = this.skillEffects[effect_id].shift();
                effect.init(effectInfo, this.combatManager);
                if (callback != null) {
                    callback(effect);
                }
            } else {
                ResourceManager.instance.createPrefab(effectInfo.AssetName, function (node) {
                    effect = node.getComponent(SkillEffect);
                    effect.init(effectInfo, self.combatManager);
                    if (callback != null) {
                        callback(effect);
                    }
                })
            }
        }
    },

    //蒋特效放入缓存池中
    putSkillEffectToPool: function (data) {
        if (this.skillEffects == null) {
            this.skillEffects = {};
        }
        if (this.skillEffects[data.effect_id] == null) {
            this.skillEffects[data.effect_id] = [];
        }

        data.effect.node.active = false;
        this.skillEffects[data.effect_id].push(data.effect);
    },

    onDestroy: function () {
        this.removeEvent();
    },
});