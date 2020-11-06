import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_RespDouble } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";

export class C_Game_RespDouble
{
    //1-同意，2-反对
    public static Send(flag:number)
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_RespDouble.create();
        req.playerID = player.id;
        req.flag = flag;
        let bytes = C2S_RespDouble.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.RESP_DOUBLE);
    }
}
