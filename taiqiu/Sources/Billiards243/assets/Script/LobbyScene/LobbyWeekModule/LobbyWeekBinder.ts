import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { GoodsId } from "../PayModeModule/PayDefine";
import { PayOrder } from "../../Pay/PayOrder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { PayEvent } from "../../Common/PayEvent";
import { LobbyMouthVipBinder } from "../LobbyMouthVipModule/LobbyMouthVipBinder";

/**
*@description:周卡功能
**/
export class LobbyWeekBinder extends LobbyMouthVipBinder 
{
	public static ClassName:string = "LobbyWeekBinder";
	protected goodId: number = GoodsId.WeekVip;
	protected day: number = 7;
	// private btn_buy: cc.Button;
	

	protected onClose ()  {
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.weekVipModule);
	}

	// public updateView() {
		
		
	// }

	 
}