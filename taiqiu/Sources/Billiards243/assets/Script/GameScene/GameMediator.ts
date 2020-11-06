import { FMediator } from "../../Framework/Core/FMediator";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { FEvent } from "../../Framework/Events/FEvent";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { SceneEvent } from "../../Framework/Events/SceneEvent";
import { AudioManager } from "../../Framework/Managers/AudioManager";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { Physics3DUtility } from "../../Framework/Utility/Physics3DUtility";
import { PointUtility } from "../../Framework/Utility/PointUtility";
import { CanvasOffset } from "../Common/CanvasOffset";
import { LobbyEvent } from "../Common/LobbyEvent";
import { PlayGameID } from "../Common/PlayGameID";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { GameEvent } from "../GameEvent";
import { LobbyCueModule } from "../LobbyScene/LobbyCueModule/LobbyCueModule";
import { LobbyMediator } from "../LobbyScene/LobbyMediator";
import { LobbySetModule } from "../LobbyScene/LobbySetModule/LobbySetModule";
import { ModuleNames } from "../ModuleNames";
import { C_Game_ExitGame } from "../Networks/Clients/C_Game_ExitGame";
import { SceneNames } from "../SceneNames";
import { ConfigVO } from "../VO/ConfigVO";
import { PlayerVO } from "../VO/PlayerVO";
import { RoomMatchVO } from "../VO/RoomMatchVO";
import { RoomVO } from "../VO/RoomVO";
import { TableVO } from "../VO/TableVO";
import { ContactPointModule } from "./ContactPointModule/ContactPointModule";
import { GameBallCueModule } from "./GameBallCueModule/GameBallCueModule";
import { GameBallGuideModule } from "./GameBallGuideModule/GameBallGuideModule";
import { GameChatModule } from "./GameChatModule/GameChatModule";
import { GameFreeKickModule } from "./GameFreeKickModule/GameFreeKickModule";
import { GameLotteryModule } from "./GameLottery/GameLotteryModule";
import { GameOptionModule } from "./GameOptionModule/GameOptionModule";
import { GamePocketCollectModule } from "./GamePocketCollectModule/GamePocketCollectModule";
import { GamePromptModule } from "./GamePrompt/GamePromptModule";
import { GameSettleModule } from "./GameSettleModule/GameSettleModule";
import { GameTableModule } from "./GameTableModule/GameTableModule";
import { GameTopInfoModule } from "./GameTopInfoModule/GameTopInfoModule";
import { GameMatchMediator } from "../GameMatchScene/GameMatchMediator";
import { GameCardMatchMediator } from "../GameCardMatchScene/GameCardMatchMediator";
import { GameSetModule } from "./GameSetModule/GameSetModule";
import { JTimer } from "../../Framework/Timers/JTimer";
import { Fun } from "../../Framework/Utility/dx/Fun";
import { ReconnectionHandler } from "../LoginScene/ReconnectionHandler";
import { EventManager } from "../../Framework/Managers/EventManager";
import { GameGoalsModule } from "./GameGoalsModule/GameGoalsModule";
import { GameReviseModule } from "./GameReviseModule/GameReviseModule";
import { ProxyManager } from "../../Framework/Managers/ProxyManager";
import { GameProxy } from "../Networks/GameProxy";
import { showPopup } from "../Common/showPopup";
import { getLang } from "../../Framework/Utility/dx/getLang";
import { PopupType } from "../PopupType";
import { LoginMediator } from "../LoginScene/LoginMediator";


export class GameMediator extends FMediator 
{
    public static ClassName: string = "GameMediator";
    protected player:PlayerVO = null;
    protected room:RoomVO = null;
    protected config:ConfigVO;
    protected table:TableVO = null;
    protected currentTime:number = null;

    public initialize()
    {
        super.initialize();
        this.config = GameDataManager.GetDictData(GameDataKey.Config,ConfigVO);
        // Physics3DUtility.IsDebug = this.config.isDebug;
        Physics3DUtility.InitPhysic();
    }
    
