import { FModule } from "../../../Framework/Core/FModule";
import { LobbyCueBinder } from "./LobbyCueBinder";


/**
*@description:大厅个人信息模块
**/
export class LobbyCueModule extends FModule 
{
	public static ClassName:string = "LobbyCueModule";
	public get assets():any[]{return ["LobbyScene/LobbyCue/LobbyCue","LobbyScene/LobbyCue/LobbyCueItem"
		,"LobbyScene/LobbyCue/LobbyCueInfo","LobbyScene/LobbyCue/LobbyCueMaintain","LobbyScene/Navigation/GoodsNode"]};
	
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
		this.binder = new LobbyCueBinder();
	}

	protected showViews():void
	{
		super.showViews();
		(this.binder as LobbyCueBinder).sendMyCue();
		(this.binder as LobbyCueBinder).setGameCue(0);
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}