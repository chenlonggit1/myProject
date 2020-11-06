import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_AliInfo } from "../../Protobuf/billiard_pb";

export class C_Pay_GetZFBInfo
{
    public static Send()
    {
        // let req = new C2S_AliInfo(); // 
        // let bytes = C2S_AliInfo.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, {}, PacketID.Pay_GetFZBInfo);
    }
}
