import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { RoomVO } from "../../VO/RoomVO";
import { PacketID } from "../PacketID";
import { C2S_Snooker } from "../Protobuf/billiard_pb";

export class C_Game_PocketBall
{
    public static Send(numbers:number[],pos:number)
    {
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let req = C2S_Snooker.create();
        req.playerID = room.optPlayer;// 进球算当前操作的玩家
        req.numbers = numbers;
        req.pos = pos;
        let bytes = C2S_Snooker.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.SNOOKER);
    }
}
