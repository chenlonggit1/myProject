import { FModule } from "../../Framework/Core/FModule";
import { PreloadBinder } from "./PreloadBinder";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../ModuleNames";
import { GameLayer } from "../../Framework/Enums/GameLayer";


/**
*@description:预加载转圈圈模块
**/
export class PreloadModule extends FModule 
{
	public static ClassName:string = "PreloadModule";
	public get assets():any[]{return ["PreloadModule/PreloadModule"]};
	
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
		this.binder = new PreloadBinder();
	}
	protected showViews():void
	{
		super.showViews();
		if(this.moduleData)
		{
			(this.binder as PreloadBinder).setProgress(this.moduleData["progress"]);
			(this.binder as PreloadBinder).setMsg(this.moduleData["msg"]);
			if(this.moduleData["isShowMask"])
				dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Mask,null,GameLayer.PopupMask);
		}else 
		{
			(this.binder as PreloadBinder).setProgress(null);
			(this.binder as PreloadBinder).setMsg(null);
		}
	}
	protected hideViews():void
	{
		if(this.moduleData&&this.moduleData["isShowMask"])
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Mask);
		super.hideViews();
	}
}