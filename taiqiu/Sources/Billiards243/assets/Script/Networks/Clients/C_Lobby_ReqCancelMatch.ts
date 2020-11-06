import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";

export class C_Lobby_ReqCancelMatch
{
    public static Send()
    {
        ClientManager.SendMessage(ClientNames.Lobby, {}, PacketID.CANCEL_MATCH);
    }
}
