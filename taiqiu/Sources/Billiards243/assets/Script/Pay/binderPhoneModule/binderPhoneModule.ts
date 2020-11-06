import { FModule } from "../../../Framework/Core/FModule";
import { binderPhoneBinder } from "./binderPhoneBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";


/**
*@description:手机绑定
**/
export class binderPhoneModule extends ModuleBasePopup 
{
	public static ClassName:string = "binderPhoneModule";
	public get assets():any[]{return ["Pay/binderPhone/binderPhone"]};
	protected binder: binderPhoneBinder;
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
		this.binder = new binderPhoneBinder();
	}
	
	protected showViews():void
	{
		this.popup(this.node, ()=> {

		});
		super.showViews();
		this.binder.updateView();
	}
	protected hideViews():void
	{
		this.popdown(this.node, ()=> {
			super.hideViews();
		});
	}
}