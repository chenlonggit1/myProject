import { FModule } from "../../../Framework/Core/FModule";
import { LobbyShopBinder } from "./LobbyShopBinder";
import { C_Lobby_Config } from "../../Networks/Clients/C_Lobby_Config";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { PayEvent } from "../../Common/PayEvent";
import { FEvent } from "../../../Framework/Events/FEvent";
import { S2C_WxOpenIdInfo, C2S_RedPackage } from "../../Networks/Protobuf/billiard_pb";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { C_Pay_TurnRedPack } from "../../Networks/Clients/Pay/C_Pay_TurnRedPack";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { GoodsType } from "../PayModeModule/PayDefine";


/**
*@description:大厅商城模块
**/
export class LobbyShopModule extends FModule 
{
	public static ClassName:string = "LobbyShopModule";
	public get assets():any[]{return ["LobbyScene/LobbyShop/LobbyShop","LobbyScene/LobbyShop/ShopItem","LobbyScene/Navigation/GoodsNode"]};
	
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected createViews():void
	{
		super.createViews();
		this.binder = new LobbyShopBinder();
	}

	protected showViews():void
	{
		C_Lobby_Config.Send(18); // 获取商品配置
		super.showViews();
	}
	protected hideViews():void
	{
		super.hideViews();
	}

	protected addEvents () {
		addEvent(this, PayEvent.Pay_WXInfo, this.onWxInfo);
	}

	private onWxInfo(event: FEvent) {

		let data:S2C_WxOpenIdInfo = event.data;
		let curItem: GoodsItemVO = GameDataManager.GetDictData(GameDataKey.CurSelectItem);
		if(!data.phone) { // 没有手机  打开绑定手机
			cc.error("没绑定手机")
			dispatchFEventWith(PayEvent.Pay_OpenPhoneBinder);
			return;
		}

		if(!data.subscribe && curItem.goodsType == GoodsType.WXPack) {
			cc.error("未关注公众号!");
			dispatchFEventWith(PayEvent.Pay_OpenWXYindao);
			return;
		}

		if(curItem.goodsType == GoodsType.WXPack) {
			C_Pay_TurnRedPack.Send(curItem.goodsId, null, null);
		} else {
			let first = cc.sys.localStorage.getItem("ZFB");
			if(!first) {
				dispatchFEventWith(PayEvent.ZFB_Yindao); 
			} else {
				dispatchFEventWith(PayEvent.Pay_openRedPack_ZFB); 
			}

		}
		
		
	}
}