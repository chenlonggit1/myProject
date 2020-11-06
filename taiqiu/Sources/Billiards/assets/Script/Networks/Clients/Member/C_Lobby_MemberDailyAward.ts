import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_Member_Award } from "../../Protobuf/billiard_pb";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";

/**
 * 会员领取每日奖励
 */
export class C_Lobby_MemberDailyAward
{
    public static Send(level: number)
    {
        let req = C2S_Member_Award.create();
        req.level = level;
        let bytes = C2S_Member_Award.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.MEMBER_AWARD);
    }
}