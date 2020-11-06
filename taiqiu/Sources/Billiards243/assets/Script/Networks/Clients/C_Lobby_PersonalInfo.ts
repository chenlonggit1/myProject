import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_AllItem } from "../Protobuf/billiard_pb";

export class C_Lobby_PersonalInfo
{
    public static Send()
    {
        let req = C2S_AllItem.create();
        let bytes = C2S_AllItem.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.PERSONAL_INFO);
    }
}
