import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_NewRound } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";

export class C_Game_NewRound
{
    public static Send()
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_NewRound.create();
        req.id = player.id;
        let bytes = C2S_NewRound.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.NEW_ROUND);
    }
}
