import { FMediator } from "../../Framework/Core/FMediator";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { SceneEvent } from "../../Framework/Events/SceneEvent";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { PlayGameID } from "../Common/PlayGameID";
import { GameCardMatchMediator } from "../GameCardMatchScene/GameCardMatchMediator";
import { GameMatchMediator } from "../GameMatchScene/GameMatchMediator";
import { ModuleNames } from "../ModuleNames";
import { SceneNames } from "../SceneNames";
import { LobbyBottomBarModule } from "./BottomBarModule/LobbyBottomBarModule";
import { LobbyCueModule } from "./LobbyCueModule/LobbyCueModule";
import { LobbySetModule } from "./LobbySetModule/LobbySetModule";
import { LobbyTaskModule } from "./LobbyTask/LobbyTaskModule";
import { LobbyNavigationModule } from "./NavigationModule/LobbyNavigationModule";
import { LobbyOtherGameModule } from "./OtherGameModule/LobbyOtherGameModule";
import { PersonalInfoModule } from "./PersonalInfoModule/PersonalInfoModule";
import { LobbyPlayActivityModule } from "./PlayActivityModule/LobbyPlayActivityModule";
import { LobbyRoomModule } from "./RoomModule/LobbyRoomModule";
import { LobbyRedPacketModule } from "./LobbyRedPacketModule/LobbyRedPacketModule";
import { C_Lobby_GetItem } from "../Networks/Clients/C_Lobby_GetItem";
import { LobbyRoleModule } from "./LobbyRole/LobbyRoleModule";
import { GameDataManager } from "../GameDataManager";
import { GameDataKey } from "../GameDataKey";
import { RoomMatchVO } from "../VO/RoomMatchVO";
import { LobbyMemberModule } from "./LobbyMemberModule/LobbyMemberModule";
import { LobbyShopModule } from "./LobbyShop/LobbyShopModule";
import { LobbyEvent } from "../Common/LobbyEvent";
import { GameLuckBallMediator } from "../GameLuckBallScene/GameLuckBallMediator";
import { RoomVO } from "../VO/RoomVO";
import { LobbyActivityModule } from "./LobbyActivityModule/LobbyActivityModule";
import { LobbyMailModule } from "./LobbyMailModule/LobbyMailModule";
import { C_Lobby_GetMember } from "../Networks/Clients/Member/C_Lobby_GetMember";
import { AudioManager } from "../../Framework/Managers/AudioManager";
import { LobbySignActivityModule } from "./LobbySignActivityModule/LobbySignActivityModule";
import { C_Lobby_GetSignConf } from "../Networks/Clients/Sign/C_Lobby_GetSignConf";
import { PayModeModule } from "./PayModeModule/PayModeModule";
import { PayEvent } from "../Common/PayEvent";
import { LobbyFirstPayModule } from "./LobbyFirstPayModule/LobbyFirstPayModule";
import { LobbyMouthVipModule } from "./LobbyMouthVipModule/LobbyMouthVipModule";
import { FEvent } from "../../Framework/Events/FEvent";
import { ShopGoodsVo } from "../VO/ShopGoodsVo";
import { PopupType } from "../PopupType";
import { showPopup } from "../Common/showPopup";
import { GoodsItemVO } from "../VO/GoodsItemVO";
import { Pay_RedPackageZFBModule } from "../Pay/Pay_RedPackageZFBModule/Pay_RedPackageZFBModule";
import { binderPhoneModule } from "../Pay/binderPhoneModule/binderPhoneModule";
import { WXPlantformModule } from "../Pay/WXPlantformModule/WXPlantformModule";
import { LobbyCheckNameModule } from "../Pay/LobbyCheckNameModule/LobbyCheckNameModule";
import { LobbyRelifeModule } from "./LobbyRelifeModule/LobbyRelifeModule";
import { LobbyDayNouthGiftModule } from "./LobbyDayNouthGiftModule/LobbyDayNouthGiftModule";
import { PlayerVO } from "../VO/PlayerVO";
import { C_Lobby_getAcivityInfo } from "../Networks/Clients/C_Lobby_getAcivityInfo";
import { LobbyServerModule } from "./LobbyServer/LobbyServerModule";
import { getLang } from "../../Framework/Utility/dx/getLang";
import { GoodsId } from "./PayModeModule/PayDefine";
import { C_Lobby_GetMail } from "../Networks/Clients/Mail/C_Lobby_GetMail";
import { C_Lobby_GetTask } from "../Networks/Clients/Task/C_Lobby_GetTask";
import { LobbyWeekModule } from "./LobbyWeekModule/LobbyWeekModule";
import { C_Lobby_ReqSystemTip } from "../Networks/Clients/C_Lobby_ReqSystemTip";
import { ZFBGuideModule } from "../Pay/ZFBGuideModule/ZFBGuideModule";


