import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_WxOpenIdInfo } from "../../Protobuf/billiard_pb";

export class C_Pay_GetWXInfo
{
    public static Send()
    {
        let req = C2S_WxOpenIdInfo.create();
        let bytes = C2S_WxOpenIdInfo.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.Pay_WXInfo);
    }
}
