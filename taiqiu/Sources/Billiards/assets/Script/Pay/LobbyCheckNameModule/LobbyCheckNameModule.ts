import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { LobbyCheckNameBinder } from "./LobbyCheckNameBinder";


/**
*@description:实名认证
**/
export class LobbyCheckNameModule extends ModuleBasePopup 
{
	public static ClassName:string = "LobbyCheckNameModule";
	public get assets():any[]{return ["LobbyScene/LobbyOtherActivityLayer/LobbyCheckName"]};
	protected binder: LobbyCheckNameBinder;;
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = true;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new LobbyCheckNameBinder();
	}
	
	protected showViews():void
	{
		super.showViews();
		this.popup(this.node, null);
		this.binder.updateView();
	}
	protected hideViews():void
	{
		this.popdown(this.node, ()=> {
			super.hideViews();

		})
	}
}