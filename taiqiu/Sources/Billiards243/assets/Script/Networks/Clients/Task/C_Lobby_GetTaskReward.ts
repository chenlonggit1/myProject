import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_GetTaskReward } from "../../Protobuf/billiard_pb";

export class C_Lobby_GetTaskReward
{
    public static Send(id:number=0)
    {
        let req = C2S_GetTaskReward.create();
        req.id = id;
        let bytes = C2S_GetTaskReward.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_TASK_REWARD);
    }
}
