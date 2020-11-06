import { FModule } from "../../../Framework/Core/FModule";
import { GameCardTopInfoBinder } from "./GameCardTopInfoBinder";


/**
*@description:抽牌玩法顶部栏模块
**/
export class GameCardTopInfoModule extends FModule 
{
	public static ClassName:string = "GameTopInfoModule";
	public get assets():any[]{return ["GameCardScene/GameTopInfoModule","GameCardScene/InfoCardItem"]};
	
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
		this.binder = new GameCardTopInfoBinder();
	}
	public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as GameCardTopInfoBinder).updateCountDown();
	}
	public onSetPocketBall(playerID:number,balls:any)
	{
		if(this.binder==null)return;
		(this.binder as GameCardTopInfoBinder).updatePlayers();
	}
	public onPlayerShotBall(data:any)
	{
		if(this.binder==null)return;
		(this.binder as GameCardTopInfoBinder).updateCountDown(true);
	}
	public onPlayBallList(data:any)
	{
		if(this.binder==null)return;
		(this.binder as GameCardTopInfoBinder).updatePlayers();
	}
}