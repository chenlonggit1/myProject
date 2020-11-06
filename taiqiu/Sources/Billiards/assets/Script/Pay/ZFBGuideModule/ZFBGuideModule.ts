import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { ZFBGuideBinder } from "./ZFBGuideBinder";


/**
*@description:微信公众关注引导
**/
export class ZFBGuideModule extends ModuleBasePopup 
{
	public static ClassName:string = "WXPlantformModule";
	public get assets():any[]{return ["Pay/ZFBGuideModule"]};
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
		this.binder = new ZFBGuideBinder();
	}
	
	protected showViews():void
	{
		super.showViews();
		this.popup(this.node, null);
	}
	protected hideViews():void
	{
		this.popdown(this.node, ()=> {
			super.hideViews();
		})
	}
}