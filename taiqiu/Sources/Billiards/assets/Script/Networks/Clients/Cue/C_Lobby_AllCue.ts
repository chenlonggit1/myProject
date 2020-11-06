import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_AllCue } from "../../Protobuf/billiard_pb";

export class C_Lobby_AllCue
{
    public static Send(playerID:number=0)
    {
        let req = C2S_AllCue.create();
        req.playerID = playerID;
        let bytes = C2S_AllCue.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.ALL_CUE);
    }
}
