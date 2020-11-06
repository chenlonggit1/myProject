import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_SellCue } from "../../Protobuf/billiard_pb";

export class C_Lobby_SellCue
{
    public static Send(playerID:number=0,id:number=0)
    {
        let req = C2S_SellCue.create();
        req.playerID = playerID;
        req.id = id;
        let bytes = C2S_SellCue.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.SELL_CUE);
    }
}
