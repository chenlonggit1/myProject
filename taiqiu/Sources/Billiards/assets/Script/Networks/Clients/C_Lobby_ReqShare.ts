import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";

export class C_Lobby_ReqShare
{
    public static Send()
    {
        ClientManager.SendMessage(ClientNames.Lobby, {}, PacketID.REQ_SHARE);
    }
}
