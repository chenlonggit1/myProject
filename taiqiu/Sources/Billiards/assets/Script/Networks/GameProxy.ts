import FProxy from "../../Framework/Core/FProxy";
import { IClient } from "../../Framework/Interfaces/Network/IClient";
import { ClientManager } from "../../Framework/Managers/ClientManager";
import { trace } from "../../Framework/Utility/dx/trace";
import { ClientNames } from "../ClientNames";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { ConfigVO } from "../VO/ConfigVO";
import { C_Lobby_Login } from "./Clients/C_Lobby_Login";
import { PacketID } from "./PacketID";
import { S_Lobby_AllCue } from "./Servers/Cue/S_Lobby_AllCue";
import { S_Lobby_BuyCue } from "./Servers/Cue/S_Lobby_BuyCue";
import { S_Lobby_DefendCue } from "./Servers/Cue/S_Lobby_DefendCue";
import { S_Lobby_MyCue } from "./Servers/Cue/S_Lobby_MyCue";
import { S_Lobby_SellCue } from "./Servers/Cue/S_Lobby_SellCue";
import { S_Lobby_UpgradeCue } from "./Servers/Cue/S_Lobby_UpgradeCue";
import { S_Lobby_UseCue } from "./Servers/Cue/S_Lobby_UseCue";
import { S_Game_DrawCard } from "./Servers/S_Game_DrawCard";
import { S_Game_GetMineBalls } from "./Servers/S_Game_GetMineBalls";
import { S_Game_Illegality } from "./Servers/S_Game_Illegality";
import { S_Game_Option } from "./Servers/S_Game_Option";
import { S_Game_PocketBall } from "./Servers/S_Game_PocketBall";
import { S_Game_PutTheBall } from "./Servers/S_Game_PutTheBall";
import { S_Game_Settle } from "./Servers/S_Game_Settle";
import { S_Game_ShotBall } from "./Servers/S_Game_ShotBall";
import { S_Game_UpdateBallArm } from "./Servers/S_Game_UpdateBallArm";
import { S_Game_UpdateBalls } from "./Servers/S_Game_UpdateBalls";
import { S_Game_UpdatePhysicFrame } from "./Servers/S_Game_UpdatePhysicFrame";
import { S_Lobby_Config } from "./Servers/S_Lobby_Config";
import { S_Lobby_EnterRoom } from "./Servers/S_Lobby_EnterRoom";
import { S_Lobby_Login } from "./Servers/S_Lobby_Login";
import { S_Lobby_Match } from "./Servers/S_Lobby_Match";
import { S_Lobby_UpdateDiamond } from "./Servers/S_Lobby_UpdateDiamond";
import { S_Lobby_UpdateGold } from "./Servers/S_Lobby_UpdateGold";
import { S_Lobby_ActiveAward } from "./Servers/Task/S_Lobby_ActiveAward";
import { S_Lobby_Award } from "./Servers/Task/S_Lobby_Award";
import { S_Lobby_NewTask } from "./Servers/Task/S_Lobby_NewTask";
import { S_Lobby_Task } from "./Servers/Task/S_Lobby_Task";
import { S_Lobby_UpdateTask } from "./Servers/Task/S_Lobby_UpdateTask";
import { S_Game_RespDouble } from "./Servers/S_Game_RespDouble";
import { S_Game_ReqDouble } from "./Servers/S_Game_ReqDouble";
import { S_Game_NewRound } from "./Servers/S_Game_NewRound";
import { S_Lobby_MatchOK } from "./Servers/S_Lobby_MatchOK";
import { S_Game_ExitGame } from "./Servers/S_Game_ExitGame";
import { S_Lobby_GetRedPacket } from "./Servers/RedPacket.ts/S_Lobby_GetRedPacket";
import { S_Lobby_AddRedPacket } from "./Servers/RedPacket.ts/S_Lobby_AddRedPacket";
import { S_Lobby_DrawLottery } from "./Servers/RedPacket.ts/S_Lobby_DrawLottery";
import { S_Lobby_UpdateItem } from "./Servers/S_Lobby_UpdateItem";
import { S_Lobby_AllItem } from "./Servers/S_Lobby_AllItem";
import { S_Lobby_PersonalInfo } from "./Servers/S_Lobby_PersonalInfo";
import { S_Lobby_GetRole } from "./Servers/Role/S_Lobby_GetRole";
import { S_Lobby_UseRole } from "./Servers/Role/S_Lobby_UseRole";
import { S_Lobby_UpdateRole } from "./Servers/Role/S_Lobby_UpdateRole";
import { S_Lobby_MemberAward } from "./Servers/Member/S_Lobby_MemberAward";
import { S_Lobby_MemberUpgrade } from "./Servers/Member/S_Lobby_MemberUpgrade";
import { S_Lobby_GetMail } from "./Servers/Mail/S_Lobby_GetMail";
import { S_Lobby_GetMember } from "./Servers/Member/S_Lobby_GetMember";
import { S_Lobby_MemberPoint } from "./Servers/Member/S_Lobby_MemberPoint";
import { S_Lobby_UpdateRedPacket } from "./Servers/S_Lobby_UpdateRedPacket";
import { S_Game_OptionComplete } from "./Servers/S_Game_OptionComplete";
import { S_Game_GameTimes } from "./Servers/Lottery/S_Game_GameTimes";
import { S_Game_LotteryAward } from "./Servers/Lottery/S_Game_LotteryAward";
import { S_Lobby_GetSignConf } from "./Servers/Sign/S_Lobby_GetSignConf";
import { S_Lobby_SureSign } from "./Servers/Sign/S_Lobby_SureSign";
import { S_Game_LuckBallCount } from "./Servers/LuckBall/S_Game_LuckBallCount";
import { S_Pay_GetPayMode } from "./Servers/Pay/S_Pay_GetPayMode";
import { S_Pay_OrderItem } from "./Servers/Pay/S_Pay_OrderItem";
import { S_Game_LuckBallReward } from "./Servers/LuckBall/S_Game_LuckBallReward";
import { S_Pay_BuySuccess } from "./Servers/Pay/S_Pay_BuySuccess";
import { S_Pay_GetZFBInfo } from "./Servers/Pay/S_Pay_GetZFBInfo";
import { S_Pay_TurnRedPack } from "./Servers/Pay/S_Pay_TurnRedPack";
import { S_Game_FirstPole } from "./Servers/S_Game_FirstPole";
import { S_Pay_GetWXInfo } from "./Servers/Pay/S_Pay_GetWXInfo";
import { S_Pay_BinderPhone } from "./Servers/Pay/S_Pay_BinderPhone";
import { S_Lobby_CheckName } from "./Servers/S_Lobby_CheckName";
import { S_Lobby_NameInfo } from "./Servers/S_Lobby_NameInfo";
import { S_Lobby_RespSystemNotice } from "./Servers/S_Lobby_RespSystemNotice";
import { S_Game_Chat } from "./Servers/S_Game_Chat";
import { S_Lobby_getDayMouthGIft } from "./Servers/S_Lobby_getDayMouthGIft";
import { S_Lobby_PushDayMouthGift } from "./Servers/S_Lobby_PushDayMouthGift";
import { S_Lobby_relifeNum } from "./Servers/S_Lobby_relifeNum";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { SceneEvent } from "../../Framework/Events/SceneEvent";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { showPopup } from "../Common/showPopup";
import { LoginMediator } from "../LoginScene/LoginMediator";
import { ModuleNames } from "../ModuleNames";
import { PopupType } from "../PopupType";
import { SceneNames } from "../SceneNames";
import { S_Lobby_RespCancelMatch } from "./Servers/S_Lobby_RespCancelMatch";
import { S_Lobby_DefendInfo } from "./Servers/Cue/S_Lobby_DefendInfo";
import { S_Heartbeat } from "./Servers/S_Heartbeat";
import { C_Heartbeat } from "./Clients/C_Heartbeat";
import { S_Game_LuckBall } from "./Servers/LuckBall/S_Game_LuckBall";
import { getLang } from "../../Framework/Utility/dx/getLang";
import { S_Lobby_NewMail } from "./Servers/Mail/S_Lobby_NewMail";
import { S_Lobby_RespSystemTip } from "./Servers/S_Lobby_RespSystemTip";
import { S_Game_ChangeCue } from "./Servers/S_Game_ChangeCue";
import { S_NewGuide_Match } from "./Servers/S_NewGuide_Match";
import { S_Lobby_MatchTimeOut } from "./Servers/S_Lobby_MatchTimeOut";



