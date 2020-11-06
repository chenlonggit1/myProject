import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_UseCue } from "../../Protobuf/billiard_pb";

export class C_Lobby_UseCue
{
    public static Send(playerID:number=0,id:number=0)
    {
        let req = C2S_UseCue.create();
        req.playerID = playerID;
        req.id = id;
        let bytes = C2S_UseCue.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.USE_CUE);
    }
}
