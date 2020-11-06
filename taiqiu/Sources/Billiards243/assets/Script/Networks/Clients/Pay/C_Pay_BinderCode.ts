import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_WxOpenIdInfo, C2S_PhoneCode } from "../../Protobuf/billiard_pb";
/** 手机验证码 */
export class C_Pay_BinderCode
{
    public static Send(code: string)
    {
        let req = C2S_PhoneCode.create();
        req.poneCode = code;
        let bytes = C2S_PhoneCode.encode(req).finish();
        console.log("=============C_Pay_BinderCode", req.poneCode);
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.Pay_BinderPhoneCode);
    }
}
