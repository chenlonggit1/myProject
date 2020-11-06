import { FModule } from "../../../Framework/Core/FModule";
import { LobbyRoomBinder } from "./LobbyRoomBinder";


/**
*@description:大厅房间模块
**/
export class LobbyRoomModule extends FModule 
{
	public static ClassName:string = "LobbyRoomModule";
	public get assets():any[]{return ["LobbyScene/Room/LobbyRoom"]};
	
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
		this.binder = new LobbyRoomBinder();
		this.node.zIndex = 0;
	}
	protected showViews():void
	{
		super.showViews();
		(this.binder as LobbyRoomBinder).getGameType();
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}