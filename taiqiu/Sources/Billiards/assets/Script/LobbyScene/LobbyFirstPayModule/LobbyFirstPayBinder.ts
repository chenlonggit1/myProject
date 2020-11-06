import { FBinder } from "../../../Framework/Core/FBinder";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { showPopup } from "../../Common/showPopup";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { ModuleNames } from "../../ModuleNames";
import { PayOrder } from "../../Pay/PayOrder";
import { PopupType } from "../../PopupType";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";
import { LobbyMouthVipBinder } from "../LobbyMouthVipModule/LobbyMouthVipBinder";
import { GoodsId } from "../PayModeModule/PayDefine";

/**
*@description:首冲功能
**/
export class LobbyFirstPayBinder extends LobbyMouthVipBinder 
{
	public static ClassName:string = "LobbyFirstPayBinder";
 
	// private btn_buy: cc.Button;
	// private awards: cc.Node[] = [];
	protected goodId: number = GoodsId.FirstPayGift_2;
	// protected initViews():void
	// {
	// 	super.initViews();

	// 	let closeBtn = getNodeChildByName(this.asset, "close")
	// 	this.btn_buy = getNodeChildByName(this.asset, "btnbg", cc.Button);

	// 	closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClose, this);

	// 	this.btn_buy.node.on(cc.Node.EventType.TOUCH_END, this.onclickBuy, this); // 
	// 	let awardLayer:cc.Node = getNodeChildByName(this.asset, "awardLayer");
	// 	this.awards = awardLayer.children;

	// 	this.updateView();
	// }

	// private onclickBuy () {
	// 	PayOrder(this.goodId);
	// 	this.onClose();
	// }

	protected onClose ()  {
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_FirstPay);
	}

	public updateView() {
		let shopData:ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
		let firstGIft:GoodsItemVO = shopData.getGoodsById(this.goodId);
		let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
		if(!firstGIft) {
			cc.error("没有商品数据");
			showPopup(PopupType.TOAST, {msg: "没有商品数据"});
			this.onClose();
			return ;
		}

		if(this.lbl_price && firstGIft) {
			this.lbl_price.string = "￥" + Math.floor(firstGIft.price / 100);
		}
		
		let id = firstGIft.itemId;
		let item = player.getItemInfo(id)
		let award1:cc.Node = this.awards[0];
		if(award1) {
			
			let sprite = award1.children[0].getComponent(cc.Sprite);
			let t_num = award1.children[1].getComponent(cc.Label);

			ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${id}`, sprite);
			t_num.string = firstGIft.count + "";
			if(firstGIft.count < 2) {
				t_num.node.active = false;
				sprite.node.y = 0;
			}

			// 球杆品质显示
			if(award1.children[2]) {
				let spr_flag = award1.children[2].getComponent(cc.Sprite);
				let allCue: PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue);
				console.log("=========== 球杆有数据 =", !!allCue);
				let cueID = String(id);
				cueID = cueID.substr(1);
				let cue = allCue.getCue(cueID);
				spr_flag.node.active = !!cue;
				if(cue) {
					ResourceManager.LoadSpriteFrame("Lobby/LobbyIcon/LobbyIcon?:" + cue.quality, spr_flag);
				}
			}
		}

		let award2:cc.Node = this.awards[1];
		award2.active = !!firstGIft.addCount;
		if(award2 && award2.active) {
			let sprite = award2.children[0].getComponent(cc.Sprite);
			let t_num = award2.children[1].getComponent(cc.Label);

			ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${id}`, sprite);
			t_num.string = firstGIft.addCount + "";
		}
		
	}
}

