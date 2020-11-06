import { FModule } from "../../../Framework/Core/FModule";
import { LobbyActivityBinder } from "./LobbyActivityBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";


/**
*@description:大厅活动模块
**/
export class LobbyActivityModule extends ModuleBasePopup 
{
	public static ClassName:string = "LobbyActivityModule";
	public get assets():any[]{return ["LobbyScene/LobbyActivity/LobbyActivity"]};
	protected binder: LobbyActivityBinder;
	
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
		this.binder = new LobbyActivityBinder();

	}

	
	public showViews():void
	{
		super.showViews();
        // 弹出动画
		this.popup(this.node, () => {});
		this.binder.setSystemNotice(null);
	}
	protected hideViews():void
	{
        // 弹下动画
        this.popdown(this.node, () => {
			super.hideViews();
        });
	}
}