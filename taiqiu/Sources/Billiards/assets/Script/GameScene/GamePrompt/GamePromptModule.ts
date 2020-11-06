import { FModule } from "../../../Framework/Core/FModule";
import { GamePromptBinder } from "./GamePromptBinder";


/**
*@description: 游戏提示模块
**/
export class GamePromptModule extends FModule 
{
	public static ClassName:string = "GamePromptModule";
	public get assets():any[]{return ["GameScene/GamePromptModule/GamePrompt", "LobbyScene/LobbyCue/LobbyCueMaintain"]};
	
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected createViews():void
	{
		super.createViews();
		this.binder = new GamePromptBinder();
	}
	public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as GamePromptBinder).setOptionTip(playerID);
	}

	public onPlayBallList(type:number)
	{
		if(this.binder==null)return;
		(this.binder as GamePromptBinder).onPlayBallTip(type);
	}

	public onPlayerIllegality(playerID:number,type:number)
	{
		if(this.binder==null)return;
		(this.binder as GamePromptBinder).setIllegalityTip();
	}
}