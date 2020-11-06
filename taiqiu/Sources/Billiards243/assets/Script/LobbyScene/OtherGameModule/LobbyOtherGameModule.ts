import { FModule } from "../../../Framework/Core/FModule";
import { LobbyOtherGameBinder } from "./LobbyOtherGameBinder";


/**
*@description:大厅必玩游戏模块
**/
export class LobbyOtherGameModule extends FModule 
{
	public static ClassName:string = "LobbyOtherGameModule";
	public get assets():any[]{return []};
	
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
		this.binder = new LobbyOtherGameBinder();
		this.node.zIndex = 4;
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
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}