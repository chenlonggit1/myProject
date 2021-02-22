var util = require("util")
var EnumDefine = require("EnumDefine")
var GameConfig = require("GameConfig")
var EventManager = require("EventManager")

cc.Class({
    properties: {
        id: 0, //技能ID
        userEntityID: 0, //使用者实体ID
        userRoleType: EnumDefine.RoleType.NONE, //使用技能的角色类型
    },

    //初始化
    init: function (id, entity_id, roleType, role) {
        this.id = id;
        this.userEntityID = entity_id;
        this.userRoleType = roleType;
        this.role = role;
        this.combatManager = role.combatManager;
        this.combatEffectManager = role.combatManager.combatEffectManager;
        this.skillInfo = GameConfig.getSkillInfoWithID(this.id);
        this.curEnergy = 0;
        this.maxEnergy = this.skillInfo.CD;
    },

    //触发技能
    skillTrigger: function (target_entity_id) {
        let value = 0;
        if (this.skillInfo.Param[0] == EnumDefine.SkillValueType.FIXED_VALUE) {
            value = this.skillInfo.Param[1];
        } else {
            //数组长度为2，说明该技能是伤害的固定百分比，数组长度为3，说明该技能的伤害是在后面两个值之间随机一个作为百分比。
            if (this.skillInfo.Param.length == 2) {
                value = this.role.getAttack() * this.skillInfo.Param[1] / 100;
            } else {
                let temp = util.random(this.skillInfo.Param[1], this.skillInfo.Param[2]);
                value = this.role.getAttack() * temp / 100;
            }
        }

        if (this.skillInfo.Type == EnumDefine.SkillType.SINGLE_DAMAGE) {
            this.combatEffectManager.showSkillEffect(this.role, this.id, target_entity_id, value);

            for (let index = 0; index < this.skillInfo.Buff.length; index++) {
                this.useSkillBuff(this.skillInfo.Buff[index]);
            }
        } else if (this.skillInfo.Type == EnumDefine.SkillType.ALL_DAMAGE) {
            this.combatEffectManager.showSkillEffect(this.role, this.id, target_entity_id, value);
        } else if (this.skillInfo.Type == EnumDefine.SkillType.BUFF) {
            for (let index = 0; index < this.skillInfo.Buff.length; index++) {
                this.useSkillBuff(this.skillInfo[index]);
            }
        } else if (this.skillInfo.Type == EnumDefine.SkillType.CLONE_ENTITY) {
            EventManager.Dispatch("CreateCloneEntity", {
                "entity_id": this.userEntityID,
                "clone_role_id": this.role.getID(),
                "clone_entity_count": this.skillInfo.Param[0],
                "duration": this.skillInfo.Param[1],
            })
        }

        return value;
    },

    //获取技能ID
    getSkillId: function () {
        return this.id;
    },

    //获取技能图标名称
    getSkillIconName: function () {
        return this.skillInfo.Icon;
    },

    getSkillDamage: function () {
        let value = 0;
        if (this.skillInfo.Param[0] == EnumDefine.SkillValueType.FIXED_VALUE) {
            value = this.skillInfo.Param[1];
        } else {
            //数组长度为2，说明该技能是伤害的固定百分比，数组长度为3，说明该技能的伤害是在后面两个值之间随机一个作为百分比。
            if (this.skillInfo.Param.length == 2) {
                value = this.role.getAttack() * this.skillInfo.Param[1] / 100;
            } else {
                let temp = util.random(this.skillInfo.Param[1], this.skillInfo.Param[2]);
                value = this.role.getAttack() * temp / 100;
            }
        }

        return value;
    },

    useSkillBuff: function (buff_id) {
        let buffInfo = GameConfig.getBuffInfoWithID(buff_id);
        if (buffInfo != null) {
            if (buffInfo.BuffTargetType == EnumDefine.BuffTargetType.SCENE) {
                EventManager.Dispatch("CreateBuff", {
                    "entity_id": this.userEntityID,
                    "entity_type": this.userRoleType,
                    "buff_info": buffInfo,
                    "buff_target_type": EnumDefine.BuffTargetType.SCENE,
                })
            } else {
                EventManager.Dispatch("CreateBuff", {
                    "entity_id": this.userEntityID,
                    "entity_type": this.userRoleType,
                    "buff_info": buffInfo,
                    "buff_target_type": EnumDefine.BuffTargetType.HERO,
                })
            }
        }
    },
});