import { FModule } from "../../../Framework/Core/FModule";
import { GameCardSettleBinder } from "./GameCardSettleBinder";


/**
*@description:抽牌玩法结算模块
**/
export class GameCardSettleModule extends FModule 
{
	public static ClassName:string = "GameCardSettleModule";
	public get assets():any[]{return ["GameCardScene/GameCardSettleModule"]};
	
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
		this.binder = new GameCardSettleBinder();
	}

	public onGameSettle(settleInfo:any)
	{
		if(!this.binder)return;
		this.binder.update(settleInfo);
	}
}