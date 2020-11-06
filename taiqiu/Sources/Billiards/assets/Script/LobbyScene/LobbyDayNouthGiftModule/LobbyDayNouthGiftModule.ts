import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { LobbyDayNouthGiftBinder } from "./LobbyDayNouthGiftBinder";


/**
*@description:每日月卡礼包
**/
export class LobbyDayNouthGiftModule extends ModuleBasePopup 
{
	public static ClassName:string = "LobbyDayNouthGiftModule";
	public get assets():any[]{return ["LobbyScene/LobbyOtherActivityLayer/LobbyDayMouthGift"]};
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
		this.binder = new LobbyDayNouthGiftBinder();
	}
	
	protected showViews():void
	{
		super.showViews();
		this.popup(this.node, ()=> {
		})
	}
	protected hideViews():void
	{
		this.popdown(this.node, ()=> {
			super.hideViews();
		})
	}
}