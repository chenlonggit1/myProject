import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { S2C_SystemNotice } from "../Protobuf/billiard_pb";

export class C_Lobby_ReqSystemNotice
{
    public static Send()
    {
        let req = S2C_SystemNotice.create();
        let bytes = S2C_SystemNotice.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.REQ_SYSTEM_NOTICE);
    }
}
