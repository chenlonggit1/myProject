import { FModule } from "../../Framework/Core/FModule";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { addEvent } from "../../Framework/Utility/dx/addEvent";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleNames } from "../ModuleNames";
import { HotUpdateBinder } from "./HotUpdateBinder";
/**
*@description: 热更新模块
**/
export class HotUpdateModule extends FModule
{
	public static ClassName:string = "HotUpdateModule";
	public get assets():any[]{return ["HotUpdateModule/HotUpdateModule"]};
    protected createViews():void
	{
		super.createViews();
		this.binder = new HotUpdateBinder();
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,"closeUpdate",this.onCloseHotUpdate);
	}

	protected onCloseHotUpdate()
	{
		console.log("关闭热更新面板！！！");
		dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE,ModuleNames.HotUpdate);
		
	}

	protected showViews()
	{
		super.showViews();
		// dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Mask,null,GameLayer.WindowMask);
	}

	protected hideViews()
	{
		super.hideViews();
		// dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Mask);
	}
}
