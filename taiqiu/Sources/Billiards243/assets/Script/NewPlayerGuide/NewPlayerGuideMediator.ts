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
import { ContactPointModule } from "../GameScene/ContactPointModule/ContactPointModule";
import { GameBallCueModule } from "../GameScene/GameBallCueModule/GameBallCueModule";
import { GameBallGuideModule } from "../GameScene/GameBallGuideModule/GameBallGuideModule";
import { GameChatModule } from "../GameScene/GameChatModule/GameChatModule";
import { GameFreeKickModule } from "../GameScene/GameFreeKickModule/GameFreeKickModule";
import { GameGoalsModule } from "../GameScene/GameGoalsModule/GameGoalsModule";
import { GameLotteryModule } from "../GameScene/GameLottery/GameLotteryModule";
import { GameMediator } from "../GameScene/GameMediator";
import { GameOptionModule } from "../GameScene/GameOptionModule/GameOptionModule";
import { GamePocketCollectModule } from "../GameScene/GamePocketCollectModule/GamePocketCollectModule";
import { GamePromptModule } from "../GameScene/GamePrompt/GamePromptModule";
import { GameReviseModule } from "../GameScene/GameReviseModule/GameReviseModule";
import { GameSetModule } from "../GameScene/GameSetModule/GameSetModule";
import { GameSettleModule } from "../GameScene/GameSettleModule/GameSettleModule";
import { GameTableModule } from "../GameScene/GameTableModule/GameTableModule";
import { GameTopInfoModule } from "../GameScene/GameTopInfoModule/GameTopInfoModule";
import { GuideEvent } from "../GuideEvent";
import { LobbyCueModule } from "../LobbyScene/LobbyCueModule/LobbyCueModule";
import { LobbyMediator } from "../LobbyScene/LobbyMediator";
import { LobbySetModule } from "../LobbyScene/LobbySetModule/LobbySetModule";
import { ModuleNames } from "../ModuleNames";
import { C_Game_ExitGame } from "../Networks/Clients/C_Game_ExitGame";
import { SceneNames } from "../SceneNames";
import { ConfigVO } from "../VO/ConfigVO";
import { NewPlayerVO } from "../VO/NewPlayerVO";
import { PlayerVO } from "../VO/PlayerVO";
import { RoomMatchVO } from "../VO/RoomMatchVO";
import { RoomVO } from "../VO/RoomVO";
import { TableVO } from "../VO/TableVO";
import { GameTrainBallCueModule } from "./GameTrainBallCueModule/GameTrainBallCueModule";
import { GameTrainTableModule } from "./GameTrainTableModule/GameTrainTableModule";
import { NewPlayerGuideModule } from "./NewPlayerGuideModule/NewPlayerGuideModule";


export class NewPlayerGuideMediator extends GameMediator {
    public static ClassName: string = "GameMediator";
    protected player: PlayerVO = null;
    protected room: RoomVO = null;
    protected config: ConfigVO;
    protected table: TableVO = null;

    // public initialize()
    // {
    //     super.initialize();
    //     this.config = GameDataManager.GetDictData(GameDataKey.Config,ConfigVO);
    //     // Physics3DUtility.IsDebug = this.config.isDebug;
    //     Physics3DUtility.InitPhysic();
    // }

    // public startMediator(): void 
    // {
    //     super.startMediator();   
    //     CanvasOffset.Init();
    // }

    // protected initDatas()
    // {
    //     super.initDatas();

    //     if(this.player.id==0)// 在测试场景使用快捷键
    //     {
    //         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    //     }else AudioManager.PlayMusic("Billiards_Bg_2");
    // }

    public initModules(): void {
        // super.initModules();
        // 新手引导
        let guide: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide, NewPlayerVO);
        if (guide.isNeedGuide) {
            this.addModule(GuideEvent.newPlayerModule, NewPlayerGuideModule);
        }
        // this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
        this.table = GameDataManager.GetDictData(GameDataKey.Table, TableVO);

        this.addModule(ModuleNames.Game_TopInfo, GameTopInfoModule, GameEvent.Server_Pocket_Ball, GameEvent.Player_Option,
            GameEvent.Player_ShotBall, GameEvent.Get_Play_Ball_List, GameEvent.On_Start_NewRound);
        this.addModule(ModuleNames.Game_Table, GameTrainTableModule, GameEvent.Player_Option, GameEvent.Player_ShotBall,
            GameEvent.Update_BallCue, GameEvent.Update_Balls, GameEvent.Server_Pocket_Ball, GameEvent.Server_Game_Settle,
            GameEvent.Player_Illegality, GameEvent.On_Start_NewRound);
        this.addModule(ModuleNames.Game_BallCue, GameBallCueModule, GameEvent.Player_Option, GameEvent.Player_ShotBall,
            GameEvent.Update_BallCue, GameEvent.Server_Pocket_Ball, GameEvent.Server_Game_Settle, GameEvent.On_Start_NewRound);

