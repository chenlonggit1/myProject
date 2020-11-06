import { FModule } from "../../../Framework/Core/FModule";
import { GameShowResultBinder } from "./GameShowResultBinder";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { Assets } from "../../../Framework/Core/Assets";


/**
*@description:抽牌玩法结算结果显示模块
**/
export class GameShowResultModule extends FModule 
{
	public static ClassName:string = "GameShowResultModule";
	public get assets():any[]{return ["GameCardScene/GameShowResultModule"]};
	
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
		this.binder = new GameShowResultBinder();
		// 用来提前预加载结算模块的资源
		ResourceManager.LoadPrefab(Assets.GetPrefab("GameCardScene/GameCardSettleModule"));
	}

	public onGameSettle(settleInfo:any)
	{
		if(!this.binder)return;
		this.binder.update(settleInfo);
	}
}