import { Application } from "../../Framework/Core/Application";
import { FMediator } from "../../Framework/Core/FMediator";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { FEvent } from "../../Framework/Events/FEvent";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { SceneEvent } from "../../Framework/Events/SceneEvent";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { getNodeChildByName } from "../../Framework/Utility/dx/getNodeChildByName";
import { Physics3DUtility } from "../../Framework/Utility/Physics3DUtility";
import { CanvasOffset } from "../Common/CanvasOffset";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { GameEvent } from "../GameEvent";
import { GameOptionModule } from "../GameScene/GameOptionModule/GameOptionModule";
import { LobbyMediator } from "../LobbyScene/LobbyMediator";
import { ModuleNames } from "../ModuleNames";
import { C_Game_ExitGame } from "../Networks/Clients/C_Game_ExitGame";
import { SceneNames } from "../SceneNames";
import { ConfigVO } from "../VO/ConfigVO";
import { PlayerVO } from "../VO/PlayerVO";
import { RoomVO } from "../VO/RoomVO";
import { TableVO } from "../VO/TableVO";
import { GameLuckBallTableModule } from "./GameTableModule/GameLuckBallTableModule";
import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";
import { GameBallCueModule } from "../GameScene/GameBallCueModule/GameBallCueModule";
import { GameLuckChargeModule } from "./GameLuckCharge/GameLuckChargeModule";
import { GameLuckFreeModule } from "./GameLuckFree/GameLuckFreeModule";
import { GameLuckInfoModule } from "./GameLuckInfo/GameLuckInfoModule";
import { EventManager } from "../../Framework/Managers/EventManager";
import { GameLuckBallVO } from "../VO/GameLuckBallVO";
import { SimpleLuckTimesVO } from "../VO/SimpleLuckTimesVO";
import { GameLuckCollisionEdgeModule } from "./GameLuckCollisionEdge/GameLuckCollisionEdgeModule";
import { LobbyEvent } from "../Common/LobbyEvent";
import { GameSetModule } from "../GameScene/GameSetModule/GameSetModule";
// import { GameChatModule } from "../GameScene/GameChatModule/GameChatModule";
import { PayModeModule } from "../LobbyScene/PayModeModule/PayModeModule";
import { LobbyCueModule } from "../LobbyScene/LobbyCueModule/LobbyCueModule";
import { GameChatModule } from "../GameScene/GameChatModule/GameChatModule";
import { GameReviseModule } from "../GameScene/GameReviseModule/GameReviseModule";

export class GameLuckBallMediator extends FMediator {
    public static ClassName: string = "GameLuckBallMediator";
    protected player: PlayerVO = null;
    protected config: ConfigVO = null;
    protected room: RoomVO = null;
    protected table: TableVO = null;