        this.addModule(ModuleNames.Game_BallGuide, GameBallGuideModule, GameEvent.Player_Option, GameEvent.Player_ShotBall,
            GameEvent.Server_Game_Settle);
        this.addModule(ModuleNames.Game_Option, GameOptionModule, GameEvent.Player_Option, GameEvent.Player_ShotBall);
        this.addModule(ModuleNames.Game_ContactPoint, ContactPointModule, GameEvent.Player_Option);
        this.addModule(ModuleNames.Game_FreeKick, GameFreeKickModule, GameEvent.Player_Illegality, GameEvent.Player_Option,
            GameEvent.Player_ShotBall, GameEvent.On_Start_NewRound);
        this.addModule(ModuleNames.Game_Goals, GameGoalsModule);
        this.addModule(ModuleNames.Game_Settle, GameSettleModule, GameEvent.Server_Game_Settle);
        this.addModule(ModuleNames.Game_PocketCollect, GamePocketCollectModule, GameEvent.Server_Pocket_Ball, GameEvent.On_Start_NewRound);
        this.addModule(ModuleNames.Game_Prompt, GamePromptModule, GameEvent.Player_Option, GameEvent.Get_Play_Ball_List, GameEvent.Player_Illegality);
        this.addModule(ModuleNames.Game_Lottery, GameLotteryModule);
        this.addModule(ModuleNames.Lobby_Set, LobbySetModule);
        this.addModule(ModuleNames.Lobby_CueInfo, LobbyCueModule);
        this.addModule(ModuleNames.GameChatModule, GameChatModule);
        this.addModule(ModuleNames.GameSetModule, GameSetModule);

        this.addModule(ModuleNames.Game_Revise, GameReviseModule, GameEvent.Player_ShotBall);

    }
    // public showModules(): void 
    // { 
    //     super.showModules();
    //     this.showModule(ModuleNames.Game_Table, GameLayer.Root3D);
    //     this.showModule(ModuleNames.Game_PocketCollect,GameLayer.Root3D);
    //     this.showModule(ModuleNames.Game_TopInfo, GameLayer.UI);
    //     this.showModule(ModuleNames.Game_BallCue,GameLayer.UI);
    //     this.showModule(ModuleNames.Game_BallGuide,GameLayer.UI);
    //     this.showModule(ModuleNames.Game_Option,GameLayer.UI);
    //     this.showModule(ModuleNames.Game_Revise,GameLayer.UI);
    //     this.showModule(ModuleNames.Game_FreeKick,GameLayer.UI);
    //     this.showModule(ModuleNames.Game_Goals, GameLayer.UI);
    //     this.showModule(ModuleNames.Game_Prompt,GameLayer.UI);
    //     this.showModule(ModuleNames.Game_Revise,GameLayer.UI);
    //     this.showModule(ModuleNames.GameChatModule,GameLayer.UI);
    //     this.showModule(ModuleNames.GameSetModule,GameLayer.UI);

    // }
    protected addEvents() {
        super.addEvents(); // GuideEvent.MatchEnd
        addEvent(this, GuideEvent.newGuideFinished, this.onNewGuideFinished);
        addEvent(this, GuideEvent.MatchEnd, this.onMatchEnd);
        addEvent(this, GameEvent.On_Lottery_Complete, this.onLotteryComplete);
        cc.game.off(cc.game.EVENT_SHOW);
        cc.game.off(cc.game.EVENT_HIDE);

    }

    // 击球引导结束 进入大厅
    onNewGuideFinished() {
        let lobbyMediator: LobbyMediator = new LobbyMediator();
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE, ModuleNames.Preload, null, GameLayer.Popup);
        dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE, SceneNames.Lobby, lobbyMediator));
    }

    // 匹配
    onMatchEnd() {
        setTimeout(() => {
            this.showModule(ModuleNames.Game_Lottery, GameLayer.UI);
        }, 2000);
    }

    onLotteryComplete() {
        this.onNewGuideFinished();
    }

    protected loadTableModuleComplete() {

        if(!this.room) {
            this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        }
        if (this.room.reconnectFirstPole) {
            this.room.reconnectFirstPole = false;
            dispatchFEventWith(GameEvent.On_Start_NewRound);
            return;
        }

        if (this.room.optPlayer != -1 && this.room.gan > 0)
            dispatchFEventWith(GameEvent.Player_Option, this.room.optPlayer);

    }
}