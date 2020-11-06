import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_MonCardGiftBag } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { GoodsId } from "../../LobbyScene/PayModeModule/PayDefine";

export class C_Lobby_getDayMouthGIft
{
    public static Send(goodId: GoodsId = GoodsId.WeekVip)
    {
        let req = C2S_MonCardGiftBag.create();
        req.goodsId =  goodId;
        let bytes = C2S_MonCardGiftBag.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.Get_DayMouthGift);
    }
}
