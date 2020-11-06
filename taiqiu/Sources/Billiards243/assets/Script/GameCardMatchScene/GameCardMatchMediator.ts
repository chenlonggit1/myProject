import { SceneEvent } from "../../Framework/Events/SceneEvent";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { GameCardMediator } from "../GameCardScene/GameCardMediator";
import { GameMatchMediator } from "../GameMatchScene/GameMatchMediator";
import { ModuleNames } from "../ModuleNames";
import { SceneNames } from "../SceneNames";
import { GameCardMatchModule } from "./MatchModule/GameCardMatchModule";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../GameEvent";

/**
*@description:抽牌游戏匹配界面
**/
export class GameCardMatchMediator extends GameMatchMediator 
{
    public static ClassName: string = "GameCardMatchSceneMediator";
	
	/**初始化模块 */
	protected initModules()
    {
        this.addModule(ModuleNames.Game_Match,GameCardMatchModule);
        addEvent(this,GameEvent.MatchPlayer_Succ,this.onMatchPlayer);
    }
	protected initDatas()
    {
        if(this.gameMediator==null)
        {
            this.gameMediator = new GameCardMediator();
            this.gameMediator.initialize();
        }
        this.gameMediator.preloadAssets().addCallback(this,this.onLoadCompleted);
    }
	protected onStartGame()
    {
        // console.log("切换到游戏场景");
        dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Game_Card,this.gameMediator));
    }
}
