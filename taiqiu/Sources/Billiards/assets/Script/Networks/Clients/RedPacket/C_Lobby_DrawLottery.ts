import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_DrawLottery } from "../../Protobuf/billiard_pb";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";

/**
 * 抽奖
 */
export class C_Lobby_DrawLottery
{
    public static Send(chang: number)
    {
        let req = C2S_DrawLottery.create();
        req.chang = chang;
        let bytes = C2S_DrawLottery.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.DRAW_LOTTERY);
    }
}