    public startMediator()
    {
        // cc.view.enableAntiAlias(true);
        super.startMediator();   
        CanvasOffset.Init();
    }
    public initModules(): void 
    {
        super.initModules();
        this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
        
        this.addModule(ModuleNames.Game_TopInfo, GameTopInfoModule,GameEvent.Server_Pocket_Ball,GameEvent.Player_Option, 
            GameEvent.Player_ShotBall, GameEvent.Get_Play_Ball_List,GameEvent.On_Start_NewRound);
        this.addModule(ModuleNames.Game_Table, GameTableModule,GameEvent.Player_Option,GameEvent.Player_ShotBall,
            GameEvent.Update_BallCue,GameEvent.Update_Balls,GameEvent.Server_Pocket_Ball,GameEvent.Server_Game_Settle,
            GameEvent.Player_Illegality,GameEvent.On_Start_NewRound);
        this.addModule(ModuleNames.Game_BallCue, GameBallCueModule,GameEvent.Player_Option,GameEvent.Player_ShotBall,
            GameEvent.Update_BallCue,GameEvent.Server_Pocket_Ball,GameEvent.Server_Game_Settle,GameEvent.On_Start_NewRound);

        this.addModule(ModuleNames.Game_BallGuide, GameBallGuideModule,GameEvent.Player_Option,GameEvent.Player_ShotBall,
            GameEvent.Server_Game_Settle);
        this.addModule(ModuleNames.Game_Option, GameOptionModule,GameEvent.Player_Option,GameEvent.Player_ShotBall);
        this.addModule(ModuleNames.Game_ContactPoint, ContactPointModule,GameEvent.Player_Option);
        this.addModule(ModuleNames.Game_FreeKick,GameFreeKickModule,GameEvent.Player_Illegality,GameEvent.Player_Option,
            GameEvent.Player_ShotBall,GameEvent.On_Start_NewRound);
        this.addModule(ModuleNames.Game_Goals, GameGoalsModule);
        this.addModule(ModuleNames.Game_Settle, GameSettleModule,GameEvent.Server_Game_Settle);
        this.addModule(ModuleNames.Game_PocketCollect,GamePocketCollectModule,GameEvent.Server_Pocket_Ball,GameEvent.On_Start_NewRound);
        this.addModule(ModuleNames.Game_Prompt,GamePromptModule,GameEvent.Player_Option,GameEvent.Get_Play_Ball_List,GameEvent.Player_Illegality);
        this.addModule(ModuleNames.Game_Lottery,GameLotteryModule);
        this.addModule(ModuleNames.Lobby_Set,LobbySetModule);
        this.addModule(ModuleNames.Lobby_CueInfo,LobbyCueModule);
        this.addModule(ModuleNames.GameChatModule,GameChatModule);
        this.addModule(ModuleNames.GameSetModule, GameSetModule);

        this.addModule(ModuleNames.Game_Revise, GameReviseModule,GameEvent.Player_ShotBall);
    }
    public showModules(): void 
    { 
        super.showModules();
        this.showModule(ModuleNames.Game_Table, GameLayer.Root3D);
        this.showModule(ModuleNames.Game_PocketCollect,GameLayer.Root3D);
        this.showModule(ModuleNames.Game_TopInfo, GameLayer.UI);
        this.showModule(ModuleNames.Game_BallCue,GameLayer.UI);
        this.showModule(ModuleNames.Game_BallGuide,GameLayer.UI);
        this.showModule(ModuleNames.Game_Option,GameLayer.UI);
        this.showModule(ModuleNames.Game_FreeKick,GameLayer.UI);
        this.showModule(ModuleNames.Game_Goals, GameLayer.UI);
        this.showModule(ModuleNames.Game_Prompt,GameLayer.UI);
        this.showModule(ModuleNames.Game_Revise,GameLayer.UI);
        this.showModule(ModuleNames.GameChatModule,GameLayer.UI);
        this.showModule(ModuleNames.GameSetModule,GameLayer.UI);
        
    }
    protected addEvents()
    {
        super.addEvents();
        addEvent(this,GameEvent.Player_Option,this.onPlayerOption);
        addEvent(this,GameEvent.Player_ShotBall,this.onPlayerShotBall);
        addEvent(this,GameEvent.Update_BallCue,this.onUpdateBallCue);
        addEvent(this,GameEvent.Update_Balls,this.onUpdateBalls);
        addEvent(this,GameEvent.Server_Pocket_Ball,this.onServerPocketBall);
        addEvent(this,GameEvent.Server_Game_Settle,this.onServerGameSettle);
        addEvent(this,GameEvent.Player_Illegality,this.onPlayerIllegality);   
        addEvent(this,GameEvent.Get_Play_Ball_List,this.onPlayBallList);
        addEvent(this,GameEvent.On_ExitGame,this.exitGame);
        addEvent(this,GameEvent.On_ReMatchGame,this.reMatchGame);
        addEvent(this,ModuleEvent.LOAD_MODULE_ASSET_COMPLETE + ModuleNames.Game_Table,this.loadTableModuleComplete);
        addEvent(this,GameEvent.On_Start_NewRound,this.onStartNewRound);
        addEvent(this,LobbyEvent.Open_LobbySet,this.onOpenLobbySet);
        addEvent(this,LobbyEvent.Open_CueInfo,this.onOpenCueInfo);

        addEvent(this,LobbyEvent.Login_Succ,this.onLoginServerSucc);
        addEvent(this,GameEvent.On_Show_Lottery,this.onShowLottery);

        cc.game.on(cc.game.EVENT_SHOW, this.retConnect,this);
        cc.game.on(cc.game.EVENT_HIDE, this.enterBackground,this);
    }