    public initialize() {
        super.initialize();
        this.config = GameDataManager.GetDictData(GameDataKey.Config, ConfigVO);
        Physics3DUtility.InitPhysic();
    }
    public startMediator() {
        super.startMediator();
        // this.setLights();
        CanvasOffset.Init();
    }
    protected setLights() {
        if (!cc.sys.isNative) return;
        let n: cc.Node = Application.CurrentScene.getLayer(GameLayer.Root3D);
        let light = getNodeChildByName(n, "Lights/Directional Light", cc.Light);
        light.intensity = 2;
        light = getNodeChildByName(n, "Lights/Spot Light", cc.Light);
        light.intensity = 3;
    }
    public initModules(): void {
        super.initModules();
        this.room = GameDataManager.GetDictData(GameDataKey.Room, RoomVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
        this.table = GameDataManager.GetDictData(GameDataKey.Table, TableVO);

        this.addModule(ModuleNames.Game_Table, GameLuckBallTableModule, GameEvent.Player_Option, GameEvent.Player_ShotBall);
        this.addModule(ModuleNames.Game_BallCue, GameBallCueModule, GameEvent.Player_Option, GameEvent.Player_ShotBall);
        this.addModule(ModuleNames.Game_Option, GameOptionModule, GameEvent.Player_Option, GameEvent.Player_ShotBall);

        this.addModule(ModuleNames.GameSetModule, GameSetModule);
        this.addModule(ModuleNames.Game_LuckInfo, GameLuckInfoModule);

        this.addModule(ModuleNames.Game_LuckYourself, GameLuckChargeModule);
        this.addModule(ModuleNames.Game_LuckFreeChallenge, GameLuckFreeModule);

        this.addModule(ModuleNames.onProhibitCollision, GameLuckCollisionEdgeModule);

        this.addModule(ModuleNames.GameChatModule,GameChatModule);
        this.addModule(ModuleNames.Lobby_CueInfo,LobbyCueModule);

        this.addModule(ModuleNames.Pay_modeModule, PayModeModule);
        this.addModule(ModuleNames.Game_Revise, GameReviseModule,GameEvent.Player_ShotBall);
        
    }
    public showModules(): void {
        super.showModules();
        this.showModule(ModuleNames.Game_Table, GameLayer.Root3D);
        this.showModule(ModuleNames.GameSetModule, GameLayer.UI);

        this.showModule(ModuleNames.Game_Option, GameLayer.UI);

        this.showModule(ModuleNames.Game_BallCue, GameLayer.UI);
        this.showModule(ModuleNames.Game_LuckInfo, GameLayer.Content);
        this.showModule(ModuleNames.onProhibitCollision, GameLayer.Root3D);

        this.showModule(ModuleNames.GameChatModule, GameLayer.UI);
        this.showModule(ModuleNames.Game_Revise,GameLayer.UI);
    }



    protected addEvents() {
        super.addEvents();
        addEvent(this, GameEvent.On_ExitGame, this.exitGame);
        addEvent(this, GameEvent.Player_Option, this.onPlayerOption);
        addEvent(this, GameEvent.Player_ShotBall, this.onPlayerShotBall);
        addEvent(this, GameEvent.Table_Init_Complete, this.loadTableModuleComplete);
        
        addEvent(this,LobbyEvent.Open_LobbySet,this.onOpenLobbySet);
        addEvent(this, LobbyEvent.Open_PayModeLayer, this.onOpenPayModeLayer)

        addEvent(this,LobbyEvent.Open_CueInfo,this.onOpenCueInfo);
    }
    protected onOpenLobbySet() {
        this.showModule(ModuleNames.Lobby_Set,GameLayer.Popup);
    }
    /**
     * 加载桌子模块完成
     */
    protected loadTableModuleComplete() {
        // cc.log('加载完成')
        // this.excuteModuleEvent(GameEvent.Player_Option, "onPlayerOption", -1);
		// dispatchFEventWith(GameEvent.Player_Option, -1);

        let luckInfo: SimpleLuckTimesVO = GameDataManager.GetDictData(GameDataKey.GameLuckBall, GameLuckBallVO).gameLuckTimes;
        // cc.log(luckInfo);
        if (luckInfo) {
            let luckType = 0;// 1、免费，2、收费
            if (luckInfo.freeTimes > 0) { // 免费次数
                luckType = 1;
                this.showModule(ModuleNames.Game_LuckFreeChallenge, GameLayer.Popup);
            } else {
                luckType = 2;
                this.showModule(ModuleNames.Game_LuckYourself, GameLayer.Popup);
            }
        }

        dispatchFEventWith(GameEvent.onShowSetType, 'gameLuckBalls'); // 告知设置功能是否显示重新连接按钮
        this.room.optPlayer = this.player.id;
    }
    protected onPlayerOption(evt: FEvent) {
        let playerID = evt.data;
        this.excuteModuleEvent(GameEvent.Player_Option, "onPlayerOption", playerID);
    }
    protected onPlayerShotBall(evt: FEvent) {
        this.excuteModuleEvent(GameEvent.Player_ShotBall, "onPlayerShotBall", evt.data);
    }





    /**退出游戏 */
    protected exitGame() {
        C_Game_ExitGame.Send();
        GameDataManager.SetDictData(GameDataKey.Room, null);
        GameDataManager.SetDictData(GameDataKey.Table, null);
        let lobbyMediator: LobbyMediator = new LobbyMediator();
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE, ModuleNames.Preload, null, GameLayer.Popup);
        dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE, SceneNames.Lobby, lobbyMediator));
    }
    public dispose() {
        Physics3DUtility.Dispose();
        GameDataManager.SetDictData(GameDataKey.Room, null);
        GameDataManager.SetDictData(GameDataKey.Table, null);
        super.dispose(); 
    }

    private onOpenPayModeLayer() {
        this.showModule(ModuleNames.Pay_modeModule,GameLayer.Popup);
    }

    private onOpenCueInfo() {
        cc.log('123123')
        // dispatchFEventWith(GameEvent.onShowSetType,'gameInfo'); // 向table传输数据，然后修改球的位置

        this.showModule(ModuleNames.Lobby_CueInfo,GameLayer.UI);
    }

}