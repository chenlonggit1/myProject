import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";

export class C_Lobby_GetSignConf
{
    public static Send()
    {
        // let bytes = C2S_ExitRoom.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, {}, PacketID.GET_SIGN_CONF);
        cc.log("==========C_Lobby_GetSignConf", PacketID.GET_SIGN_CONF)
    }
}
