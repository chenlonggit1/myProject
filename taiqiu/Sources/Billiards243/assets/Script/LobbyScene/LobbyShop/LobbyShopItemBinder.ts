import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { C_Lobby_UseRole } from "../../Networks/Clients/Role/C_Lobby_UseRole";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { C_Pay_GetPayMode } from "../../Networks/Clients/Pay/C_Pay_GetPayMode";
import { PayEvent } from "../../Common/PayEvent";
import { GoodsType, PayType, PayKinds } from "../PayModeModule/PayDefine";
import { Item } from "../../Networks/Protobuf/billiard_pb";
import { C_Pay_GetWXInfo } from "../../Networks/Clients/Pay/C_Pay_GetWXInfo";
import { LanguageManager } from "../../../Framework/Managers/LanguageManager";
import { C_Pay_OrderItem } from "../../Networks/Clients/Pay/C_Pay_OrderItem";
import { C_Pay_TurnRedPack } from "../../Networks/Clients/Pay/C_Pay_TurnRedPack";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";
import { PlayerVO } from "../../VO/PlayerVO";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { GetErrInfo } from "../../Pay/GetErrInfo";

/**
*@description:大厅商城模块
**/
export class LobbyShopItemBinder extends FBinder 
{
	public static ClassName:string = "LobbyShopItemBinder";
	private icon: cc.Sprite;
	private TipNode: cc.Node;
	private t_tip: cc.Label;
	private t_num: cc.Label;
	private t_Price: cc.Label;
	private data: GoodsItemVO;
	private packIcon: cc.Sprite; // 红包种类icon
	private btn_buy: cc.Button;
	static iconNames: string[] = ["", "img_JinBi0", "img_BaoShi0", "img_HongBaoQuan0", "", "", "", "", "", "", "", "img_HongBaoQuan0"];
	static raceIcon: string[] = ["img_HongBaoQuan", "", "img_HongBaoQuan", "img_BaoShiDe", "img_JinBiDe"];
	// static redPackIcon:
	private moneyRaces: cc.Node[]
	private JIaZi: cc.Node;
	private spr_moneyRace: cc.Sprite;
	protected initViews():void
	{
		super.initViews();
		this.icon = getNodeChildByName(this.asset, "img_icon", cc.Sprite);
		this.TipNode = getNodeChildByName(this.asset, "img_BiaoQian");
		this.t_tip = getNodeChildByName(this.asset, "lbTitle", cc.Label);
		this.t_num = getNodeChildByName(this.asset, "lbText", cc.Label);
		this.t_Price = getNodeChildByName(this.asset, "lbPrice", cc.Label);
		this.packIcon = getNodeChildByName(this.asset, "packIcon", cc.Sprite);
		let moneyRace: cc.Node = getNodeChildByName(this.asset, "moneyRace");
		this.btn_buy = getNodeChildByName(this.asset, "btn_buy", cc.Button);
		this.JIaZi = getNodeChildByName(this.asset, "img_Ban");
		this.moneyRaces = moneyRace.children;
		this.spr_moneyRace = this.moneyRaces[1].getComponent(cc.Sprite);
		
	}

	protected addEvents()
	{
		super.addEvents();
		this.asset.on(cc.Node.EventType.TOUCH_END, this.onClickBuy, this);
		this.btn_buy.node.on("click", this.onClickBuy, this);
	}


	protected removeEvents () {
		super.removeEvents();
		if(!this.asset || !this.asset.isValid) {
			cc.log(" === 资源已经释放====");
			return;
		}
		this.asset.off(cc.Node.EventType.TOUCH_END);
		this.btn_buy.node.off("click");
	}

	public setShopItem(data: GoodsItemVO, index:number)
	{
		let shopVo: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
		this.t_num.string = data.count + "";
		if(data.payType == PayKinds.RMB) {
			this.t_Price.string = data.price / 100 + "";
		} else {
			this.t_Price.string = data.price + "";
		}
		this.data = data;
		let imgIdx = shopVo.countTransIndex(data.goodsType, data.count) + 1;
		let iconUrl =  ""
		if(LobbyShopItemBinder.iconNames[data.goodsType]) {
			iconUrl = `Lobby/LobbyShop/LobbyShop?:${LobbyShopItemBinder.iconNames[data.goodsType] + imgIdx}`
		}
		if(data.goodsType == GoodsType.WXPack || data.goodsType == GoodsType.ALIPack) {
			iconUrl= LanguageManager.CurrentIndex == 0 ? "Lobby/LobbyShop/LobbyShop?:iconRed" : "Lobby/LobbyShop/LobbyShop?:iconRed";
			this.t_num.string =  "¥ " + this.t_num.string;
		} else if(data.goodsType == GoodsType.ADV_Card) {
			iconUrl = `Lobby/LobbyShop/LobbyShop?:adv`;   
		}

	

		// 设置icon图标
		ResourceManager.LoadSpriteFrame(iconUrl, this.icon);
		let packUrl = this.getPackIconUrl(data.goodsType);
		
		if(packUrl) {
			ResourceManager.LoadSpriteFrame(packUrl, this.packIcon);
			this.packIcon.node.active = true;
		} else {
			this.packIcon.node.active = false;
		}
		for(let i in this.moneyRaces) {
			this.moneyRaces[i].active = false;
		}

		let hasAddOther = data.addCount > 0;
		this.t_tip.node.active = hasAddOther;
		this.TipNode.active = hasAddOther;
		// 设置附加内容
		hasAddOther && (this.t_tip.string = `+${data.addCount}`);

		// 置灰未选中按钮
		this.moneyRaces[data.payType - 1] && (this.moneyRaces[data.payType - 1].active = true);
		data.payType > 1 ? this.moneyRaces[1].active = true : this.moneyRaces[0].active = true

		// 设置消费币种icon
		let name = LobbyShopItemBinder.raceIcon[data.payType];
		if(name) {
			ResourceManager.LoadSpriteFrame( `Lobby/LobbyShop/LobbyShop?:${name}`, this.spr_moneyRace);
		}

		// 设置显示 货品栏
		this.JIaZi.active = (index % 4 == 0 )
	}

	private onClickBuy () {

		GameDataManager.SetDictData(GameDataKey.CurSelectItem, this.data);
		let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
		if(this.data.payType == 1) {
			dispatchFEventWith(LobbyEvent.Open_PayModeLayer); // 测试支付
		} else if(this.data.payType == 2 && this.data.goodsType == GoodsType.ALIPack) { // 支付宝红包
			if(player.redPacket < this.data.price) {
				showPopup(PopupType.TOAST,{msg:  GetErrInfo(1002)}, false)
				return;
			}
			C_Pay_GetWXInfo.Send();
		} else if(this.data.payType == 2 && this.data.goodsType == GoodsType.WXPack) {
			if(player.redPacket < this.data.price) {
				showPopup(PopupType.TOAST,{msg:  GetErrInfo(1002)}, false)
				return;
			}
			C_Pay_GetWXInfo.Send();
		} else if(this.data.payType == PayKinds.RED_PACK){
			C_Pay_TurnRedPack.Send(this.data.goodsId, null, null);
		} else {
			C_Pay_OrderItem.Send(this.data.goodsId, this.data.payType);
		}
		
	}

	getPackIconUrl(goodType: number) {
		let url = "Pay/redPackAli/redPackAli?:"
		if(GoodsType.WXPack == goodType ) {
			url += "img_WeiXin";
		} else if(GoodsType.ALIPack == goodType) {
			url += "img_ZhiFuBao";
		}
		else {
			url = null;
		}
		return url;
	}
}