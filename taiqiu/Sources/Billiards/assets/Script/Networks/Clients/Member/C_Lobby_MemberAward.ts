import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_Member_Level } from "../../Protobuf/billiard_pb";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";

/**
 * 会员领取升级奖励
 */
export class C_Lobby_MemberAward
{
    public static Send(level: number)
    {
        let req = C2S_Member_Level.create();
        req.level = level;
        let bytes = C2S_Member_Level.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_MEMBER_UPGRADE);
    }
}