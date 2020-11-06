import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_LuckyCueOpt } from "../Protobuf/billiard_pb";
/**
 * 幸运一杆，玩家松手后 告知服务器扣除次数
 */
export class C_Game_LuckStopBall
{
    /**
     * 向服务器发送击环结果 
     * type    1：免费  2:vip
     *
     */
    public static Send(type:number)
    {
        let req = C2S_LuckyCueOpt.create();
        req.luckyType = type;
        let bytes = C2S_LuckyCueOpt.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.LUCK_STOPCUE);
    }
}