export class GameProxy extends FProxy
{
    public static ClassName:string = "GameProxy";

    public isCanShowWindow:boolean = true;
    protected initClient():IClient{return ClientManager.GetClientByName(ClientNames.Lobby);}
    protected connectServer():void
    {
        
        this.isNeedDisposeClient = false;
        var config: ConfigVO = GameDataManager.GetDictData(GameDataKey.Config,ConfigVO);
        let server = config.serverUrl;
        if(!server.startsWith("ws://")&&!server.startsWith("wss://"))server = "ws://"+server;
        this.client.addCallBacks(this, this.onLobbyConnected, null, this.onLobbyClosed, this.onLobbyConnectFail, this.onLobbyConnectFail);
        this.client.connectURL(server);   
    }
    protected initHandlers(): void
    {
        this.addHandler(PacketID.LOGIN,S_Lobby_Login);
        this.addHandler(PacketID.MATCH,S_Lobby_Match);
        this.addHandler(PacketID.MATCH_SUCC,S_Lobby_MatchOK);
        this.addHandler(PacketID.MATCH_TIME_OUT,S_Lobby_MatchTimeOut);
        this.addHandler(PacketID.INIT_ROOM,S_Lobby_EnterRoom);
        this.addHandler(PacketID.MY_CUE,S_Lobby_MyCue); 
        this.addHandler(PacketID.BUY_CUE,S_Lobby_BuyCue); 
        this.addHandler(PacketID.SELL_CUE,S_Lobby_SellCue); 
        this.addHandler(PacketID.UPGRADE_CUE,S_Lobby_UpgradeCue); 
        this.addHandler(PacketID.USE_CUE,S_Lobby_UseCue); 
        this.addHandler(PacketID.ALL_CUE,S_Lobby_AllCue); 
        this.addHandler(PacketID.DEFEND_CUE,S_Lobby_DefendCue); 
        this.addHandler(PacketID.CUE_DEFEND_INFO,S_Lobby_DefendInfo); 
        this.addHandler(PacketID.GET_CONFIG,S_Lobby_Config); 
        this.addHandler(PacketID.GET_TASK,S_Lobby_Task);
        this.addHandler(PacketID.UPDATE_TASK,S_Lobby_UpdateTask);
        this.addHandler(PacketID.GET_TASK_REWARD,S_Lobby_Award);
        this.addHandler(PacketID.GET_ACTIVE_REWARD,S_Lobby_ActiveAward);
        this.addHandler(PacketID.GET_NEW_TASK,S_Lobby_NewTask);
        this.addHandler(PacketID.DRAW_LOTTERY,S_Lobby_DrawLottery);
        this.addHandler(PacketID.GET_RED_PACKET,S_Lobby_GetRedPacket);
        this.addHandler(PacketID.ADD_RED_PACKET,S_Lobby_AddRedPacket);
        this.addHandler(PacketID.ALL_ITEM,S_Lobby_AllItem);
        this.addHandler(PacketID.UPDATE_ITEM,S_Lobby_UpdateItem);
        this.addHandler(PacketID.PERSONAL_INFO,S_Lobby_PersonalInfo);
        this.addHandler(PacketID.GET_ROLE,S_Lobby_GetRole);
        this.addHandler(PacketID.USE_ROLE,S_Lobby_UseRole);
        this.addHandler(PacketID.UPDATE_ROLE,S_Lobby_UpdateRole);
        this.addHandler(PacketID.MEMBER_AWARD,S_Lobby_MemberAward);
        this.addHandler(PacketID.GET_MEMBER_UPGRADE,S_Lobby_MemberUpgrade);
        this.addHandler(PacketID.GET_MAIL,S_Lobby_GetMail);
        this.addHandler(PacketID.NEW_MAIL,S_Lobby_NewMail);
        this.addHandler(PacketID.GET_MEMBER,S_Lobby_GetMember);
        this.addHandler(PacketID.MEMBER_UPGRADE,S_Lobby_MemberPoint);
        
        this.addHandler(PacketID.OPT_PLAYER,S_Game_Option);
        this.addHandler(PacketID.PLAYER_OPT,S_Game_ShotBall);
        this.addHandler(PacketID.CUE_MOVE,S_Game_UpdateBallArm);
        this.addHandler(PacketID.SYNC_POS,S_Game_UpdateBalls);
        this.addHandler(PacketID.SNOOKER,S_Game_PocketBall);

        this.addHandler(PacketID.GAME_SETTLE, S_Game_Settle);
        this.addHandler(PacketID.GET_MINE_BALLS,S_Game_GetMineBalls);
        this.addHandler(PacketID.EMPTY_ROD,S_Game_Illegality);    
        this.addHandler(PacketID.PUT_THE_BALL,S_Game_PutTheBall);   
        this.addHandler(PacketID.UPDATE_GOLD,S_Lobby_UpdateGold);   
        this.addHandler(PacketID.UPDATE_DIAMOND,S_Lobby_UpdateDiamond);  
        this.addHandler(PacketID.UPDATE_RedPacket,S_Lobby_UpdateRedPacket);
        this.addHandler(PacketID.DRAW_CARD,S_Game_DrawCard); 
        this.addHandler(PacketID.REQ_DOUBLE,S_Game_ReqDouble); 
        this.addHandler(PacketID.RESP_DOUBLE,S_Game_RespDouble); 
        this.addHandler(PacketID.NEW_ROUND,S_Game_NewRound); 
        this.addHandler(PacketID.GAME_CHANGE_CUE,S_Game_ChangeCue); 
        this.addHandler(PacketID.RESP_SYSTEM_NOTICE, S_Lobby_RespSystemNotice);
        this.addHandler(PacketID.CANCEL_MATCH, S_Lobby_RespCancelMatch);

        this.addHandler(PacketID.QUIT_GAME,S_Game_ExitGame); 
        this.addHandler(PacketID.FIRST_POLE, S_Game_FirstPole);

        this.addHandler(PacketID.UPDATE_PHYSIC_FRAME,S_Game_UpdatePhysicFrame); 
        this.addHandler(PacketID.OPTION_COMPLETE,S_Game_OptionComplete); 
        this.addHandler(PacketID.GAME_LOTTERY,S_Game_LotteryAward); 
        this.addHandler(PacketID.GAME_TIMES,S_Game_GameTimes); 
        this.addHandler(PacketID.GET_SIGN_CONF, S_Lobby_GetSignConf)
        this.addHandler(PacketID.SURE_SIGN, S_Lobby_SureSign);

        this.addHandler(PacketID.LUCK_BALL_COUNT,S_Game_LuckBallCount); 
	    this.addHandler(PacketID.GET_PAY_MODE, S_Pay_GetPayMode);
        this.addHandler(PacketID.ORDER_ITEM, S_Pay_OrderItem);
        this.addHandler(PacketID.LUCK_BALL_REWARD,S_Game_LuckBallReward); 
        this.addHandler(PacketID.GET_PAY_MODE, S_Pay_GetPayMode);
        this.addHandler(PacketID.Pay_BuySucess, S_Pay_BuySuccess);
        this.addHandler(PacketID.Pay_GetFZBInfo, S_Pay_GetZFBInfo);
        this.addHandler(PacketID.Pay_TurnRedPack, S_Pay_TurnRedPack);
        this.addHandler(PacketID.Pay_WXInfo, S_Pay_GetWXInfo);
        this.addHandler(PacketID.Pay_BinderPhoneCode, S_Pay_BinderPhone);
        this.addHandler(PacketID.Pay_BinderPhone, S_Pay_BinderPhone)
        this.addHandler(PacketID.pushCheckNameInfo, S_Lobby_NameInfo);
        this.addHandler(PacketID.CheckName, S_Lobby_CheckName);
        this.addHandler(PacketID.GET_GAME_CHAT, S_Game_Chat);
        this.addHandler(PacketID.Get_DayMouthGift, S_Lobby_getDayMouthGIft);
        this.addHandler(PacketID.PushDayMouthGift, S_Lobby_PushDayMouthGift);
        this.addHandler(PacketID.reLifeNum, S_Lobby_relifeNum);
        this.addHandler(PacketID.LUCK_BALL,S_Game_LuckBall);
        this.addHandler(PacketID.S2C_SYSTEM_TIP, S_Lobby_RespSystemTip);
        this.addHandler(PacketID.Heartbeat, S_Heartbeat);
        this.addHandler(PacketID.NewGuideMatch, S_NewGuide_Match);
        

    }

