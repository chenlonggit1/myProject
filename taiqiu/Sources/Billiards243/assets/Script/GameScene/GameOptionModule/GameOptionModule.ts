import { FModule } from "../../../Framework/Core/FModule";
import { GameOptionBinder } from "./GameOptionBinder";


/**
*@description:游戏操作模块
**/
export class GameOptionModule extends FModule 
{
	public static ClassName:string = "GameOptionModule";
	public get assets():any[]{return ["GameScene/GameOptionModule"]};
	
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
		this.binder = new GameOptionBinder();
	}
	public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as GameOptionBinder).setOptionPlayer(playerID);
	}
	public onPlayerShotBall(data:any)
	{
		if(this.binder==null)return;
		(this.binder as GameOptionBinder).shoot(data.playerID,data.powerScale);
	}
}