import { CLanguage } from "../../../Framework/Components/CLanguage";
import { FBinder } from "../../../Framework/Core/FBinder";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { ModuleNames } from "../../ModuleNames";
import { C_Lobby_getDayMouthGIft } from "../../Networks/Clients/C_Lobby_getDayMouthGIft";
import { S2C_PushAward } from "../../Networks/Protobuf/billiard_pb";
import { GoodsId } from "../PayModeModule/PayDefine";

/**
*@description:每日月卡礼包
**/
export class LobbyDayNouthGiftBinder extends FBinder 
{
	public static ClassName:string = "LobbyDayNouthGiftBinder";
	private giftItem: cc.Node;
	private title: cc.Node;
	
	protected initViews():void
	{
		super.initViews();
		let close:cc.Node = getNodeChildByName(this.asset, "close");
		let btn_get:cc.Node = getNodeChildByName(this.asset, "btnbg");
		this.giftItem = getNodeChildByName(this.asset, "awardLayer/awardItem");
		this.title = getNodeChildByName(this.asset, "title");

		close.on("click", this.onClose, this);
		btn_get.on("click", this.onGetGift, this);
		this.updateView();
	}

	private onClose() {
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.DayMouthGift);
	}

	private onGetGift() {
		// TODO 领取奖励
		C_Lobby_getDayMouthGIft.Send();
		GameDataManager.SetDictData(GameDataKey.DayMouthGift, null);
		this.onClose();
	}

	private updateView() {
		let data:S2C_PushAward =  GameDataManager.GetDictData(GameDataKey.DayMouthGift);
		// let laung = this.title.getComponent(CLanguage);
		// if(data.goodsId == GoodsId.WeekVip) { // 周卡
		// 	laung && (laung.key = "img_mouthTitle");
		// } else {

		// }

		if(data && data.awards.length > 0) {
			// this.
			let sprite = this.giftItem.children[0].getComponent(cc.Sprite);
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${data.awards[0].id}`, sprite);
			this.giftItem.children[1].getComponent(cc.Label).string = data.awards[0].num + "";
		}
		
	}

}