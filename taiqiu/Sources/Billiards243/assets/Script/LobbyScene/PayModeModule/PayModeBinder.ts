import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";

import { C_Pay_OrderItem } from "../../Networks/Clients/Pay/C_Pay_OrderItem";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { PayEvent } from "../../Common/PayEvent";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { S2C_PayInfo, C2S_BuyGoods } from "../../Networks/Protobuf/billiard_pb";
import { S_Pay_OrderItem } from "../../Networks/Servers/Pay/S_Pay_OrderItem";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { C_Pay_GetPayMode } from "../../Networks/Clients/Pay/C_Pay_GetPayMode";
import { PayType } from "./PayType";

let payTypeArr = [PayType.ZFB, PayType.WX, PayType.YL];

/**
*@description:支付选择
**/
export class PayModeBinder extends FBinder 
{
	public static ClassName:string = "PayModeBinder";
	private paymodes: cc.Node[];
	private recomandIcon: cc.Node;
	private isSelectPay = false; 
	
	protected initViews():void
	{
		super.initViews();

		this.paymodes = getNodeChildByName(this.asset, "modeLayer").children;
		this.recomandIcon = getNodeChildByName(this.asset, "recomand");
		this.hideAllPay();

		let closebtn = getNodeChildByName(this.asset, "btn_close");
		closebtn.on(cc.Node.EventType.TOUCH_END, ()=> {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Pay_modeModule);
		})


		for(let i in this.paymodes) {
			this.paymodes[i].on(cc.Node.EventType.TOUCH_END, this.onClickPay, this);
		}
		C_Pay_GetPayMode.Send();

	}

	protected addEvents():void {
		addEvent(this, PayEvent.Pay_GetPayModes, this.onUpdatePayModes);
	}

	onClickPay(event: cc.Event.EventTouch) {
		if(this.isSelectPay) {
			return;
		}
		setTimeout(() => {
			this.isSelectPay = false;
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Preload);
		}, 1000);

		this.isSelectPay = true;
		let index = this.paymodes.indexOf(event.target);
		let pay_type = payTypeArr[index]
		let item: GoodsItemVO = GameDataManager.GetDictData(GameDataKey.CurSelectItem, GoodsItemVO);
		this.order(item.goodsId, pay_type);
		
		dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup,{isShowMask:false});
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Pay_modeModule);

	}

	hideAllPay() {
		this.paymodes.forEach(node=> {
			node.active = false;
		})
	}


	  /** 支付宝(1)或银联(3)用新接口下单 */
	order(goodsId: number, payType: number) {
		// const c_buyOrder = pb_hall.C_BuyOrder.create({ id: goods_data.goodsId, payType: pay_type })
		C_Pay_OrderItem.Send(goodsId, payType);
       
	}

	static payMode2ViewIdx = []
	private onUpdatePayModes() {
		let paymode: S2C_PayInfo = GameDataManager.GetDictData(GameDataKey.PayModes);
		if(!paymode) {
			return;
		}
		for(let i = 0; i < paymode.payInfo.length; i++) {
			let pay = paymode.payInfo[i];
			let node = this.paymodes[pay.payType - 1];
			if(node) {
				node.active = !!pay;
				pay && (node.children[0].active = pay.preferred);
			}
		}

	}

}