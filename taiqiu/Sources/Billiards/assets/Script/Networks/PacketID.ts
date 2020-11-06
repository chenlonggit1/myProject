
export class PacketID
{
    public static ClassName:string = "PacketID";
    /**
     * 客户端请求协议号，由1000开头
     * 请求和应答同一个协议号
     */
    //请求登录&应答
    public static LOGIN = 100;
    //请求匹配&应答
    public static MATCH = 1101;
    //进入房间请求&应答
    public static INIT_ROOM = 1102;
    //球杆移动&应答
    public static CUE_MOVE = 1103;
    //玩家击球&应答
    public static PLAYER_OPT = 1104;
    //台球落袋SNOOKER斯诺克
    public static SNOOKER = 1105;
    //同步台球位置
    public static SYNC_POS = 1106;
    //空杆&应答
    public static EMPTY_ROD = 1107;
    //选球&应答
    public static SELECT_BALL = 1108;
    //再来一局&应答
    public static NEW_ROUND = 1109;
    //离开游戏，返回大厅
    public static QUIT_GAME = 1110;
    //玩家当前的操作已完成
    public static OPTION_COMPLETE = 1111;
    //  犯规后，摆球
    public static PUT_THE_BALL = 1112;
    // 向服务器同步桌子相关的信息，包括球袋位置
    public static SYNC_TABLE_INFO = 1113;
    //请求加倍&应答
    public static REQ_DOUBLE = 1114;
    //应答加倍&应答
    public static RESP_DOUBLE = 1115;
    //获取个人信息&应答
    public static PERSONAL_INFO = 1116;
    //休眠后同步摆球
    public static SYNC_PUT_BALL = 1117;
    //我的球杆&应答
    public static MY_CUE = 1150;
    //购买球杆&应答
    public static BUY_CUE = 1151;
    //出售球杆&应答
    public static SELL_CUE = 1152;
    //升级球杆&应答
    public static UPGRADE_CUE = 1153;
    //使用球杆&应答
    public static USE_CUE = 1154;
    //查看所有&应答
    public static ALL_CUE = 1155;
    //维护球杆&应答
    public static DEFEND_CUE = 1156;
    //更新道具应答
    public static UPDATE_ITEM = 1158;
    //获取道具&应答
    public static ALL_ITEM = 1159;
    //获取角色&应答
    public static GET_ROLE = 1160;
    //使用角色&应答
    public static USE_ROLE = 1161;
    //更新角色&应答
    public static UPDATE_ROLE = 1162;
    //游戏抽奖&应答
    public static GAME_LOTTERY = 1164;
    //退出比赛
    public static GAME_QUIT = 1166;
    // 发送表情
    public static SEND_CHAT = 1167;
    // 取消匹配
    public static CANCEL_MATCH = 1168;
    //球杆维护信息
    public static CUE_DEFEND_INFO = 1169;
    //获取配置&应答
    public static GET_CONFIG = 104;
    //获取任务&应答
    public static GET_TASK = 201;
    //更新任务
    public static UPDATE_TASK = 202;
    //领取奖励&应答
    public static GET_TASK_REWARD = 203;
    //领取活跃奖励&应答
    public static GET_ACTIVE_REWARD = 204;
    //新任务
    public static GET_NEW_TASK = 205;
    //分享
    public static REQ_SHARE = 206;
    // 抽奖
    public static DRAW_LOTTERY = 207;
    // 获取红包墙信息
    public static GET_RED_PACKET = 208;
    // 更新红包墙
    public static ADD_RED_PACKET = 209;
    // 会员领取每日奖励
    public static MEMBER_AWARD = 210;
    // 会员点数返回
    public static MEMBER_UPGRADE = 211;
    //获取邮件
    public static GET_MAIL = 212;
    //领取邮件附件
    public static MAIL_AWARD = 213;
    //新邮件通知
    public static NEW_MAIL = 214;
    //获取会员信息
    public static GET_MEMBER = 215;
    //领取会员奖励
    public static GET_MEMBER_UPGRADE = 216;
    // 确认签到
    public static SURE_SIGN = 217;
    // 签到配置获取
    public static GET_SIGN_CONF = 218;

    // 获取支付方式信息
    public static GET_PAY_MODE = 219;

    // 提交订单
    public static ORDER_ITEM = 220;

    //请求公告
    public static REQ_SYSTEM_NOTICE = 230;
    //公告应答
    public static RESP_SYSTEM_NOTICE = 231;
    
    //幸运一球
    public static LUCK_BALL = 1165;

    //幸运一球 玩家松手后
    public static LUCK_STOPCUE = 1170;

    /**
     * 服务器推送，由2000开头
     */
    //更新金币
    public static UPDATE_GOLD = 101;
    //更新钻石
    public static UPDATE_DIAMOND = 102;
    //更新红包券
    public static UPDATE_RedPacket = 103;
    //游戏开始
    public static GAME_START = 2001;
    //当前操作玩家
    public static OPT_PLAYER = 2002;
    //当前选球玩家
    public static SELECT_PLAYER = 2003;
    //匹配超时
    public static MATCH_TIME_OUT = 2004;
    //匹配成功
    public static MATCH_SUCC = 2005;
    // 收到玩家自己要击打的球的列表消息
    public static GET_MINE_BALLS = 2006;
    // 更新物理帧
    public static UPDATE_PHYSIC_FRAME = 2007;
    
    //游戏结算
    public static GAME_SETTLE = 2010;
    // 抽牌
    public static DRAW_CARD = 2008;
    //抽奖奖励
    public static LOTTERY_AWARD = 2012;
    //游戏次数
    public static GAME_TIMES = 2013;
    //首杆进黑八
    public static FIRST_POLE = 2014;
    //幸运一球，剩余玩法次数
    public static LUCK_BALL_COUNT = 2015; 

    //幸运一球，奖励推送
    public static LUCK_BALL_REWARD = 2016; 
    //推送表情
    public static GET_GAME_CHAT = 2017; 
    //游戏中切换球杆
    public static GAME_CHANGE_CUE = 2018;
    


    public static Pay_BuySucess = 221;

    // 请求支付宝信息222
    public static Pay_GetFZBInfo = 222;

    // 请求兑换支付宝红包223
    public static Pay_TurnRedPack = 223;

    // 请求微信公众号信息224
    public static Pay_WXInfo = 224;

    // 请求绑定手机ren
    public static Pay_BinderPhone = 225;

    // 绑定手机验证码 
    public static Pay_BinderPhoneCode = 226;

    // 实名认证信息下推
    public static pushCheckNameInfo = 227;

    // 请求实名认证 
     public static CheckName = 228;

     // 请求复活次数
     public static reLifeNum = 233;
     
     // 请求复活
     public static reLife = 234;

     // 领取每日月卡礼包
     public static Get_DayMouthGift = 232;

     // 每日月卡推送奖励
     public static PushDayMouthGift = 235;

     //系统公告
     public static GET_SYSTEM_TIP = 236;

     //系统公告返回
     public static S2C_SYSTEM_TIP = 237;

     // 心跳包
     public static Heartbeat = 105;

     // 训练场
     public static NewGuideMatch = 1171; 

     // 新手引导抽奖
     public static NewGuideLottery = 1172;

     // 上传新手引导数据
     public static NewGuideUpdate = 238;


}
