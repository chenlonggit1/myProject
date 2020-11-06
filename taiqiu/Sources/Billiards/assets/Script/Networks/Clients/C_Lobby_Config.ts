import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_GetConfig } from "../Protobuf/billiard_pb";

export class C_Lobby_Config
{
    //configType=1所有球杆配置信息 configType=2单个球杆升级配置信息
    public static Send(configType:number=0)
    {
        let req = C2S_GetConfig.create();
        req.configType = configType;
        let bytes = C2S_GetConfig.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_CONFIG);
    }
}
