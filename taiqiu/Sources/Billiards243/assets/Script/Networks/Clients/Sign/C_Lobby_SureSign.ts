import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";

export class C_Lobby_SureSign
{
    public static Send()
    {
        ClientManager.SendMessage(ClientNames.Lobby, {}, PacketID.SURE_SIGN);
    }
}
