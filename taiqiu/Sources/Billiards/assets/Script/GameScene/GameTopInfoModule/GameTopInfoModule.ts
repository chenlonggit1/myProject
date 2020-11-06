import { FModule } from "../../../Framework/Core/FModule";
import { GameTopInfoBinder } from "./GameTopInfoBinder";


/**
*@description:游戏顶部模块
**/
export class GameTopInfoModule extends FModule 
{
	public static ClassName:string = "GameTopInfoModule";
	public get assets():any[]{return ["GameScene/GameTopInfoModule/GameTopInfoModule"]};
	
	public constructor()
	{
		super();
		this.isNeedPreload = true;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new GameTopInfoBinder();
	}
	public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as GameTopInfoBinder).updateCountDown();
	}
	public onSetPocketBall(playerID:number,balls:any)
	{
		if(this.binder==null)return;
		(this.binder as GameTopInfoBinder).updatePlayers();
	}
	public onPlayerShotBall(data:any)
	{
		if(this.binder==null)return;
		(this.binder as GameTopInfoBinder).updateCountDown(true);
	}
	public onPlayBallList(data:any)
	{
		if(this.binder==null)return;
		(this.binder as GameTopInfoBinder).updatePlayers();
	}

	public onStartNewRound()
	{
		if(this.binder==null)return;
		(this.binder as GameTopInfoBinder).newRound();
	}
}