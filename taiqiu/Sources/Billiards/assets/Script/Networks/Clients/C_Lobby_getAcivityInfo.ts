import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C2S_Login, C2S_Authentication } from "../Protobuf/billiard_pb";
import { Native } from "../../Common/Native";
import { NativeLog } from "../../Common/NativeLog";

// 更新活动信息
export class C_Lobby_getAcivityInfo
{
    public static Send()
    {
    
        ClientManager.SendProtobufMessage(ClientNames.Lobby, {}, PacketID.pushCheckNameInfo);
    }
}
