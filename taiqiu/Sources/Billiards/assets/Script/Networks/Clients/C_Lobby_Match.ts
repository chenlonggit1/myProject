import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_Match } from "../Protobuf/billiard_pb";

export class C_Lobby_Match
{
    public static Send(moneyId,gameId,changId)
    {
        // / 一位金币类型+2位玩法+1位场次，比如 1011，代表金币场经典九球初级场

        // int32 gameId = 1;         //玩法id，1-经典九球，2-红球玩法，3-抽牌玩法
        // int32 changId = 2;        //场次ID，1-初级场，2-中级场，3-高级场
        // int32 moneyId = 3;        //1=金币场，2-钻石场
        let req = C2S_Match.create();
        req.changId = changId;
        req.moneyId = moneyId;
        req.gameId = gameId;
        let bytes = C2S_Match.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.MATCH);
    }
}
