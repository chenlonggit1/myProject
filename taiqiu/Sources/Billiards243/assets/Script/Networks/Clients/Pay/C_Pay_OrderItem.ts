import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_BuyGoods } from "../../Protobuf/billiard_pb";
import { PayKinds } from "../../../LobbyScene/PayModeModule/PayDefine";
import { PlayerVO } from "../../../VO/PlayerVO";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { ShopGoodsVo } from "../../../VO/ShopGoodsVo";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";
import { getLang } from "../../../../Framework/Utility/dx/getLang";

export class C_Pay_OrderItem
{
    public static Send(goodsId: number, payType: number)
    {

        let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
        let shop: ShopGoodsVo = GameDataManager.GetDictData(GameDataKey.ShopGoods);
        let item = shop.getGoodsById(goodsId);
        if(payType == PayKinds.DIM &&  player.diamond < item.price) {
            showPopup(PopupType.TOAST, {msg: getLang("Text_goumaits")});
            return;
        }
        let req = C2S_BuyGoods.create();
        req.id = goodsId;
        req.payType = payType;
        let bytes = C2S_BuyGoods.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.ORDER_ITEM);
        cc.log("========下单=======", req.id);
    }
}
