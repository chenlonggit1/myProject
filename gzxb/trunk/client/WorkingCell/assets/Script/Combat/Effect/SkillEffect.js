var util = require("util")
var EnumDefine = require("EnumDefine")
var GameConfig = require("GameConfig")
var EventManager = require("EventManager")

cc.Class({
    extends: cc.Component,

    properties: {},

    init: function (effect_info, combat_manager) {
        this.effectInfo = effect_info;
        this.combatManager = combat_manager;
        this.animation = this.getComponent(cc.Animation);

        this.initEvent();
    },

    setParam: function (user_entity, target_entity_id, damage) {
        this.userEntity = user_entity;
        this.targetEntityId = target_entity_id;
        this.damage = damage;
    },

    initEvent: function () {
        if (this.animation != null) {
            this.animation.on('finished', this.onAnimationFinished, this);
        }

        //回收技能特效
        EventManager.Add("PutSkillEffect", function (event, data) {
            EventManager.Dispatch("RecycleSkillEffect", {
                "user_entity": event.userEntity,
                "effect_id": event.effectInfo.ID,
                "effect": event,
            });
        }, this);
    },

    onDestroy: function () {
        EventManager.Remove("PutSkillEffect", this);
    },

    onAnimationFinished: function (type, anim) {
        if (this.effectInfo.Type == EnumDefine.SkillEffectType.SELF ||
            this.effectInfo.Type == EnumDefine.SkillEffectType.CAMP_NOT_SELF ||
            this.effectInfo.Type == EnumDefine.SkillEffectType.SELF_CAMP ||
            this.effectInfo.Type == EnumDefine.SkillEffectType.SELF_CAMP_FAR_ATTACKER) {
            if (this.effectInfo.Duration == 0) {
                EventManager.Dispatch("RecycleSkillEffect", {
                    "user_entity": this.userEntity,
                    "effect_id": this.effectInfo.ID,
                    "effect": this,
                });
            }
        }
    },

    showEffect: function () {
        if (this.effectInfo.Type == EnumDefine.SkillEffectType.SELF ||
            this.effectInfo.Type == EnumDefine.SkillEffectType.CAMP_NOT_SELF ||
            this.effectInfo.Type == EnumDefine.SkillEffectType.SELF_CAMP ||
            this.effectInfo.Type == EnumDefine.SkillEffectType.SELF_CAMP_FAR_ATTACKER ||
            this.effectInfo.Type == EnumDefine.SkillEffectType.TARGET) {
            let entity = this.combatManager.getCellEntityWithEntityID(this.targetEntityId);
            if (entity == null) {
                entity = this.combatManager.getGermEntityWithEntityID(this.targetEntityId);
            }

            if (entity != null) {
                this.node.setParent(entity.node);
                this.node.setPosition(this.effectInfo.Offset[0], this.effectInfo.Offset[1]);

                let scale = 1 / entity.node.scale;
                this.node.scale = scale;
                this.node.active = true;

                if (this.animation != null) {
                    this.animation.setCurrentTime(0, this.effectInfo.ClipName);
                    this.animation.play(this.effectInfo.ClipName)
                }

                if (this.damage > 0) {
                    EventManager.Dispatch("GetHurt", {
                        "attack_entity_id": this.userEntity.getEntityID(),
                        "be_attack_entity_id": this.targetEntityId,
                        "damage": this.damage,
                    });
                }
            }

            if (this.effectInfo.NextEffect.length == 2) {
                this.showNextEffect = function () {
                    EventManager.Dispatch("ShowNextEffect", {
                        "effect_id": this.effectInfo.NextEffect[1],
                        "attack_entity": this.userEntity,
                        "be_attack_entity_id": this.targetEntityId,
                        "damage": 0,
                    });
                };

                if (this.effectInfo.NextEffect[0] > 0) {
                    this.scheduleOnce(function () {
                        this.showNextEffect();
                    }, this.effectInfo.NextEffect[0] / GameConfig.AnimSampleTime);
                } else {
                    this.showNextEffect();
                }
            }
        } else if (this.effectInfo.Type == EnumDefine.SkillEffectType.FLY_EFFECT) {
            let user_entity = this.combatManager.getCellEntityWithEntityID(this.userEntity.getEntityID());
            if (user_entity == null) {
                user_entity = this.combatManager.getGermEntityWithEntityID(this.userEntity.getEntityID());
            }

            let target_entity = this.combatManager.getCellEntityWithEntityID(this.targetEntityId);
            if (target_entity == null) {
                target_entity = this.combatManager.getGermEntityWithEntityID(this.targetEntityId);
            }

            var self = this;
            if (user_entity != null && target_entity != null) {
                this.node.setParent(user_entity.node);
                this.node.setPosition(this.effectInfo.Offset[0], this.effectInfo.Offset[1]);

                let scale = 1 / user_entity.node.scale;
                this.node.scale = scale;
                this.node.active = true;

                let target = util.getDistance(user_entity.node, target_entity.node);
                let time = Math.abs(target.x) / this.effectInfo.MoveSpeed;
                let distance = 0;
                if (user_entity.getRoleType() == EnumDefine.RoleType.CELL) {
                    distance = Math.abs(target.x) * scale;
                } else {
                    distance = -target.x * scale;
                }
                this.node.runAction(cc.sequence(cc.moveBy(time, cc.v2(distance, 0)), cc.callFunc(() => {
                    EventManager.Dispatch("RecycleSkillEffect", {
                        "user_entity": self.userEntity,
                        "effect_id": self.effectInfo.ID,
                        "effect": self,
                    });

                    EventManager.Dispatch("GetHurt", {
                        "attack_entity_id": self.userEntity.getEntityID(),
                        "be_attack_entity_id": self.targetEntityId,
                        "damage": self.damage,
                        "position": user_entity.node.position.y + self.node.position.y,
                    });

                    if (self.effectInfo.NextEffect.length == 2) {
                        self.showNextEffect = function () {
                            EventManager.Dispatch("ShowNextEffect", {
                                "effect_id": self.effectInfo.NextEffect[1],
                                "attack_entity": self.userEntity,
                                "be_attack_entity_id": self.targetEntityId,
                                "damage": 0,
                            });
                        };
                        if (self.effectInfo.NextEffect[0] > 0) {
                            self.scheduleOnce(function () {
                                self.showNextEffect();
                            }, self.effectInfo.NextEffect[0] / GameConfig.AnimSampleTime);
                        } else {
                            self.showNextEffect();
                        }
                    }
                })))
            }
        } else if (this.effectInfo.Type == EnumDefine.SkillEffectType.ENEMY_CAMP) {
            let entity = this.combatManager.getCellEntityWithEntityID(this.targetEntityId);
            if (entity == null) {
                entity = this.combatManager.getGermEntityWithEntityID(this.targetEntityId);
            }

            if (entity.getRoleType() == EnumDefine.RoleType.CELL) {
                this.node.setParent(this.combatManager.germLayer);
            } else {
                this.node.setParent(this.combatManager.cellLayer);
            }

            this.node.setPosition(-150, 0);

            this.node.scale = 1;
            this.node.active = true;

            if (this.animation != null) {
                this.animation.setCurrentTime(0, this.effectInfo.ClipName);
                this.animation.play(this.effectInfo.ClipName)
            }
        }

        if (this.effectInfo.Duration > 0) {
            let delayTime = this.effectInfo.Duration / 100;
            this.scheduleOnce(function () {
                EventManager.Dispatch("RecycleSkillEffect", {
                    "user_entity": this.userEntity,
                    "effect_id": this.effectInfo.ID,
                    "effect": this,
                });
            }, delayTime);
        }
    },
});