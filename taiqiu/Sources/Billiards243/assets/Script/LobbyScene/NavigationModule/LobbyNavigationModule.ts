import { FModule } from "../../../Framework/Core/FModule";
import { LobbyNavigationBinder } from "./LobbyNavigationBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { FEvent } from "../../../Framework/Events/FEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";


/**
*@description:大厅导航栏模块
**/
export class LobbyNavigationModule extends FModule 
{
	public static ClassName:string = "LobbyNavigationModule";
	public get assets():any[]{return ["LobbyScene/Navigation/LobbyNavigation","LobbyScene/Navigation/GoodsNode"]};
	
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
		addEvent(this,LobbyEvent.Server_AddRedPacket,this.updateMarqueeAni);
		this.node.zIndex = 1;
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new LobbyNavigationBinder();
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
	protected updateMarqueeAni(evt: FEvent):void
	{
		this.binder.update({type: evt.type, data: evt.data[0]});
	}
}