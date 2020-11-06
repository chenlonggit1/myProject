import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_GetActiveReward } from "../../Protobuf/billiard_pb";

export class C_Lobby_GetActiveReward
{
    public static Send(taskType:number=0,active:number=0)
    {
        let req = C2S_GetActiveReward.create();
        req.taskType = taskType;
        req.active = active;
        let bytes = C2S_GetActiveReward.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_ACTIVE_REWARD);
    }
}
