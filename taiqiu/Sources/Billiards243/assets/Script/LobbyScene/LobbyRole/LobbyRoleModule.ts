import { FModule } from "../../../Framework/Core/FModule";
import { LobbyRoleBinder } from "./LobbyRoleBinder";


/**
*@description:大厅角色模块
**/
export class LobbyRoleModule extends FModule 
{
	public static ClassName:string = "LobbyRoleModule";
	public get assets():any[]{return ["LobbyScene/LobbyRole/LobbyRole"]};
	
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
		this.binder = new LobbyRoleBinder();
	}

	protected showViews():void
	{
		super.showViews();
		(this.binder as LobbyRoleBinder).setRole();
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}