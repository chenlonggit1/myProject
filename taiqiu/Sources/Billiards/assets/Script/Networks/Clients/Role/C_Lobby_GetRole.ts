import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_getRole } from "../../Protobuf/billiard_pb";

export class C_Lobby_GetRole
{
    public static Send()
    {
        let req = C2S_getRole.create();
        let bytes = C2S_getRole.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_ROLE);
    }
}
