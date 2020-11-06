import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";

/**
*@description:大厅导航栏模块
**/
export class LobbyGoodsNodeBinder extends FBinder 
{
	public static ClassName:string = "LobbyGoodsNodeBinder";

	private btnGoldAdd:cc.Node = null;
	private btnDiamondAdd:cc.Node = null;
	private btnredPackAdd: cc.Node = null;
	private lbGold:cc.Label = null;
	private lbDiamond:cc.Label = null;
	private lbRedPacket:cc.Label = null;
	
	protected initViews():void
	{
		super.initViews();
		super.addEvents(); 
		this.btnGoldAdd = getNodeChildByName(this.asset, "goldNode/btnGoldAdd");
		
		this.btnGoldAdd && this.btnGoldAdd.on(cc.Node.EventType.TOUCH_END, () => {
			let shopVo: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods, ShopGoodsVo);
			shopVo.shopPage = 0;
			dispatchFEventWith(LobbyEvent.Open_LobbyShop);
			console.log('点击金币');
		}, this);
		this.btnDiamondAdd = getNodeChildByName(this.asset, "diamondNode/btnDiamondAdd");
		this.btnDiamondAdd.on(cc.Node.EventType.TOUCH_END, () => {
			let shopVo: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods, ShopGoodsVo);
			shopVo.shopPage = 1;
			dispatchFEventWith(LobbyEvent.Open_LobbyShop);
			console.log('点击钻石');
		}, this);
		this.btnredPackAdd = getNodeChildByName(this.asset, "redPacketNode/btnRedPacketAdd");
		this.btnredPackAdd.on(cc.Node.EventType.TOUCH_END, () => {
			let shopVo: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods, ShopGoodsVo);
			shopVo.shopPage = 2;
			dispatchFEventWith(LobbyEvent.Open_LobbyShop);
			console.log('点击红包');
		}, this);
		
		this.lbGold = getNodeChildByName(this.asset, "goldNode/lbGold", cc.Label);
		this.lbDiamond = getNodeChildByName(this.asset, "diamondNode/lbDiamond", cc.Label);
		this.lbRedPacket = getNodeChildByName(this.asset, "redPacketNode/lbRedPacket", cc.Label);
		this.updatePlayerInfo();
	}

	protected addEvents() {
		addEvent(this,LobbyEvent.Server_Lobby_UpdateGold,this.updatePlayerInfo);
		addEvent(this,LobbyEvent.Server_Lobby_UpdateDiamond,this.updatePlayerInfo);
		addEvent(this,LobbyEvent.Server_Lobby_UpdateRedPacket,this.updatePlayerInfo);
	}

	//更新玩家信息
	private updatePlayerInfo() {
		let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.lbGold.string = player.gold;
		this.lbDiamond.string = player.diamond;
		this.lbRedPacket.string = player.redPacket;
	}
}