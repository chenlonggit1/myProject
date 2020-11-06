import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { C2S_RedPackage } from "../../Protobuf/billiard_pb";

export class C_Pay_TurnRedPack
{
    public static Send(id:number, aliAccount: string, aliName: string)
    {
        let req = C2S_RedPackage.create();
        req.id = id;
        req.aliAccount = aliAccount;
        req.aliName = aliName;
        let bytes = C2S_RedPackage.encode(req).finish();
        
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.Pay_TurnRedPack);
    }
}
