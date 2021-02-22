var EnumDefine = {}

EnumDefine.ModelType = {
    NORMAL: 1, //默认模式
    PLOT: 2, //花粉过敏源剧情模式
    JOKER: 3, //小丑模式
}

//角色类型
EnumDefine.RoleType = {
    NONE: -1,
    CELL: 1,
    GERM: 2,
}

//角色攻击类型
EnumDefine.RoleAttackType = {
    NONE: -1,
    NEAR_ATTACK: 1, //近程攻击
    FAR_ATTACK: 2, //远程攻击
}

//英雄状态
EnumDefine.RoleState = {
    UP: 1,
    IDLE: 2,
    MOVE: 3,
    ATTACK: 4,
    DEAD: 5,
}

//Buff类型
EnumDefine.BuffType = {
    NONE: 0,
    REPEAT_USE_SKILL: 1, //重复使用技能
    DOUBLE_DOWN: 2, //双倍下注
    DESTROY_SELF: 3, //自爆
    INCREASE_AUTO_ATTACK_SPEED: 4, //提高自动攻击的速度
    INCREASE_OPEN_CARD_SPEED: 5, //提高自动攻击的速度
}

//Buff附加的目标类型
EnumDefine.BuffTargetType = {
    NONE: 0,
    SCENE: 1, //场景Buff
    HERO: 2, //英雄Buff
}

//Buff技能类型
EnumDefine.BuffSkillTargetType = {
    SELF: 1, //静态特效，作用于自己身上
    CAMP_NOT_SELF: 2, //静态特效，作用于已经阵营除却自己的英雄
    SELF_CAMP: 3, //静态特效，作用于己方阵营的所有英雄
    RANDOM_ENEMY: 4, //直接在目标点身上出现
    ENEMY_CAMP: 5, //地方阵营
}

//技能类型
EnumDefine.SkillType = {
    NONE: 0,
    SINGLE_DAMAGE: 1, //单体伤害
    SINGLE_DAMAGE_RANDOM: 2, //随机对某个地方造成单体伤害
    ALL_DAMAGE: 3, //全体伤害
    BUFF: 4, //Buff
    CLONE_ENTITY: 5, //克隆实体
}

//技能的结果数值类型
EnumDefine.SkillValueType = {
    FIXED_VALUE: 1, //固定值
    PERCENTAGE: 2, //伤害的百分比
}

//细菌类型
EnumDefine.GermType = {
    Common: 1, //普通细菌
    BOSS: 2, //BOSS
    JOKER: 3, //小丑
    SPECIAL: 4, //特殊菌体
}

//关卡类型
EnumDefine.LevelType = {
    COMMON: 1, //普通关卡
    BOSS: 2, //BOSS关卡
}

//拖动节点类型
EnumDefine.DragNodeType = {
    TOP: 1,
    BOTTOM: 2,
}

//英雄攻击方式
EnumDefine.CellAttackStyle = {
    CLICK_INTERVAL: 1, //英雄攻击速度跟随手动点击频率
    ATTACK_CLICK_CARD: 2, //自动攻击选中的卡牌，攻击完后停止，在此模式下，自动再次点击卡牌，不会打乱攻击频率
    AUTO_OPEN_CARD: 3, //自动翻牌
    AUTOMATIC: 4, //自动攻击怪物，击杀完一个怪物，只要场上还有别的怪物，会自动选择下一个怪物
}

//技能特效类型
EnumDefine.SkillEffectType = {
    SELF: 1, //静态特效，作用于自己身上
    CAMP_NOT_SELF: 2, //静态特效，作用于已经阵营除却自己的英雄
    SELF_CAMP: 3, //静态特效，作用于己方阵营的所有英雄
    SELF_CAMP_FAR_ATTACKER: 4, //静态特效，作用于己方阵营的远程英雄
    FLY_EFFECT: 5, //飞行特效，飞向指定英雄
    TARGET: 6, //直接在目标点身上出现
    ENEMY_CAMP: 7, //在敌方阵营上出现
}

//卡牌状态
EnumDefine.CardStatus = {
    OPEN: 1, //打开
    USE: 2, //使用
    COMPLETE: 3, //完成
}

//卡牌类型
EnumDefine.CardType = {
    NONE: 0, //无效
    BOX: 1, //宝箱
    CELL: 2, //细胞
    GERM: 3, //细菌
    PLOT: 4, //剧情
    EMPTY_PROPS: 5, //无效道具
}

//下注类型
EnumDefine.BetType = {
    USE_BOX: 1, //使用宝箱
    TRIGGER_PLOT: 2, //触发剧情
    ATTACK_GERM: 3, //攻击怪物
}

//资源类型
EnumDefine.AssetType = {
    PREFAB: 1, //预设
    SPRITE: 2, //图片
}

//小丑模式下卡牌类型
EnumDefine.JokerStatusCardType = {
    EMPTY: 1, //空宝箱
    JOKER: 2, //小丑卡牌
    BOX: 3, //小丑宝箱
}

module.exports = EnumDefine