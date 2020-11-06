import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";

export class C_Pay_GetPayMode
{
    public static Send()
    {
        // let bytes = C2S_ExitRoom.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, {}, PacketID.GET_PAY_MODE);
    }
}
