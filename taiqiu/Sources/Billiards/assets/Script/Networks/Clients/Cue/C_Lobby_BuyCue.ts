import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_BuyCue } from "../../Protobuf/billiard_pb";

export class C_Lobby_BuyCue
{
    public static Send(playerID:number=0,cueID:number=0)
    {
        let req = C2S_BuyCue.create();
        req.playerID = playerID;
        req.cueID = cueID;
        let bytes = C2S_BuyCue.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.BUY_CUE);
    }
}
