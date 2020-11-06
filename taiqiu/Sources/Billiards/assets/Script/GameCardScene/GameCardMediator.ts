import { GameLayer } from "../../Framework/Enums/GameLayer";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { GameEvent } from "../GameEvent";
import { ContactPointModule } from "../GameScene/ContactPointModule/ContactPointModule";
import { GameFreeKickModule } from "../GameScene/GameFreeKickModule/GameFreeKickModule";
import { GameMediator } from "../GameScene/GameMediator";
import { GameOptionModule } from "../GameScene/GameOptionModule/GameOptionModule";
import { GameTableModule } from "../GameScene/GameTableModule/GameTableModule";
import { ModuleNames } from "../ModuleNames";
import { PlayerVO } from "../VO/PlayerVO";
import { RoomVO } from "../VO/RoomVO";
import { TableVO } from "../VO/TableVO";
import { GameCardSettleModule } from "./GameCardSettleModule/GameCardSettleModule";
import { GameShowCardModule } from "./GameShowCardModule/GameShowCardModule";
import { GameShowResultModule } from "./GameShowResultModule/GameShowResultModule";
import { GameCardTopInfoModule } from "./GameTopInfoModule/GameCardTopInfoModule";
import { GameBallCueModule } from "../GameScene/GameBallCueModule/GameBallCueModule";
import { GamePocketCollectModule } from "../GameScene/GamePocketCollectModule/GamePocketCollectModule";
import { GameLotteryModule } from "../GameScene/GameLottery/GameLotteryModule";
import { LobbySetModule } from "../LobbyScene/LobbySetModule/LobbySetModule";
import { LobbyCueModule } from "../LobbyScene/LobbyCueModule/LobbyCueModule";
import { GameBallGuideModule } from "../GameScene/GameBallGuideModule/GameBallGuideModule";
import { GamePromptModule } from "../GameScene/GamePrompt/GamePromptModule";
import { GameSetModule } from "../GameScene/GameSetModule/GameSetModule";
import { GameChatModule } from "../GameScene/GameChatModule/GameChatModule";
import { GameGoalsModule } from "../GameScene/GameGoalsModule/GameGoalsModule";
import { GameReviseModule } from "../GameScene/GameReviseModule/GameReviseModule";

/**
*@description:GameCardScene
**/
export class GameCardMediator  extends GameMediator
{
	public static ClassName: string = "GameCardSceneMediator";
	
	protected table:TableVO = null;
	public initModules(): void 
    {
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		
		
		this.addModule(ModuleNames.Game_ShowCard,GameShowCardModule);
        this.addModule(ModuleNames.Game_TopInfo, GameCardTopInfoModule,GameEvent.Server_Pocket_Ball,GameEvent.Player_Option, 
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
		this.addModule(ModuleNames.Game_Prompt,GamePromptModule,GameEvent.Player_Option,GameEvent.Get_Play_Ball_List,GameEvent.Player_Illegality);
		this.addModule(ModuleNames.Game_PocketCollect,GamePocketCollectModule,GameEvent.Server_Pocket_Ball,GameEvent.On_Start_NewRound);
		this.addModule(ModuleNames.Game_ShowResult,GameShowResultModule,GameEvent.Server_Game_Settle);
		this.addModule(ModuleNames.Game_Settle, GameCardSettleModule,GameEvent.Server_Game_Settle);
		this.addModule(ModuleNames.Game_Lottery,GameLotteryModule);
        this.addModule(ModuleNames.Lobby_Set,LobbySetModule);
		this.addModule(ModuleNames.Lobby_CueInfo,LobbyCueModule);
        this.addModule(ModuleNames.GameSetModule, GameSetModule);
		this.addModule(ModuleNames.GameChatModule,GameChatModule);
		this.addModule(ModuleNames.Game_Revise, GameReviseModule,GameEvent.Player_ShotBall);
		
	} 
	public showModules(): void 
    {
		if(!this.room.isReconnection)
		{
			this.showModule(ModuleNames.Game_ShowCard,GameLayer.Popup);
		}
        this.showModule(ModuleNames.GameSetModule,GameLayer.UI);
        this.showModule(ModuleNames.GameChatModule,GameLayer.UI);
		
		super.showModules();
	}
	
	protected onServerGameSettle(evt)
    {
        this.showModule(ModuleNames.Game_ShowResult,GameLayer.UI);
        this.excuteModuleEvent(GameEvent.Server_Game_Settle,"onGameSettle",evt.data);
    }
}