export class LobbyMediator extends FMediator
{
    public static ClassName:string = "LobbyMediator";
    
    protected initModules()
    {
        super.initModules();
        this.addModule(ModuleNames.Lobby_Room,LobbyRoomModule);
        this.addModule(ModuleNames.Lobby_Navigation,LobbyNavigationModule);
        this.addModule(ModuleNames.Lobby_BottomBar,LobbyBottomBarModule);
        this.addModule(ModuleNames.Lobby_PlayActivity,LobbyPlayActivityModule);
        this.addModule(ModuleNames.Lobby_OtherGame,LobbyOtherGameModule);
        this.addModule(ModuleNames.Lobby_PersonalInfo,PersonalInfoModule);
        this.addModule(ModuleNames.Lobby_CueInfo,LobbyCueModule);
        this.addModule(ModuleNames.Lobby_Set,LobbySetModule);
        this.addModule(ModuleNames.Lobby_Task,LobbyTaskModule);
        this.addModule(ModuleNames.Lobby_RedPacket,LobbyRedPacketModule);
        this.addModule(ModuleNames.Lobby_Role,LobbyRoleModule);
		this.addModule(ModuleNames.Lobby_Member,LobbyMemberModule);
        this.addModule(ModuleNames.Lobby_Shop,LobbyShopModule);
        this.addModule(ModuleNames.Lobby_Activity,LobbyActivityModule);
        this.addModule(ModuleNames.Lobby_Mail,LobbyMailModule);
        // this.addModule(ModuleNames.Lobby_OtherActivity, LobbyOtherActivityEnterModule);
        this.addModule(ModuleNames.Lobby_SignActivity, LobbySignActivityModule);
        this.addModule(ModuleNames.Pay_modeModule, PayModeModule);
        this.addModule(ModuleNames.Lobby_FirstPay, LobbyFirstPayModule);
        this.addModule(ModuleNames.Lobby_MouthVip, LobbyMouthVipModule);
        this.addModule(ModuleNames.Pay_RedPackZFB, Pay_RedPackageZFBModule);
        this.addModule(ModuleNames.Pay_BinderPhone, binderPhoneModule);
        this.addModule(ModuleNames.Pay_WXYindao, WXPlantformModule);
        this.addModule(ModuleNames.CheckNameModule, LobbyCheckNameModule);
        this.addModule(ModuleNames.Lobby_ReLife, LobbyRelifeModule);
        this.addModule(ModuleNames.DayMouthGift, LobbyDayNouthGiftModule);
        this.addModule(ModuleNames.LobbyServerSystem, LobbyServerModule);
        this.addModule(ModuleNames.weekVipModule, LobbyWeekModule);
        this.addModule(ModuleNames.ZFBGuideModule, ZFBGuideModule)

        
    }
    public showModules()
    {
        super.showModules();
        this.showModule(ModuleNames.Lobby_Room,GameLayer.Content);
        this.showModule(ModuleNames.Lobby_Navigation,GameLayer.Content);
        this.showModule(ModuleNames.Lobby_BottomBar,GameLayer.Content);
        this.showModule(ModuleNames.Lobby_PlayActivity,GameLayer.Content); 
        this.showModule(ModuleNames.Lobby_OtherGame,GameLayer.Content); 
        // this.showModule(ModuleNames.Lobby_OtherActivity,GameLayer.Content);
    }

