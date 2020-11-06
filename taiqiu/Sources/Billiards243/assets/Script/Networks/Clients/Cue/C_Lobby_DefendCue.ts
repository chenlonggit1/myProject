import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_DefendCue } from "../../Protobuf/billiard_pb";

export class C_Lobby_DefendCue
{
    public static Send(playerId:number=0,id:number=0,defendType:number=0)
    {
        let req = C2S_DefendCue.create();
        req.playerId = playerId;
        req.id = id;
        req.defendType = defendType;
        let bytes = C2S_DefendCue.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.DEFEND_CUE);
    }
}
