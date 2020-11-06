import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { LobbyShopItemBinder } from "./LobbyShopItemBinder";
import { LobbyGoodsNodeBinder } from "../NavigationModule/LobbyGoodsNodeBinder";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { ShopGoodsVo } from "../../VO/ShopGoodsVo";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { trace } from "../../../Framework/Utility/dx/trace";
import { C_Lobby_Config } from "../../Networks/Clients/C_Lobby_Config";
import { PayKinds, GoodsType } from "../PayModeModule/PayDefine";

/**
*@description:大厅商城模块
**/
export class LobbyShopBinder extends FBinder 
{
	public static ClassName:string = "LobbyShopBinder";

	private btnNodeList:cc.Node[] = [];
	private shopTitleIndex = -1;
	private shopContent:cc.Node = null;
	private shopPool:cc.NodePool = null;
	private lobbyShopItems:LobbyShopItemBinder[] = [];
	private btnNodeIconList: cc.Button[] = [];
	private itemScroller: cc.ScrollView;
	
	protected initViews():void
	{
		super.initViews();

		let btnBack = getNodeChildByName(this.asset,"btn_back");
		btnBack.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
		let btnNode = getNodeChildByName(this.asset,"btnLayout");
		for(let i = 0; i < 4; i++){
			this.btnNodeList[i] = getNodeChildByName(btnNode, "btn_title"+i);
			this.btnNodeList[i].on(cc.Node.EventType.TOUCH_END, () => {
				this.setShopTitle(i);
			}, this);
			this.btnNodeIconList[i] = this.btnNodeList[i].children[0].getComponent(cc.Button);
		}
		this.shopContent = getNodeChildByName(this.asset,"shopScrollView/view/content");
		this.itemScroller = getNodeChildByName(this.asset, "shopScrollView", cc.ScrollView);
		this.initShopPool();
		this.addGoodsNode();
		
		// for(let i = 0; i < 5; i++){
		// 	this.createShopItem(i);
		// }
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this, LobbyEvent.Server_Lobby_Shop_Update, this.onShopUpdate);
	}

	//添加物品节点
	private addGoodsNode() {
		let goodsNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/Navigation/GoodsNode"));
		getNodeChildByName(this.asset,"LobbyNavigation").addChild(goodsNode);
		let goodsNodeInfo = this.addObject(new LobbyGoodsNodeBinder());
		goodsNodeInfo.bindView(goodsNode);
	}

	//初始化任务对象池
	private initShopPool()
	{
		this.shopPool = new cc.NodePool();
		for(let i = 0; i < 10; i++){
			let shopNode = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyShop/ShopItem"));
			this.shopPool.put(shopNode);
		}
	}

	//获取任务对象
	private getShopNode():cc.Node
	{
		let enemy = null;
		if (this.shopPool.size() > 0) {
			enemy = this.shopPool.get();
		} else {
			enemy = StoreManager.NewPrefabNode(Assets.GetPrefab("LobbyScene/LobbyShop/ShopItem"));
		}
		return enemy;
	}

	//回收任务对象
	private shopKilled(shopNode)
	{
		this.shopPool.put(shopNode);
	}

	//设置商城标题
	private setShopTitle(index :number) {
		if (this.shopTitleIndex == index) return;
		this.shopTitleIndex = index;
		let taskNameList = ["btn_YeQian0", "btn_YeQian0", "btn_YeQian0", "btn_YeQian0"];
		let len = taskNameList.length;
		for(let i = 0; i < len; i++) {
			let wanfaName = taskNameList[i] + (index == i ? 1 : 2);
			ResourceManager.LoadSpriteFrame(`Lobby/LobbyShop/LobbyShop?:${wanfaName}`,this.btnNodeList[i].getComponent(cc.Sprite));
			this.btnNodeIconList[i].interactable = (index == i);
		}
		this.ShopUpdate(index + 1);
	}

	//创建商城item
	private createShopItem(index, data: GoodsItemVO)
	{
		let shopItemNode = this.getShopNode();
		this.shopContent.addChild(shopItemNode);
		if (!this.lobbyShopItems[index]){
			this.lobbyShopItems[index] = this.addObject(new LobbyShopItemBinder());
		}
		this.lobbyShopItems[index].bindView(shopItemNode);
		this.lobbyShopItems[index].setShopItem(data, index);
	}

	// 清除显示商品
	clearShopItem() {
		while(this.shopContent.childrenCount > 0) {
			this.shopKilled(this.shopContent.children[0]);
		}

		this.lobbyShopItems.forEach(item => {
			item.dispose();
		})
		this.lobbyShopItems = [];
	}

	private onShopUpdate() {
		let shopVo: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
		let idx = shopVo ? shopVo.shopPage:0;
		this.shopTitleIndex = -1;
		this.setShopTitle(idx);
	}

	private ShopUpdate(itype: GoodsType = GoodsType.GOLD) {
		let ShopGoods:ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods, ShopGoodsVo);
		let goods:GoodsItemVO[] = [];
		this.itemScroller.stopAutoScroll();
		this.itemScroller.scrollToTop();
		if(itype == 3) {
			// let weixin = ShopGoods.getItemsByType(3);
			// let zfb = ShopGoods.getItemsByType(11);
			// weixin && weixin.length > 0 && (goods = goods.concat(weixin));
			// zfb && zfb.length > 0 && (goods = goods.concat(zfb));

			goods = ShopGoods.getGoodsBypayType(PayKinds.RED_PACK)
		} else if(itype == 4) { // 其他商品
			goods = ShopGoods.getGoodsBypayType(PayKinds.DIM)
		}
		else {
			goods = ShopGoods.getItemsByType(itype, PayKinds.RMB, false);
		}
		if(!goods) {
			trace("商品数据为空!!!");
			return;
		}
		this.clearShopItem();
		for(let i = 0; i < goods.length; i++) {
			this.createShopItem(i, goods[i]);
		}
	}

	private onClose() {
		let shopVo: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
		shopVo.shopPage = 0;
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_Shop, null, GameLayer.UI);
	}
}