import { LobbyMailBinder } from "./LobbyMailBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { FEvent } from "../../../Framework/Events/FEvent";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C_Lobby_GetMail } from "../../Networks/Clients/Mail/C_Lobby_GetMail";


/**
*@description:邮件
**/
export class LobbyMailModule extends ModuleBasePopup 
{
	public static ClassName:string = "LobbyMailModule";
	public get assets():any[]{return ["LobbyScene/LobbyMail/LobbyMail"]};
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected addEvents()
	{
		super.addEvents();
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new LobbyMailBinder();
	}
	
	public showViews():void
	{
		super.showViews();
        // 弹出动画
        this.popup(this.node, () => {
			C_Lobby_GetMail.Send();
        });
	}
	protected hideViews():void
	{
        // 弹下动画
        this.popdown(this.node, () => {
			super.hideViews();
        });
	}
}