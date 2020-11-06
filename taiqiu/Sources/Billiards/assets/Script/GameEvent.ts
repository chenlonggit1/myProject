
export class GameEvent {
    public static ClassName: string = "GameEvent";

    /**玩家匹配成功 */
    public static MatchPlayer_Succ: string = "onMatchPlayerSucc";
    /**玩家匹配超时 */
    public static MatchPlayer_TimeOut: string = "onMatchPlayerTimeOut";
    /**进入房间成功成功 */
    public static EnterRoom_Succ: string = "onEnterRoomSucc";
    /**当前玩家击球的ID */
    public static Player_Option: string = "onPlayerOption";
    /**玩家发球 */
    public static Player_ShotBall: string = "onPlayerShotBall";
    /**更新玩家球杆位置、角度 */
    public static Update_BallCue: string = "onUpdateBallCue";
    /**更新所有台球的位置、角度 */
    public static Update_Balls: string = "onUpdateBalls";
    /**玩家选定击球力度 */
    public static Player_Power_Option: string = "onPlayerPowerOption";
    /**玩家选定击球力度 */
    public static Player_FineTurning_Option: string = "onPlayerFineTurningOption";
    /**玩家击中球落袋 */
    public static On_Pocket_Ball: string = "onPocketBall";
    /**更新击球点 */
    public static Update_ContactPoint: string = "onUpdateContactPoint";
    /**接收到服务器玩家落袋 */
    public static Server_Pocket_Ball: string = "onServer_Pocket_Ball";
    /**玩家犯规 */
    public static Player_Illegality: string = "onPlayerIllegality";
    /**开始摆球 */
    public static On_Start_FreeKickBall: string = "onStartFreeKickBall";
    /**结束摆球 */
    public static On_Stop_FreeKickBall: string = "onStopFreeKickBall";
    /**接收到服务器玩家落袋 */
    public static On_Player_PutTheBall: string = "onPlayerPutTheBall";
    /**游戏结算 */
    public static Server_Game_Settle: string = "Server_Game_Settle";
    /**同步桌子信息 */
    public static Table_Init_Complete: string = "Table_Init_Complete";
    /**获取击打球列表 */
    public static Get_Play_Ball_List: string = "Get_Play_Ball_List";
    /**更新物理引擎的 */
    public static Update_Physic_Frame: string = "onUpdatePhysicFrame";
    /**更新玩家数据 */
    public static Update_PlayerData: string = "Update_PlayerData";
    /**更新游戏倍数 */
    public static Update_Game_Multiple: string = "onUpdateGameMultiple";
    /**进入匹配视图后请求服务器开始匹配 */
    public static On_Start_Match: string = "onStartMatch";
    /**匹配视图返回大厅 */
    public static On_Match_Back: string = "onMatchBack";
    /**退出游戏 */
    public static On_ExitGame: string = "OnExitGame";
    /**重新匹配 */
    public static On_ReMatchGame: string = "onReMatchGame";
    /**开始新一轮游戏 */
    public static On_Start_NewRound: string = "OnStartNewRound";
    /**更正阴影显示 */
    public static On_Fixed_BallScreenPos: string = "OnFixedShadow";
    /**设置球洞动画 */
    public static On_Set_BallHoleAni:string = "OnSetBallHoleAni";
    /**显示抽奖界面 */
    public static On_Show_Lottery:string = "OnShowLottery";
    /**抽奖完成 */
    public static On_Lottery_Complete: string = "onLotteryComplete";
    /**其他玩家退出 */
    public static On_OtherPlayerExit:string = "OnOtherPlayerExit";
    public static OtherPlayer_PhysicSleep: string = "OtherPlayerPhysicSleep";

    /** 幸运一击 显示购买页面 免费||收费 */
    public static onShowPayPupop: string = "onShowPayPupop";

    public static Game_LuckInfo: string = "onGameLuckInfo";

    /** 幸运一击 免费机会 免费挑战按钮点击 */
    public static onFreeStartGame: string = "onFreeStartGame";

     /** 幸运一击 收费机会 开始挑战按钮 */
     public static onChargeStartGame: string = "onChargeStartGame";

    

    /** 幸运一击 免费机会 右上角关闭*/
    public static onFreeClosePupop: string = "onFreeClosePupop";

    /** 幸运一击 收费机会 右上角关闭*/
    public static onChargeClosePupop: string = "onChargeClosePupop";
    


    /** 幸运一击 改变白球、红球position */
    public static onChangBallPos: string = "onChangBallPos";

    /** 幸运一击  红球停止滚动后，告知tableInfo */
    public static onGetRedBallStopResult: string = "onGetRedBallStopResult";

    
    /** 幸运一击 重置白球、红球position */
    public static onRetBallPos: string = "onRetBallPos";


    /** 幸运一击 显示收费奖励 */
    public static onShowChargeReward: string = "onShowChargeReward";

    /** 幸运一击 红球停止滚动 */
    public static onRedBallStopScroll: string = "onRedBallStopScroll";

    /** 幸运一击  开放桌面的事件 */
    public static onStartTableEvent: string = "onStartTableEvent";

    
    /** 幸运一击  接收到幸运一杆推送过来的消息体 */
    public static onGameLuckResultInfo: string = "onGameLuckResultInfo";

    /** 幸运一击  接收到幸运一杆推送过来的奖励消息体 */
    public static onGameLuckResultReward: string = "onGameLuckResultReward";

    /** 游戏模块中 显示聊天功能 */
    public static onShowChatWindow: string = "onShowChatWindow";

    /** 获取服务器推送过来的其他玩家的聊天体 */
    public static onGetPlayerChat:string = "onGetPlayerChat";

    /** 显示设置弹窗按钮，幸运一杆里没有重新连接功能 */
    public static onShowSetType:string = "onShowSetType";

    /**游戏重连加载过程中，其他玩家操作 */
    public static onReconnectLoad:string = "onReconnectLoad";
}   
