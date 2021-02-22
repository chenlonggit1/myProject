var util = require("util")
var EnumDefine = require("EnumDefine")
var DataManager = require("DataManager")
var EventManager = require("EventManager")

cc.Class({
    extends: cc.Component,

    properties: {
        userEntityID: 0, //使用Buff者实体ID
        targetEntityID: 0, //作用BUff者实体ID
        bActive: false, //是否处于激活状态
    },

    //设置参数
    init: function (buffInfo, user_entity_id, target_entity_id) {
        this.buffInfo = buffInfo;
        this.userEntityID = user_entity_id;
        this.targetEntityID = target_entity_id;
    },

    //开启计时器
    startTimer: function () {
        //每隔多少秒使用一次技能
        if (this.buffInfo.Type == EnumDefine.BuffType.REPEAT_USE_SKILL) {
            this.repeatUseSkill = function () {
                if (this.buffInfo.Params[1] == EnumDefine.BuffSkillTargetType.SELF) {
                    //对自己使用技能
                    EventManager.Dispatch("UserSkill", {
                        "skill_id": this.buffInfo.Params[2],
                        "user_entity_id": this.userEntityID,
                        "target_entity_id": this.userEntityID,
                    })
                } else if (this.buffInfo.Params[1] == EnumDefine.BuffSkillTargetType.CAMP_NOT_SELF) {
                    //对己方除却自己外的英雄使用技能
                    let type = DataManager.instance.getEntityTypeWithEntityId(this.userEntityID);
                    if (type = EnumDefine.RoleType.CELL) {
                        for (let index = 0; index < DataManager.instance.beAttackCells.length; index++) {
                            if (DataManager.instance.beAttackCells[index] != this.userEntityID) {
                                EventManager.Dispatch("UserSkill", {
                                    "skill_id": this.buffInfo.Params[2],
                                    "user_entity_id": this.userEntityID,
                                    "target_entity_id": DataManager.instance.beAttackCells[index],
                                })
                            }
                        }
                    } else {
                        for (let index = 0; index < DataManager.instance.beAttackGerms.length; index++) {
                            if (DataManager.instance.beAttackGerms[index] != this.userEntityID) {
                                EventManager.Dispatch("UserSkill", {
                                    "skill_id": this.buffInfo.Params[2],
                                    "user_entity_id": this.userEntityID,
                                    "target_entity_id": DataManager.instance.beAttackGerms[index],
                                })
                            }
                        }
                    }
                } else if (this.buffInfo.Params[1] == EnumDefine.BuffSkillTargetType.SELF_CAMP) {
                    //对己方所有英雄使用技能
                    let type = DataManager.instance.getEntityTypeWithEntityId(this.userEntityID);
                    if (type = EnumDefine.RoleType.CELL) {
                        for (let index = 0; index < DataManager.instance.beAttackCells.length; index++) {
                            EventManager.Dispatch("UserSkill", {
                                "skill_id": this.buffInfo.Params[2],
                                "user_entity_id": this.userEntityID,
                                "target_entity_id": DataManager.instance.beAttackCells[index],
                            })
                        }
                    } else {
                        for (let index = 0; index < DataManager.instance.beAttackGerms.length; index++) {
                            EventManager.Dispatch("UserSkill", {
                                "skill_id": this.buffInfo.Params[2],
                                "user_entity_id": this.userEntityID,
                                "target_entity_id": DataManager.instance.beAttackGerms[index],
                            })
                        }
                    }
                } else if (this.buffInfo.Params[1] == EnumDefine.BuffSkillTargetType.RANDOM_ENEMY) {
                    //随机对敌方某个英雄使用技能
                    let type = DataManager.instance.getEntityTypeWithEntityId(this.userEntityID);
                    if (type = EnumDefine.RoleType.CELL) {
                        if (DataManager.instance.beAttackGerms.length > 0) {
                            if (DataManager.instance.beAttackGerms.length == 1) {
                                EventManager.Dispatch("UserSkill", {
                                    "skill_id": this.buffInfo.Params[2],
                                    "user_entity_id": this.userEntityID,
                                    "target_entity_id": DataManager.instance.beAttackGerms[0],
                                })
                            } else {
                                let tempIndex = util.random(0, DataManager.instance.beAttackGerms.length - 1)
                                EventManager.Dispatch("UserSkill", {
                                    "skill_id": this.buffInfo.Params[2],
                                    "user_entity_id": this.userEntityID,
                                    "target_entity_id": DataManager.instance.beAttackGerms[tempIndex],
                                })
                            }
                        }
                    } else {
                        if (DataManager.instance.beAttackCells.length > 0) {
                            if (DataManager.instance.beAttackCells.length == 1) {
                                EventManager.Dispatch("UserSkill", {
                                    "skill_id": this.buffInfo.Params[2],
                                    "user_entity_id": this.userEntityID,
                                    "target_entity_id": DataManager.instance.beAttackCells[0],
                                })
                            } else {
                                let tempIndex = util.random(0, DataManager.instance.beAttackCells.length - 1)
                                EventManager.Dispatch("UserSkill", {
                                    "skill_id": this.buffInfo.Params[2],
                                    "user_entity_id": this.userEntityID,
                                    "target_entity_id": DataManager.instance.beAttackCells[tempIndex],
                                })
                            }
                        }
                    }
                } else if (this.buffInfo.Params[1] == EnumDefine.BuffSkillTargetType.ENEMY_CAMP) {
                    //随机对敌方某个英雄使用技能
                    let type = DataManager.instance.getEntityTypeWithEntityId(this.userEntityID);
                    if (type = EnumDefine.RoleType.CELL) {
                        for (let index = 0; index < DataManager.instance.beAttackGerms.length; index++) {
                            EventManager.Dispatch("UserSkill", {
                                "skill_id": this.buffInfo.Params[2],
                                "user_entity_id": this.userEntityID,
                                "target_entity_id": DataManager.instance.beAttackGerms[index],
                            })
                        }
                    }
                } else {
                    for (let index = 0; index < DataManager.instance.beAttackCells.length; index++) {
                        EventManager.Dispatch("UserSkill", {
                            "skill_id": this.buffInfo.Params[2],
                            "user_entity_id": this.userEntityID,
                            "target_entity_id": DataManager.instance.beAttackCells[index],
                        })
                    }
                }
            }

            let interval = this.buffInfo.Params[0] / 100;
            let repeat = Math.floor(this.buffInfo.Duration / interval);
            this.schedule(this.repeatUseSkill, interval, repeat, 0);
        }

        //倒计时结束移除Buff
        this.timeEndFunc = function () {
            this.bActive = false;
            EventManager.Dispatch("BuffEnd", {
                "id": this.buffInfo.ID,
                "type": this.buffInfo.Type,
                "user_entity_id": this.userEntityID,
                "target_entity_id": this.targetEntityID,
            })

            if (this.buffInfo.Type == EnumDefine.BuffType.DESTROY_SELF) {
                EventManager.Dispatch("DestroyCloneEntity", {
                    "entity_id": this.userEntityID,
                })
            }

            this.unschedule(this.timeEndFunc);
        }

        this.bActive = true;

        if (this.buffInfo.Duration > 0) {
            this.scheduleOnce(this.timeEndFunc, this.buffInfo.Duration);
        }
    },

    //获取Buff ID
    getBuffID: function () {
        return this.buffInfo.ID;
    },

    //触发Buff
    buffTrigger: function () {
        this.startTimer();
    },
});