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
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { PlayerCueVO } from "../../VO/PlayerCueVO";

/**
*@description:月卡功能
**/
export class LobbyMouthVipBinder extends FBinder 
{
	public static ClassName:string = "LobbyMouthVipBinder";
	protected btn_buy: cc.Button;
	protected goodId: number = GoodsId.MouthVip;
	protected awards: cc.Node[] = [];
	public lbl_price: cc.Label = null;
	protected day: number = 30;
	protected initViews():void
	{
		super.initViews();

		let closeBtn = getNodeChildByName(this.asset, "close")
		this.btn_buy = getNodeChildByName(this.asset, "btnbg", cc.Button);
		this.lbl_price = getNodeChildByName(this.btn_buy.node, "t_num", cc.Label);

		closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClose, this);

		this.btn_buy.node.on(cc.Node.EventType.TOUCH_END, this.onclickBuy, this);
		let awardLayer:cc.Node = getNodeChildByName(this.asset, "awardLayer");
		this.awards = awardLayer.children;
		this.updateView();
	}

	protected addEvents () {
	}

	protected onclickBuy () {
		let shop: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods, ShopGoodsVo);
		let item = shop.getGoodsById(this.goodId);
		if(!item) {
			cc.error("=====没有商品数据====");
			return;
		}
		this.btn_buy.enabled = false;
		PayOrder(item.goodsId);
		this.onClose();
	}

	protected onClose ()  {
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_MouthVip);
	}

	public updateView() {
		let shopData:ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
		let gift:GoodsItemVO = shopData.getGoodsById(this.goodId);
		if(this.lbl_price && gift) {
			this.lbl_price.string = "￥" + Math.floor(gift.price / 100);
		}
		if(!gift){
			cc.error("没有商品数据");
			showPopup(PopupType.TOAST, {msg: "没有商品数据"});
			this.onClose();
			return ;
		}
		
		let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
		
		let id = gift.itemId;
		let item = player.getItemInfo(id);
		let award1:cc.Node = this.awards[0];
		if(award1 && gift) {
			let sprite = award1.children[0].getComponent(cc.Sprite);
			let t_num = award1.children[1].getComponent(cc.Label);
			
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${id}`, sprite);
			t_num.string = gift.count + "";

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
		award2.active = !!gift.addCount;
		if(award2) {
			let sprite = award2.children[0].getComponent(cc.Sprite);
			let t_num = award2.children[1].getComponent(cc.Label);
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${id}`, sprite);
			t_num.string = Math.ceil(gift.addCount / this.day) + "";
		}
		
		
	}

	 
}