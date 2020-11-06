import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { S2C_NewMail } from "../../Protobuf/billiard_pb";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";

/**
 * 获取会员信息
 */
export class C_Lobby_GetMember
{
    public static Send()
    {
        let req = S2C_NewMail.create();
        let bytes = S2C_NewMail.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_MEMBER);
    }
}