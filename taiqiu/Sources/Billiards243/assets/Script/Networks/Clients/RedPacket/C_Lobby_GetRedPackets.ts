import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_GetRedPacket } from "../../Protobuf/billiard_pb";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";

/**
 * 获取红包墙信息
 */
export class C_Lobby_RedPackets
{
    public static Send()
    {
        let req = C2S_GetRedPacket.create();
        let bytes = C2S_GetRedPacket.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_RED_PACKET);
    }
}
