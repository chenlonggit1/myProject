import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_Lottery } from "../../Protobuf/billiard_pb";

export class C_Lobby_Lottery
{
    public static Send(chang:number)
    {
        let req = C2S_Lottery.create();
        req.chang = chang;
        let bytes = C2S_Lottery.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GAME_LOTTERY);
    }
}
