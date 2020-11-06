import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_ReqDouble } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";

export class C_Game_ReqDouble
{
    public static Send()
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_ReqDouble.create();
        req.playerID = player.id;
        let bytes = C2S_ReqDouble.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.REQ_DOUBLE);
    }
}