    protected addEvents()
    {
        super.addEvents();
        addEvent(this,LobbyEvent.Open_PersonalInfo,this.onOpenPersonalInfo);
        addEvent(this,LobbyEvent.Open_CueInfo,this.onOpenCueInfo);
        addEvent(this,LobbyEvent.Open_LobbySet,this.onOpenLobbySet);
        addEvent(this,LobbyEvent.Open_LobbyTask,this.onOpenLobbyTask);
        addEvent(this,LobbyEvent.Open_LobbyRedPacket,this.onOpenLobbyRedPacket);
        addEvent(this,LobbyEvent.Open_LobbyRole,this.onOpenLobbyRole);
		addEvent(this,LobbyEvent.Open_LobbyMember,this.onOpenLobbyMember);
        addEvent(this,LobbyEvent.Open_LobbyShop,this.onOpenLobbyShop);
        addEvent(this,LobbyEvent.Open_LobbyActivity,this.onOpenLobbyActivity);
        addEvent(this,LobbyEvent.Open_LobbyMail,this.onOpenLobbyMail);
        addEvent(this,LobbyEvent.On_Selected_Room,this.onSelectedRoom);

        addEvent(this,LobbyEvent.On_Play_LuckBall,this.onPlayLuckBall);
        addEvent(this,LobbyEvent.Open_LobbySign, this.onOpenLobbySign);
        addEvent(this,LobbyEvent.Open_PayModeLayer, this.onOpenPayModeLayer);

        // addEvent(this,PayEvent.Pay_ServerUpdate,  this.onPayBuyItem);

        addEvent(this, LobbyEvent.Open_LobbyMouthVip, this.onOpenMouthVip);
        addEvent(this, LobbyEvent.Open_LobbyFirstPay, this.onOpenFirstPay);

        addEvent(this, PayEvent.Pay_ServerBuySuccess, this.onPaySuccess);
        addEvent(this, PayEvent.Pay_openRedPack_ZFB, this.OnOpenReadPack);
        addEvent(this, PayEvent.Pay_OpenPhoneBinder, this.onOpenBinderPhone);

        addEvent(this, PayEvent.Pay_OpenWXYindao, this.onOpenWxYindao);
        addEvent(this, LobbyEvent.Open_CheckName, this.openCheckName);
        addEvent(this, LobbyEvent.Open_reLife, this.onOpenRelife);
        addEvent(this, LobbyEvent.Open_dayMouthGift, this.onOpenDayGift);
        addEvent(this, LobbyEvent.Open_LobbyServer, this.onShowServerSystem);
        addEvent(this, LobbyEvent.Open_LobbyWeekVip, this.onOpenWeekVip)
        addEvent(this, PayEvent.ZFB_Yindao, this.onZFBYindao);


    }

