import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { PayOrder } from "../../Pay/PayOrder";
import { GoodsId } from "../PayModeModule/PayDefine";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { RelifVO } from "../../VO/RelifVO";
import { C_Lobby_relifeNum } from "../../Networks/Clients/C_Lobby_relifeNum";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { C_Lobby_relife } from "../../Networks/Clients/C_Lobby_relife";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { LanguageManager } from "../../../Framework/Managers/LanguageManager";
import { LanguageType } from "../../../Framework/Enums/LanguageType";

/**
*@description:每日复活
**/
export class LobbyRelifeBinder extends FBinder 
{
	public static ClassName:string = "LobbyRelifeBinder";
	private t_relifeNum: cc.Label;
	private btn_reLife: cc.Button;
	private btn_buy: cc.Button;
	private buyItem: cc.Node;
	private t_buyDesc: cc.Label;
	private t_effectTip: cc.Label;
	private t_buyPrice: cc.Label;
	private t_effectTip_other: cc.Label;
	private t_buyPrice_other: cc.Label;

	
	protected initViews():void
	{
		super.initViews();
		this.t_relifeNum = getNodeChildByName(this.asset, "itemLayer/item1/t_relifeNum", cc.Label);
		this.btn_reLife = getNodeChildByName(this.asset, "itemLayer/item1/sure", cc.Button);
		this.btn_buy = getNodeChildByName(this.asset, "itemLayer/item2/sure", cc.Button);
		this.buyItem = getNodeChildByName(this.asset, "itemLayer/item2");
		let close = getNodeChildByName(this.asset, "close", cc.Button);
		this.t_buyDesc = getNodeChildByName(this.asset, "itemLayer/item1/t_tip", cc.Label);
		this.t_buyPrice = getNodeChildByName(this.asset, "itemLayer/item2/tip/tip", cc.Label);
		this.t_effectTip = getNodeChildByName(this.asset, "itemLayer/item2/t_tip/t_tip", cc.Label);

		this.t_buyPrice_other = getNodeChildByName(this.asset, "itemLayer/item2/tip/other", cc.Label);
		this.t_effectTip_other = getNodeChildByName(this.asset, "itemLayer/item2/t_tip/other", cc.Label);

		close.node.on("click", this.onClose, this);
		this.btn_reLife.node.on("click", this.onRelife, this);
		this.btn_buy.node.on("click", this.onBuy, this);

		this.updateView();

	}

	public updateView() {
		let relife: RelifVO = GameDataManager.GetDictData(GameDataKey.RelifeGift, RelifVO);
		let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
		let room: RoomVO
		this.t_relifeNum.string =  relife.count + "";
		this.btn_reLife.interactable = relife.isActive && relife.count>0;
		this.buyItem.active = !relife.isActive;
		let day = 30;
		if(relife.isActive) {
			 day = Math.ceil(relife.liveTime / 86400);	
		} 
		// 设置复活天数显示
		let txt = getLang("txt_relife_effictTip");
		// txt = txt.replace("{0}", day+"");
		// this.t_effectTip.string = txt;
		this.setLuange(this.t_effectTip, this.t_effectTip_other, txt, day+"");
		// 设置价格
		let buyTxt = getLang("txt_relife_buyTip");

		// buyTxt = buyTxt.replace("{0}", relife.price+"");
		// this.t_buyPrice.string = buyTxt;
		this.setLuange(this.t_buyPrice, this.t_buyPrice_other, buyTxt, relife.price+"");
		
		// let unit = relife.moneyType == 1 ? "金币" : "钻石";

			// 补充钻石设置
		let charge = Math.abs(player.diamond - relife.chargeNumber);
		let dim = getLang("txt_relife_isLife");
		dim = dim.replace("*", "");
		this.t_buyDesc.string = dim;
	}

	protected addEvents () {
		addEvent(this, LobbyEvent.ActivityUpdate, this.onActivityUpdate)
	}

	private onClose() {
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_ReLife);
	}

	private onRelife () {
		C_Lobby_relife.Send();
		this.onClose();
	}
	private onBuy () {
		PayOrder(GoodsId.reLifeMouthVip);

		/* 测试 */
		// let relife: RelifVO = GameDataManager.GetDictData(GameDataKey.RelifeGift, RelifVO);
		// relife.isActive = true;
		// relife.count = 1;
		// relife.liveTime = 10000;
		this.onClose();
	}

	private onActivityUpdate() {
		this.updateView();
	}

	private setLuange(lbl1: cc.Label, otherLbl: cc.Label, content:string, replaStr:string) {
		if(LanguageManager.CurrentIndex == 0) {
			lbl1.string = content.replace("*", replaStr);
			otherLbl.node.active = false;
		} else {
			content = content.replace("*", ""); 
			lbl1.string = content;
			otherLbl.string = replaStr;
			otherLbl.node.active = true;
		}
	}


} 