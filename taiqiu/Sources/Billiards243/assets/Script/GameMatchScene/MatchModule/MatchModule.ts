import { FModule } from "../../../Framework/Core/FModule";
import { MatchBinder } from "./MatchBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";


/**
*@description:游戏玩家匹配模块
**/
export class MatchModule extends FModule 
{
	public static ClassName:string = "MatchModule";
	public get assets():any[]{return ["GameMatchScene/GameMatchModule"]};
	
	public constructor()
	{
		super();
		this.isNeedPreload = true;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,GameEvent.MatchPlayer_Succ,this.updateMatchPlayer);
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new MatchBinder();
	}
	protected updateMatchPlayer(evt)
	{
		this.binder.update(null);
	}
	protected showViews():void
	{
		super.showViews();
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}