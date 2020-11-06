export class LobbyEvent

{
    /**玩家点击幸运一球 */
    public static On_Play_LuckBall:string = "OnPlayLuckBall";



    /**游戏登陆成功 */
    public static Login_Succ:string = "onLoginSucc";
    /**需要重新游戏登陆 */
    public static Login_Retry:string = "onLoginRetry";
    /**打开个人信息 */
    public static Open_PersonalInfo:string = "onOpenPersonalInfo";
    /**打开球杆信息 */
    public static Open_CueInfo:string = "onOpenCueInfo";
    /**打开大厅设置 */
    public static Open_LobbySet:string = "onOpenLobbySet";
    /**打开大厅任务 */
    public static Open_LobbyTask:string = "onOpenLobbyTask";
    /**打开大厅红包墙 */
    public static Open_LobbyRedPacket:string = "onOpenLobbyRedPacket";
     /**打开大厅会员 */
     public static Open_LobbyMember:string = "onOpenLobbyMember";
     /**打开大厅角色 */
     public static Open_LobbyRole:string = "onOpenLobbyRole";
     /**打开大厅商城 */
     public static Open_LobbyShop:string = "onOpenLobbyShop";
     /**打开大厅活动 */
     public static Open_LobbyActivity:string = "onOpenLobbyActivity";
     /**打开大厅邮箱 */
     public static Open_LobbyMail:string = "onOpenLobbyMail";
      /**打开大厅邮箱 */
     public static Open_LobbySign:string = "onOpenLobbySign";
      /**打开月卡 */
    public static Open_LobbyMouthVip:string = "Open_LobbyMouthVip";
     /**打开首充 */
    public static Open_LobbyFirstPay:string = "Open_LobbyFirstPay";
       /**打开支付选择界面 */
     public static Open_PayModeLayer:string = "OpenPayModeLayer";
     /**接收到我的球杆 */
     public static Server_MyCue:string = "onServerMyCue";
     /**接收到所有球杆 */
     public static Server_AllCue:string = "onServerAllCue";
     /**接收到购买球杆 */
     public static Server_BuyCue:string = "onServerBuyCue";
     /**接收到升级球杆 */
     public static Server_UpgradeCue:string = "onServerUpgradeCue";
     /**接收到使用球杆 */
    public static Server_UseCue:string = "onServerUseCue";
    /**接收到维护球杆 */
    public static Server_DefendCue:string = "onServerDefendCue";
    /**接收到更新任务 */
    public static Server_UpdateTask:string = "Server_UpdateTask";
    /**接收到领取奖励 */
    public static Server_GetReward:string = "Server_GetReward";
    /**接收到领取活跃奖励 */
    public static Server_GetAcitveReward:string = "Server_GetAcitveReward";
    /**请求红包墙信息 */
    public static Server_GetRedPacket:string = "Server_GetRedPacket";
    /**推送红包墙信息 */
    public static Server_AddRedPacket:string = "Server_AddRedPacket";
    /**请求邮件 */
    public static Server_GetMail:string = "Server_GetMail";
    /**领取邮件奖励 */
    public static Server_RewardMail:string = "Server_RewardMail";
    /**抽奖奖励 */
    public static Server_RewardLottery:string = "Server_RewardLottery";
    /**玩家选好房间进入游戏 */
    public static On_Selected_Room:string = "OnSelectedRoom";
    /**更新金币 */
    public static Server_Lobby_UpdateGold:string = "Server_Lobby_UpdateGold";
    /**更新钻石 */
    public static Server_Lobby_UpdateDiamond:string = "Server_Lobby_UpdateDiamond";
    /**更新红包券 */
    public static Server_Lobby_UpdateRedPacket:string = "Server_Lobby_UpdateRedPacket";
    /**更新道具 */
    public static Server_Lobby_UpdateItem:string = "Server_Lobby_UpdateItem";
    /**更新个人信息 */
    public static Update_Personal_Info:string = "Update_PersonalInfo";
    /**切换角色 */
    public static Switch_Role:string = "Switch_Role";
    /**更新角色 */
    public static Update_Role:string = "Update_Role";
    /**公告活动 */
    public static Server_System_Notice:string = "SystemNotcie";
    /**取消匹配 */
    public static Server_Cancel_Match:string = "CancelMatch";

    public static Server_GetMemberInfo:string = "Server_GetMemberInfo";

    public static Server_UpdateDailyReward:string = "Server_UpdateDailyReward";
    /** 更新签到数据 */
    public static Server_Lobby_Sgin_Update:string = "Server_Lobby_Sgin_Update";

    /** 更新商城数据 */
    public static Server_Lobby_Shop_Update:string = "Server_Lobby_Shop_Update";

    /** 打开实名认证 */
    public static Open_CheckName: string = "Open_CheckName";

    /** 活动更新 */
    public static ActivityUpdate: string = "ActivityUpdate";

    /** 打开每日复活  */
    public static Open_reLife: string = "Open_reLife";

    /** 每日月卡奖励界面 */
    public static Open_dayMouthGift: string = "Open_dayMouthGift";

    /** 打开客服系统 */
    public static Open_LobbyServer: string = "Open_LobbyServer";

    /**更新大厅红点 */
    public static Update_LobbyRedPoint: string = "updateLobbyRedPoint";

    /**更新任务界面红点 */
    public static Update_TaskRedPoint: string = "updateTaskRedPoint";
    /** 打开周卡界面 */
    public static Open_LobbyWeekVip: string = "Open_LobbyWeekVip";
    /**设置场次 */
    public static Set_LobbyRoomMatch: string = "Set_LobbyRoomMatch";
}
