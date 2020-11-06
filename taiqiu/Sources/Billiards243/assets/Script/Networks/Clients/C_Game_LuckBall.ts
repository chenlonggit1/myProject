import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_ExitRoom, C2S_Lucky } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
/**
 * 发送退出游戏
 */
export class C_Game_LuckBall
{
    /**
     * 向服务器发送击环结果 
     * type    1：免费  2:vip
     *
     */
    public static Send(type:number,result:number)
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_Lucky.create();
        req.luckyType = type;
        req.result = result;
        let bytes = C2S_Lucky.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.LUCK_BALL);
    }
}
