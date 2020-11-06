import { FModule } from "../../../Framework/Core/FModule";
import { LobbyMouthVipBinder } from "./LobbyMouthVipBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";


/**
*@description:月卡功能
**/
export class LobbyMouthVipModule extends ModuleBasePopup 
{
	public static ClassName:string = "LobbyMouthVipModule";
	public get assets():any[]{return ["LobbyScene/LobbyOtherActivityLayer/LobbyMouthVip"]};
	protected binder: LobbyMouthVipBinder;
	
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
		this.binder = new LobbyMouthVipBinder();
	}
	

	protected showViews():void
	{
		super.showViews();
		this.popup(this.node, ()=>{

		} )
		this.binder.updateView();

	}
	protected hideViews():void
	{
		this.popdown(this.node, ()=> {
			super.hideViews();
		})
	}
}