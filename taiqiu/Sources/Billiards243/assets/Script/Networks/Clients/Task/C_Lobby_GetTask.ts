import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_GetTask } from "../../Protobuf/billiard_pb";

export class C_Lobby_GetTask
{
    public static Send(taskType:number=0)
    {
        let req = C2S_GetTask.create();
        req.taskType = taskType;
        let bytes = C2S_GetTask.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.GET_TASK);
    }
}