    protected initDatas()
    {
        super.initDatas();
        AudioManager.PlayMusic("Billiards_Bg_3");

        C_Lobby_GetItem.Send();//获取道具
        
        C_Lobby_GetMember.Send();//获取会员

        C_Lobby_GetMail.Send();//获取邮件
        //获取任务
        for(let i = 0; i < 3; i++) {
            C_Lobby_GetTask.Send(i+1);
        }
        C_Lobby_ReqSystemTip.Send();//获取系统提示
    }
    protected onSelectedRoom(evt)
    {
        let moneyId = evt.data.moneyId;
        let gameId = evt.data.gameId;
        let changId = evt.data.changId;

        let roomMatch: RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
        [roomMatch.moneyId,roomMatch.gameId,roomMatch.changId] = [moneyId,gameId,changId];

        let matchMediator:GameMatchMediator = null;
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup,{isShowMask:true});
		if(gameId==PlayGameID.Card54||gameId==PlayGameID.Card15)matchMediator = new GameCardMatchMediator();// 抽牌玩法
		else matchMediator = new GameMatchMediator();
		matchMediator.initialize();
		matchMediator.preloadAssets().addCallback(this,()=>
		{
			let sceneName = SceneNames.Game_Match;
			if(gameId==PlayGameID.Card54||gameId==PlayGameID.Card15)sceneName = SceneNames.Game_Card_Match;
			dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE, sceneName,matchMediator));
		});
    }

    protected onPlayLuckBall()
    {
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup,{isShowMask:true});
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let mediator:GameLuckBallMediator = new GameLuckBallMediator();
        room.gameId = PlayGameID.LuckBall;
        mediator.initialize();
        mediator.preloadAssets().addCallback(this,()=>
        {
            dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE, SceneNames.Game_LuckBall,mediator));
        });
    }

    private onOpenPersonalInfo() 
    {
        this.showModule(ModuleNames.Lobby_PersonalInfo,GameLayer.UI);
    }
    private onOpenCueInfo() {
        this.showModule(ModuleNames.Lobby_CueInfo,GameLayer.UI);
    }
    private onOpenLobbySet() 
    {
        this.showModule(ModuleNames.Lobby_Set,GameLayer.Popup);
    }
    private onOpenLobbyTask() 
    {
        this.showModule(ModuleNames.Lobby_Task,GameLayer.UI);
    }
    private onOpenLobbyRedPacket() 
    {
        this.showModule(ModuleNames.Lobby_RedPacket,GameLayer.Popup);
    }
    private onOpenLobbyRole()
    {
        this.showModule(ModuleNames.Lobby_Role,GameLayer.UI);
    }
	private onOpenLobbyMember()
    {
        this.showModule(ModuleNames.Lobby_Member,GameLayer.Popup);
    }
    private onOpenLobbyShop()
    {
        this.showModule(ModuleNames.Lobby_Shop,GameLayer.UI);
    }

    private onOpenLobbyActivity()
    {
        let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        player.isOpenNotice = true;
        this.showModule(ModuleNames.Lobby_Activity,GameLayer.Popup);
    }
    private onOpenLobbyMail()
    {
        this.showModule(ModuleNames.Lobby_Mail,GameLayer.Popup);
    }
    private onOpenLobbySign() {
        this.showModule(ModuleNames.Lobby_SignActivity,GameLayer.Popup);
    }
    private onOpenPayModeLayer() {
        this.showModule(ModuleNames.Pay_modeModule,GameLayer.Popup);
    }


    private onOpenMouthVip () {
        this.showModule(ModuleNames.Lobby_MouthVip, GameLayer.Popup);
    }

    private onOpenFirstPay() {
        this.showModule(ModuleNames.Lobby_FirstPay, GameLayer.Popup);
    }

    private onPaySuccess (event: FEvent) {
        let data: {id:number} = event.data;
        let shopData:ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
       
        let item:GoodsItemVO = shopData.getGoodsById( data.id);
        console.log("====================onPaySuccess", data.id, "==========", item && item.price);
        if(!item) {
            return;
        }
        let goodType = item.goodsType;
        let count = item.count + item.addCount;
        if(item.goodsId == GoodsId.MouthVip) { // 月卡单独处理 
            goodType = 2;
            count = item.count;
        }
        if(goodType < 3) {
            showPopup(PopupType.GET_REWARD, {list: [{id:goodType, num:count}]}, false);
        } else {
            showPopup(PopupType.TOAST, {msg: getLang("Text_gmcg")});
        }
        C_Lobby_getAcivityInfo.Send();
    }

    private OnOpenReadPack() {
        cc.log("=============OnOpenReadPack==========");
        this.showModule(ModuleNames.Pay_RedPackZFB, GameLayer.Popup);
    }

    private onOpenBinderPhone() {
        this.showModule(ModuleNames.Pay_BinderPhone, GameLayer.Popup);
    }

    private onOpenWxYindao () {
        this.showModule(ModuleNames.Pay_WXYindao, GameLayer.Popup);
    }

    private openCheckName () {
        this.showModule(ModuleNames.CheckNameModule, GameLayer.Popup);
    }

    private onOpenRelife () {
        this.showModule(ModuleNames.Lobby_ReLife, GameLayer.Popup);
    }

    private onOpenDayGift () {
        this.showModule(ModuleNames.DayMouthGift, GameLayer.Popup);
    }

    private onShowServerSystem () {
        this.showModule(ModuleNames.LobbyServerSystem, GameLayer.Popup);
    }

    private onOpenWeekVip() {
        this.showModule(ModuleNames.weekVipModule, GameLayer.Popup);
    }

    private onZFBYindao() {
        this.showModule(ModuleNames.ZFBGuideModule, GameLayer.Popup);
    }
}
