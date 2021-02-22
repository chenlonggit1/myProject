var GameConfig = {}

//游戏ID
GameConfig.gameId = 10095;

//场ID
GameConfig.arenaId = 10561;

//游戏版本号
GameConfig.Version = "v2019060502";

//是否处于调试模式
GameConfig.isDebugGame = true;

//加密所用的固定字符串
GameConfig.securityKey = "50E851DE-357F-4268-9FC6-B18755C5898D";

//游戏地址
GameConfig.hostUrl = "http://h5game-wx.qpgame.com/WeiXin/H5GameLoginEnter?gameid=10095";

//获取玩家ID地址
GameConfig.getPlayerIDAddress = "http://%s:8000/client/getaccountid?usr=%s&pwd=%s";

//获取微信登录玩家ID地址
GameConfig.getPlayerIDInWeChatAddress = "http://zdxbhall.qianz.com:8000/client/partneruserlogin?game_id=%s&partner_id=%s&authcode=%s&deviceinfo=%s&marketid=%s&version=%s&unionID=%s&nickname=%s&headimgurl=%s&sex=%s";

//通过Post请求获取微信初始化信息
GameConfig.getWeChatConfigWithPostAddress = "http://zdxbhall.qianz.com:8000/?ops=17&playerid=0"

//通过Post请求获取微信登录玩家ID地址
GameConfig.getPlayerIDInWeChatWithPostAddress = "http://zdxbhall.qianz.com:8000/?ops=16&playerid=0"

//获取亲朋账号绑定信息地址
GameConfig.getAccountBindInfoAddress = "http://zdxbhall.qianz.com:8000/client/getmodifyflag?playerid=%d"

//获取游戏GS的地址
GameConfig.getGameGSAddress = "http://games.bpl.qp.qianz.com/API/GameServerFilter.aspx?gid=%s&ggid=%s&sid=%s&ts=%s&sign=%s";

//微信登录验证地址
GameConfig.loginVerifyAddress = "https://h5game-wx.qpgame.com/api/v1/WeiXin/VerifyH5GameLogin?gameId=%s&appId=%s&unionid=%s&openid=%s&key=%s";

//请求绑定亲朋账号地址
GameConfig.bingAccountAddress = "https://mapi.qpgame.com/Services/WechatBind.ashx?handle=%s&uid=%s&cert=%s&partnerid=%s&newloginname=%s&newpwd=%s&newauthcode=%s&unionid=%s&nickname=%s&icon=%s&datatype=%s&sign=%s";

//同步点券
GameConfig.getTicketAddress = "http://zdxbhall.qianz.com:8000/client/getUserTicket?playerID=%s";

//点券兑换
GameConfig.ticketExchangeGoldAddress = "http://mapi.qpgame.com/Services/api.ashx";

//支付
GameConfig.wxPayAddress = "http://m-jsapi-wxpay.qpgame.com/pay/weixin/trade.aspx";

//实名地址
GameConfig.tAntiAddictionAddressInfo = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6c63c20efe7d77c3&redirect_uri=https%3a%2f%2fwx.qpgame.com%2fWjrWxOAuth%2fAuthorize%2fwx6c63c20efe7d77c3%3fwjrAppId%3dm_qpgame_com%26urlId%3dSMRZ%26attachData1%3d%e4%ba%b2%e6%9c%8b%26attachData2%3d%e6%a3%8b%e7%89%8c&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

//上报错误地址
GameConfig.reportErrorAddress = "http://zdxbhall.qianz.com:8000/client/report?res=%s"

//分享icon地址
GameConfig.shareIconAddress = "http://qpzdxb.vk51.com/config/share.png";

//分享游戏地址
GameConfig.shareAddress = "http://wx.qpgame.com/WeiXin/H5GameLoginEnter?gameid=10095";

//小丑剧情ID
GameConfig.jokerStoryID = 401;

//小丑模式下小王增加的免费次数
GameConfig.blackJokerCreaseFreeAmount = 1;

//选择英雄界面拖动的安全区域
GameConfig.chooseHeroDragSafeArea = [{
        "Left": -290,
        "Right": -190,
        "Top": -400,
        "Bottom": -500
    },
    {
        "Left": -170,
        "Right": -70,
        "Top": -400,
        "Bottom": -500
    },
    {
        "Left": -50,
        "Right": 50,
        "Top": -400,
        "Bottom": -500
    },
    {
        "Left": 70,
        "Right": 170,
        "Top": -400,
        "Bottom": -500
    },
    {
        "Left": 190,
        "Right": 290,
        "Top": -400,
        "Bottom": -500
    },
]

