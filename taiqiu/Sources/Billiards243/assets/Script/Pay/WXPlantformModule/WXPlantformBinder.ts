import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { Native } from "../../Common/Native";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { PopupType } from "../../PopupType";
import { showPopup } from "../../Common/showPopup";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { ConfigVO } from "../../VO/ConfigVO";

/**
*@description:微信公众关注引导
**/
export class WXPlantformBinder extends FBinder 
{
	public static ClassName:string = "WXPlantformBinder";
	
	protected initViews():void
	{
		super.initViews();
		let close:cc.Node = getNodeChildByName(this.asset, "btn_ok");
		close.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
	}

	onClose() {
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
		let config:ConfigVO = GameDataManager.GetDictData(GameDataKey.Config);
		Native.copyToClipboard(config.wechatGZH);
		showPopup(PopupType.TOAST, {msg:getLang("Text_kfxx2")});
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Pay_WXYindao);
	}
}