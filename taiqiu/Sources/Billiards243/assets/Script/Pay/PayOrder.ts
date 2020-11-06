import { ShopGoodsVo } from "../VO/ShopGoodsVo";
import { GameDataManager } from "../GameDataManager";
import { GameDataKey } from "../GameDataKey";
import { LobbyEvent } from "../Common/LobbyEvent";
import { dispatchFEventWith } from "../../Framework/Utility/dx/dispatchFEventWith";

export function PayOrder(goosId: number):void
{
    let shopVo:ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods, ShopGoodsVo);
    let item = shopVo.getGoodsById(goosId);
    if(!item) {
        cc.error("PayOrder====没有商品数据", goosId);
        return;
    }
    GameDataManager.SetDictData(GameDataKey.CurSelectItem, item);
    dispatchFEventWith(LobbyEvent.Open_PayModeLayer);
}