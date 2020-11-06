import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_MyCue } from "../../Protobuf/billiard_pb";

export class C_Lobby_MyCue
{
    public static Send(playerID:number=0)
    {
        let req = C2S_MyCue.create();
        req.playerID = playerID;
        let bytes = C2S_MyCue.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.MY_CUE);
    }
}
