import { FModule } from "../../../Framework/Core/FModule";
import { Pay_RedPackageZFBBinder } from "./Pay_RedPackageZFBBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { C_Pay_GetZFBInfo } from "../../Networks/Clients/Pay/C_Pay_GetZFBInfo";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { PayEvent } from "../../Common/PayEvent";
import { FEvent } from "../../../Framework/Events/FEvent";


/**
*@description:支付宝红包兑换界面
**/
export class Pay_RedPackageZFBModule extends ModuleBasePopup 
{
	public static ClassName:string = "Pay_RedPackageZFBModule";
	public get assets():any[]{return ["Pay/PayRedPackageNew"]};
	protected binder: Pay_RedPackageZFBBinder;
	
	
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
		this.binder = new Pay_RedPackageZFBBinder();
	}

	

	protected showViews():void
	{
		C_Pay_GetZFBInfo.Send();
		super.showViews();
		this.popup(this.node, ()=> {

		})
	}
	protected hideViews():void
	{
		this.binder.xiaLaLayer.active = false;
		this.popdown(this.node, ()=> {
			super.hideViews();
		})
	}
}