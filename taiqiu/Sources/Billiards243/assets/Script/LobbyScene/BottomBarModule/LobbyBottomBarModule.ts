import { FModule } from "../../../Framework/Core/FModule";
import { LobbyBottomBarBinder } from "./LobbyBottomBarBinder";


/**
*@description:大厅底部栏模块
**/
export class LobbyBottomBarModule extends FModule 
{
	public static ClassName:string = "LobbyBottomBarModule";
	public get assets():any[]{return ["LobbyScene/BottomBar/LobbyBottomBar"]};
	protected binder: LobbyBottomBarBinder;
	
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
		this.binder = new LobbyBottomBarBinder();
		this.node.zIndex = 2;
	}
	
	// protected bindViews():void
	// {
	// 	let view = getNodeChildByName(this.node,{BindNode});
	// 	if(this.binder&&view)
    //         this.binder.bindView(view);
	// }

	protected showViews():void
	{
		super.showViews();
		this.binder.updateView();
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}