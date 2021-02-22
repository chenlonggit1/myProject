var EnumDefine = require("EnumDefine")
var GameConfig = require("GameConfig")
var EventManager = require("EventManager")

var CombatEffectManager = cc.Class({
    extends: cc.Component,

    //初始化
    init: function (combatManager) {
        this.combatManager = combatManager
        this.initEvent();
    },

    //注册事件
    initEvent: function () {
        EventManager.Add("RecycleSkillEffect", function (event, data) {
            data.user_entity.putSkillEffectToPool(data);
        }, this);

        EventManager.Add("ShowNextEffect", function (event, data) {
            event.showEffect(data.effect_id, data.attack_entity, data.be_attack_entity_id, data.damage)
        }, this);
    },

    //移除事件
    removeEvent: function () {
        EventManager.Remove("RecycleSkillEffect", this);
        EventManager.Remove("ShowNextEffect", this);
    },

    //展示技能特效
    showSkillEffect: function (user_entity, skill_id, target_entity_id, damage) {
        let skillInfo = GameConfig.getSkillInfoWithID(skill_id);
        for (let index = 0; index < skillInfo.Effect.length; index++) {
            this.showEffect(skillInfo.Effect[index], user_entity, target_entity_id, damage)
        }
    },

    showEffect: function (effect_id, user_entity, target_entity_id, damage) {
        let self = this;
        let effectInfo = GameConfig.getSkillEffectInfoWithID(effect_id);
        if (effectInfo.Type == EnumDefine.SkillEffectType.SELF) {
            user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                effect.setParam(user_entity, user_entity.getEntityID(), damage);
                effect.showEffect();
            });
        } else if (effectInfo.Type == EnumDefine.SkillEffectType.CAMP_NOT_SELF) {
            let entity = this.combatManager.getCellEntityWithEntityID(user_entity.getEntityID());
            if (entity != null) {
                //细胞释放技能
                for (let index = 0; index < this.combatManager.cellEntitys.length; index++) {
                    if (this.combatManager.cellEntitys[index].getEntityID() != user_entity.getEntityID()) {
                        user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                            effect.setParam(user_entity, self.combatManager.cellEntitys[index].getEntityID(), damage);
                            effect.showEffect();
                        });
                    }
                }
            } else {
                //细菌释放技能
                entity = this.combatManager.getGermEntityWithEntityID(user_entity.getEntityID());
                if (entity != null) {
                    for (let index = 0; index < this.combatManager.germEntitys.length; index++) {
                        if (this.combatManager.germEntitys[index].getEntityID() != user_entity.getEntityID()) {
                            user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                                effect.setParam(user_entity, self.combatManager.germEntitys[index].getEntityID(), damage);
                                effect.showEffect();
                            });
                        }
                    }
                }
            }
        } else if (effectInfo.Type == EnumDefine.SkillEffectType.SELF_CAMP) {
            let entity = this.combatManager.getCellEntityWithEntityID(user_entity.getEntityID());
            if (entity != null) {
                //细胞释放技能
                for (let index = 0; index < this.combatManager.cellEntitys.length; index++) {
                    user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                        effect.setParam(user_entity, self.combatManager.cellEntitys[index].getEntityID(), damage);
                        effect.showEffect();
                    });
                }
            } else {
                //细菌释放技能
                entity = this.combatManager.getGermEntityWithEntityID(user_entity.getEntityID());
                if (entity != null) {
                    for (let index = 0; index < this.combatManager.germEntitys.length; index++) {
                        user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                            effect.setParam(user_entity, self.combatManager.germEntitys[index].getEntityID(), damage);
                            effect.showEffect();
                        });
                    }
                }
            }
        } else if (effectInfo.Type == EnumDefine.SkillEffectType.SELF_CAMP_FAR_ATTACKER) {
            let entity = this.combatManager.getCellEntityWithEntityID(user_entity.getEntityID());
            if (entity != null) {
                //细胞释放技能
                for (let index = 0; index < this.combatManager.cellEntitys.length; index++) {
                    if (this.combatManager.cellEntitys[index].roleAttackType == EnumDefine.RoleAttackType.FAR_ATTACK) {
                        user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                            effect.setParam(user_entity, self.combatManager.cellEntitys[index].getEntityID(), damage);
                            effect.showEffect();
                        });
                    }
                }
            } else {
                //细菌释放技能
                entity = this.combatManager.getGermEntityWithEntityID(user_entity.getEntityID());
                if (entity != null) {
                    for (let index = 0; index < this.combatManager.germEntitys.length; index++) {
                        if (this.combatManager.germEntitys[index].roleAttackType == EnumDefine.RoleAttackType.FAR_ATTACK) {
                            user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                                effect.setParam(user_entity, self.combatManager.germEntitys[index].getEntityID(), damage);
                                effect.showEffect();
                            });
                        }
                    }
                }
            }
        } else if (effectInfo.Type == EnumDefine.SkillEffectType.FLY_EFFECT) {
            user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                effect.setParam(user_entity, target_entity_id, damage);
                effect.showEffect();
            });
        } else if (effectInfo.Type == EnumDefine.SkillEffectType.TARGET) {
            user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                effect.setParam(user_entity, target_entity_id, damage);
                effect.showEffect();
            });
        } else if (effectInfo.Type == EnumDefine.SkillEffectType.ENEMY_CAMP) {
            user_entity.getSkillEffectFromPool(effect_id, function (effect) {
                effect.setParam(user_entity, user_entity.getEntityID(), damage);
                effect.showEffect();
            });
        }
    },

    onDestroy: function () {
        this.removeEvent();
    }
});