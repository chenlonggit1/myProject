import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_MailAward } from "../../Protobuf/billiard_pb";

export class C_Lobby_RewardMail
{
    public static Send(mailId:number)
    {
        let req = C2S_MailAward.create();
        req.mailId = mailId;
        let bytes = C2S_MailAward.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.MAIL_AWARD);
    }
}
