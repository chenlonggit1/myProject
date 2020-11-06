import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C2S_Login, C2S_Authentication } from "../Protobuf/billiard_pb";
import { Native } from "../../Common/Native";
import { NativeLog } from "../../Common/NativeLog";

// 实名认证
export class C_Lobby_CheckName
{
    public static Send(idCard: string, name: string)
    {
        let req = C2S_Authentication.create();
        req.idCard = idCard
        req.name = name;
        let bytes = C2S_Authentication.encode(req).finish();
        ClientManager.SendProtobufMessage(ClientNames.Lobby, bytes, PacketID.CheckName);
    }
}