    //进入后台
    private enterBackground()
    {
        // this.currentTime = new Date().getTime();
        // ProxyManager.ProxyDispose("GameProxy");
		// GameDataManager.SetDictData(GameDataKey.Room,null);
		// GameDataManager.SetDictData(GameDataKey.Table,null);
		// GameDataManager.SetDictData(GameDataKey.Player,null);
    }

    //从后台回来重新连接
    private retConnect() {
        // let time = new Date().getTime();
        // let tempTime = time-this.currentTime;
        // let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        // room.changeNumber++;
        // console.log(room.changeNumber,tempTime);
        // if(room.changeNumber < 3 && tempTime < 3000) return;
        // room.changeNumber = 0;
		ProxyManager.ProxyDispose("GameProxy");
		GameDataManager.SetDictData(GameDataKey.Room,null);
		GameDataManager.SetDictData(GameDataKey.Table,null);
		GameDataManager.SetDictData(GameDataKey.Player,null);
		let loginMediator:LoginMediator = new LoginMediator();
		dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup);
		dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Login,loginMediator));
    }
    private isReconnection = false;
    /**连接服务器成功 */
    protected onLoginServerSucc()
    {
        this.room.reset();
        this.table.reset();
        this.room.isReconnection = true;
        this.isReconnection = true;
        JTimer.ClearTimeOut(this);
        JTimer.TimeOut(this,100,Fun(this.onDelayLoadNextScene,this));
    }
    protected onDelayLoadNextScene()
    {
        let sceneData = ReconnectionHandler.GetNextSceneData();
        Physics3DUtility.Dispose();
        if(sceneData.scene==this.sceneName)// 
        {
            if(!sceneData.canChangeScene)addEvent(this,GameEvent.OtherPlayer_PhysicSleep,this.onOtherPhysicSleep);
            else 
            {
                this.clearBalls();
                dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Preload);
                this.excuteModuleEvent(GameEvent.On_Start_NewRound,"onStartNewRound");
            }
        }else
        {
            sceneData.mediator.initialize();
            sceneData.mediator.preloadAssets().addCallback(this,()=>
            {
                dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,sceneData.scene,sceneData.mediator));
            },null);
        }
    }
    protected onOtherPhysicSleep(evt)
    {
        if(!this.isReconnection)return;
        this.clearBalls();
        this.isReconnection = false;
        ReconnectionHandler.ReSetRoomData(evt.data);
        EventManager.removeEvent(this,GameEvent.OtherPlayer_PhysicSleep,this.onOtherPhysicSleep);
        dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Preload);
        dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Preload);
        this.excuteModuleEvent(GameEvent.On_Start_NewRound,"onStartNewRound");
    }
    protected initDatas()
    {
        super.initDatas();
        
        if(this.player.id==0)// 在测试场景使用快捷键
        {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }else AudioManager.PlayMusic("Billiards_Bg_2");
    }
    /**
     * 加载桌子模块完成
     */
    protected loadTableModuleComplete()
    {
        if(this.room.reconnectFirstPole){
            this.room.reconnectFirstPole = false;
            dispatchFEventWith(GameEvent.On_Start_NewRound);
            return;
        }
            
        if(this.room.optPlayer!=-1 && this.room.gan > 0)
            dispatchFEventWith(GameEvent.Player_Option,this.room.optPlayer);
        // cc.log(this.room)
        // cc.log(' 全部完成加载完成')
    }
    protected onKeyDown(evt)
    {
        if (evt.keyCode == cc.macro.KEY.a)
		{
            let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
            room.optPlayer = 0;
			dispatchFEventWith(GameEvent.Player_Option,room.optPlayer);
        }else if(evt.keyCode == cc.macro.KEY.space)
        {
            let data = {playerID:this.player.id,angle:0,force:this.table.shootForce,velocity:null,
				powerScale:0.3,contactPoint:cc.v2(0,0),gasserAngle:0,hitPoint:null,hitAngle:0};
			dispatchFEventWith(GameEvent.Player_ShotBall,data);
        }
    }
    protected onPlayerIllegality(evt:FEvent)
    {
        let playerID = evt.data.playerID;// 犯规的玩家id
        let type = evt.data.type;
        this.excuteModuleEvent(GameEvent.Player_Illegality,"onPlayerIllegality",playerID,type);
    }
    protected onServerPocketBall(evt:FEvent)
    {
        let playerID = evt.data.playerID;
        let balls = evt.data.numbers;
        this.excuteModuleEvent(GameEvent.Server_Pocket_Ball,"onSetPocketBall",playerID,balls);
    }
    protected onPlayerOption(evt:FEvent)
    {
        let playerID = evt.data;
        this.excuteModuleEvent(GameEvent.Player_Option,"onPlayerOption",playerID);
    }
    protected onPlayerShotBall(evt:FEvent)
    {
        evt.data.force = PointUtility.Object2Point(cc.v3(),evt.data.force);
		evt.data.velocity = PointUtility.Object2Point(cc.v3(),evt.data.velocity);
        evt.data.contactPoint = PointUtility.Object2Point(cc.v2(),evt.data.contactPoint);	
        this.excuteModuleEvent(GameEvent.Player_ShotBall,"onPlayerShotBall",evt.data);
    }
    protected onUpdateBallCue(evt)
    {
        // cc.log('onUpdateBallCue')
        this.excuteModuleEvent(GameEvent.Update_BallCue,"onUpdateBallCue",evt.data);
    }
    protected onUpdateBalls(evt)
    {
        // cc.log('onUpdateBalls')
        this.excuteModuleEvent(GameEvent.Update_Balls,"onUpdateBalls",evt.data);
    }
    protected onPlayBallList(evt)
    {
        // cc.log('onPlayBallList')
        this.excuteModuleEvent(GameEvent.Get_Play_Ball_List,"onPlayBallList",evt.data);
    }
    protected onServerGameSettle(evt)
    {
        this.showModule(ModuleNames.Game_Settle,GameLayer.UI);
        this.excuteModuleEvent(GameEvent.Server_Game_Settle,"onGameSettle",evt.data);
    }

    protected onShowLottery()
    {
        let roomMatch:RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
        let roomInfo = roomMatch.getRoomInfo();
        if(roomInfo.gameNum >= 3) {
            setTimeout(()=>{
                this.showModule(ModuleNames.Game_Lottery,GameLayer.UI);
            },2000);
        }
    }

    /** 断线后重新连接之前，需要重置下游戏信息 */
    public retGameInfo(){
        // this.onStartNewRound();//   
        // this.dispose();
        GameDataManager.SetDictData(GameDataKey.Room,null);
        GameDataManager.SetDictData(GameDataKey.Table,null);
    }

    /**开始新一轮游戏 */
    protected onStartNewRound()
    {
        this.room.reset();
        this.table.reset();
        this.clearBalls();
        dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Game_Settle);
        this.excuteModuleEvent(GameEvent.On_Start_NewRound,"onStartNewRound");
        
    }
    private onOpenLobbySet() 
    {
        this.showModule(ModuleNames.Lobby_Set,GameLayer.Popup);
    }
    private onOpenCueInfo() {
        dispatchFEventWith(GameEvent.onShowSetType,'gameInfo'); // 向table传输数据，然后修改球的位置

        this.showModule(ModuleNames.Lobby_CueInfo,GameLayer.UI);
    }
    /**退出游戏 */
    protected exitGame()
    {
        C_Game_ExitGame.Send();
        GameDataManager.SetDictData(GameDataKey.Room,null);
        GameDataManager.SetDictData(GameDataKey.Table,null);
        if(this.player.id==0)return;
        let lobbyMediator:LobbyMediator = new LobbyMediator();
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup);
		dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Lobby,lobbyMediator));
    }
    /**重新匹配 */
    protected reMatchGame()
    {
        C_Game_ExitGame.Send();
        GameDataManager.SetDictData(GameDataKey.Room,null);
        GameDataManager.SetDictData(GameDataKey.Table,null);
        if(this.player.id==0)return;
        let roomMatch: RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
        let gameId = roomMatch.gameId;
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

    protected clearBalls()
    {
        if(!this.table)return;
        if(!this.table.whiteBall)return;
        this.table.whiteBall.destroy();
		while(this.table.balls.length>0)
            this.table.balls.shift().destroy();
    }
    public dispose()
    {
        if(!this.isReconnection)
        {
            Physics3DUtility.Dispose();
            GameDataManager.SetDictData(GameDataKey.Room,null);
            GameDataManager.SetDictData(GameDataKey.Table,null);
        }
        cc.game.off(cc.game.EVENT_SHOW, this.retConnect,this);
        cc.game.off(cc.game.EVENT_HIDE, this.enterBackground,this);

        super.dispose();
        this.clearBalls();
    }
}