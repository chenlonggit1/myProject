import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_UseRole } from "../../Protobuf/billiard_pb";

export class C_Lobby_UseRole
{
    public static Send(id:number=0)
    {
        let req = C2S_UseRole.create();
        req.id = id;
        let bytes = C2S_UseRole.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.USE_ROLE);
    }
}
