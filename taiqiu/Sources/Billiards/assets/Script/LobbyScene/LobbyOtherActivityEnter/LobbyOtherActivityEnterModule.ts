import { FModule } from "../../../Framework/Core/FModule";
import { LobbyOtherActivityEnterBinder } from "./LobbyOtherActivityEnterBinder";


/**
*@description:签到、充值、等活动入口图标
**/
export class LobbyOtherActivityEnterModule extends FModule 
{
	public static ClassName:string = "LobbyOtherActivityEnter";
	public get assets():any[]{return ["LobbyScene/LobbyOtherActiveEnter/LobbyOtherActivityEnter"]};
	
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
		this.binder = new LobbyOtherActivityEnterBinder();
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