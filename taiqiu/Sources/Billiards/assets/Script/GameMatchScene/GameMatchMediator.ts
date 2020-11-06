import { FMediator } from "../../Framework/Core/FMediator";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { SceneEvent } from "../../Framework/Events/SceneEvent";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { showPopup } from "../Common/showPopup";
import { GameEvent } from "../GameEvent";
import { GameMediator } from "../GameScene/GameMediator";
import { LobbyMediator } from "../LobbyScene/LobbyMediator";
import { ModuleNames } from "../ModuleNames";
import { C_Lobby_EnterRoom } from "../Networks/Clients/C_Lobby_EnterRoom";
import { C_Lobby_Match } from "../Networks/Clients/C_Lobby_Match";
import { PopupType } from "../PopupType";
import { SceneNames } from "../SceneNames";
import { MatchModule } from "./MatchModule/MatchModule";
import { GameDataManager } from "../GameDataManager";
import { GameDataKey } from "../GameDataKey";
import { RoomMatchVO } from "../VO/RoomMatchVO";
import { getLang } from "../../Framework/Utility/dx/getLang";


export class GameMatchMediator extends FMediator 
{
    public static ClassName:string = "GameMatchMediator";
    protected gameMediator:FMediator = null;
    /**是否已匹配到玩家 */
    protected isMatchPlayer:boolean = false;
    /**是否加载游戏资源已完成 */
    protected isLoadComplete:boolean = false;
    protected initModules()
    {
        super.initModules();
        this.addModule(ModuleNames.Game_Match,MatchModule);
        addEvent(this,GameEvent.MatchPlayer_Succ,this.onMatchPlayer);
    }
    public showModules()
    {
        super.showModules();
        this.showModule(ModuleNames.Mask,GameLayer.PopupMask);
        this.showModule(ModuleNames.Game_Match,GameLayer.Popup);
    }
    protected addEvents()
    {
        super.addEvents();
        
        addEvent(this,GameEvent.On_Start_Match,this.onStartMatch);
        addEvent(this,GameEvent.EnterRoom_Succ,this.onStartGame);
        addEvent(this,GameEvent.MatchPlayer_TimeOut,this.onMatchTimeout);
        addEvent(this,GameEvent.On_Match_Back,this.onBackLobby);
    }
    protected initDatas()
    {
        super.initDatas();
        if(this.gameMediator==null)
        {
            this.gameMediator = new GameMediator();
            this.gameMediator.initialize();
        }
        this.gameMediator.preloadAssets().addCallback(this,this.onLoadCompleted);
    }
    public matchGame(moneyID,gameID,changID:number)
    {
        C_Lobby_Match.Send(moneyID,gameID,changID);
    }

    protected onMatchPlayer()
    {
        this.isMatchPlayer = true;
        this.onEnterRoom();
    }
    protected onLoadCompleted()
    {
        this.isLoadComplete = true;
        this.onEnterRoom();
    }
    protected onEnterRoom()
    {
        // console.log(this.isLoadComplete,this.isMatchPlayer);
        
        if(!this.isLoadComplete||!this.isMatchPlayer)return;
        setTimeout(()=>C_Lobby_EnterRoom.Send(),2000);
        // dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.GAME,this.gameMediator));
    }
    protected onStartMatch()
    {
        // 获取匹配房间信息
        let roomMatch: RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
        // 开始请求匹配
        this.matchGame(roomMatch.moneyId,roomMatch.gameId,roomMatch.changId);
    }
    protected onStartGame()
    {
        dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Game,this.gameMediator));
    }
    protected onBackLobby()
    {
        this.gameMediator&&this.gameMediator.dispose();
        let lobbyMediator:LobbyMediator = new LobbyMediator();
        dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Lobby,lobbyMediator));
    }
    protected onMatchTimeout(data:any)
    {
        showPopup(PopupType.CONFIRM_WINDOW, {
            msg: getLang("Text_pp",[5]), 
            time: 5,
            onConfirm: this.onBackLobby.bind(this)
        }, true)
    }
}