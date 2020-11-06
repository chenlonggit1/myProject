import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { S2C_NewMail } from "../../Protobuf/billiard_pb";

export class C_Lobby_GetMail
{
    public static Send()
    {
        let req = S2C_NewMail.create();
        let bytes = S2C_NewMail.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_MAIL);
    }
}