//细胞位置
GameConfig.cellPosition = [
    cc.v2(-9, -26),
    cc.v2(-92, -32),
    cc.v2(42, -50),
    cc.v2(-40, -56),
    cc.v2(-130, -60),
];

//杀死细菌所有细胞能获得的能量
GameConfig.KillGermSkillEnergy = 1;

//攻击技能索引
GameConfig.AttackSkillIndex = 0;

//第一个技能索引
GameConfig.RoleSkillIndex = 1;

//攻击动画索引
GameConfig.AttackAnimIndex = 0;

//技能动画索引
GameConfig.SkillAnimIndex = 1;

//死亡动画索引
GameConfig.DeadAnimIndex = 2;

//动画取样时间
GameConfig.AnimSampleTime = 30;

//攻击间隔索引
GameConfig.AttackIntervalIndex = 0;

//技能间隔索引
GameConfig.SkillIntervalIndex = 1;

//自爆BuffID
GameConfig.DestroySelfBuffID = 2002;

//细胞场景Buff管理器ID
GameConfig.CellSceneBuffManagerID = 10000;

//细菌场景Buff管理器ID
GameConfig.GermSceneBuffManagerID = 20000;

//倍率配置
GameConfig.meetingMultipleRate = [];

//英雄配置
GameConfig.heroInfos = [];

//宝箱配置
GameConfig.boxInfos = [];

//Buff配置
GameConfig.buffInfos = [];

//关卡配置
GameConfig.levelInfos = [];

//怪物配置
GameConfig.monsterInfos = [];

//怪物属性配置表
GameConfig.roleAttributeInfos = [];

//技能配置
GameConfig.skillInfos = [];

//技能特效信息
GameConfig.skillEffectInfos = [];

//图片信息
GameConfig.spriteInfos = [];

//资源路径
//Type：1为英雄2为特效3为UI4为图片5为图集6为音效
//ID：1001-2000为英雄；2001-3000为特效；3001-4000为UI；4001-5000为图片；5001-6000为图集；6001-7000为音效
GameConfig.assetPaths = [];

//根据ID获取英雄信息
GameConfig.getHeroInfoWithID = function (id) {
    for (let index = 0; index < GameConfig.heroInfos.length; index++) {
        if (GameConfig.heroInfos[index].ID == id) {
            return GameConfig.heroInfos[index];
        }
    }

    return null;
}

//根据ID获取英雄索引
GameConfig.getHeroIndexWithID = function (id) {
    for (let index = 0; index < GameConfig.heroInfos.length; index++) {
        if (GameConfig.heroInfos[index].ID == id) {
            return index;
        }
    }

    return -1;
}

//根据ID获取怪物信息
GameConfig.getMonsterInfoWithID = function (id) {
    for (let index = 0; index < GameConfig.monsterInfos.length; index++) {
        if (GameConfig.monsterInfos[index].ID == id) {
            return GameConfig.monsterInfos[index];
        }
    }

    return null;
}

//根据ID获取玩家属性信息
GameConfig.getRoleAttributeInfoWithID = function (id) {
    for (let index = 0; index < GameConfig.roleAttributeInfos.length; index++) {
        if (GameConfig.roleAttributeInfos[index].ID == id) {
            return GameConfig.roleAttributeInfos[index];
        }
    }

    return null;
}

//根据ID获取技能信息
GameConfig.getSkillInfoWithID = function (id) {
    for (let index = 0; index < this.skillInfos.length; index++) {
        if (GameConfig.skillInfos[index].ID == id) {
            return GameConfig.skillInfos[index]
        }
    }

    return null;
}

//根据ID获取技能信息
GameConfig.getBuffInfoWithID = function (id) {
    for (let index = 0; index < this.buffInfos.length; index++) {
        if (GameConfig.buffInfos[index].ID == id) {
            return GameConfig.buffInfos[index]
        }
    }

    return null;
}

//根据ID获取技能特效信息
GameConfig.getSkillEffectInfoWithID = function (id) {
    for (let index = 0; index < this.skillEffectInfos.length; index++) {
        if (GameConfig.skillEffectInfos[index].ID == id) {
            return GameConfig.skillEffectInfos[index]
        }
    }

    return null;
}

GameConfig.getSpriteInfo = function (spriteName) {
    for (let index = 0; index < this.spriteInfos.length; index++) {
        if (this.spriteInfos[index].SpriteName == spriteName) {
            return this.spriteInfos[index];
        }
    }

    return null;
}

module.exports = GameConfig