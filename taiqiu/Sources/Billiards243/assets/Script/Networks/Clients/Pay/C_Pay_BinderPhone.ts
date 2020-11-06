import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_WxOpenIdInfo, C2S_BingdingPhone } from "../../Protobuf/billiard_pb";

export class C_Pay_BinderPhone
{
    public static Send(phone: string)
    {
        let req = C2S_BingdingPhone.create();
        req.phone = phone;
        let bytes = C2S_BingdingPhone.encode(req).finish();
        console.log("=============C_Pay_BinderPhone", req.phone);
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.Pay_BinderPhone);
    }
}
