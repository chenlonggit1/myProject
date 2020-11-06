import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";

export class C_Lobby_ReqSystemTip
{
    public static Send()
    {
        ClientManager.SendMessage(ClientNames.Lobby, {}, PacketID.GET_SYSTEM_TIP);
    }
}