    /**大厅服务器连接成功 */
    protected onLobbyConnected() 
    {
        trace("连接游戏大厅成功！！！");
        this.isCanShowWindow = true;
        C_Lobby_Login.Send();
    }
    /**大厅连接被关闭 */
    protected onLobbyClosed() 
    {
        trace("连接被关闭！！！");
        C_Heartbeat.Clear(0,false);
        if(this.isCanShowWindow==false)return;
        showPopup(PopupType.CONFIRM_WINDOW,{msg:getLang("Text_fwqlj"),onConfirm: ()=>
        {
            GameDataManager.SetDictData(GameDataKey.Room,null);
            GameDataManager.SetDictData(GameDataKey.Table,null);
            let loginMediator:LoginMediator = new LoginMediator();
            dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup);
            dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Login,loginMediator));
        }},true);
    }
    /**连接大厅服务器 失败*/
    protected onLobbyConnectFail() 
    {
        C_Heartbeat.Clear(0,false);
        trace("无法连接游戏大厅服务器！！！");
        // dispatchModuleEvent(ModuleEvent.SHOW_MODULE, ModuleNames.Popup,null, GameLayer.Window, {
        //     type: PopupType.CONFIRM_WINDOW, msg: getLang("Text_Login_ConnectFail"), onClose: () => 
        //     {
        //         EventManager.dispatchEventWith(ApplicationEvent.ON_EXIT_APPLICATION);
        //     }
        // });
    }

    public dispose()
    {
        C_Heartbeat.Clear(0,false);
        ClientManager.DisposeClients([this.client.clientName]);
        super.dispose();
    }
}
