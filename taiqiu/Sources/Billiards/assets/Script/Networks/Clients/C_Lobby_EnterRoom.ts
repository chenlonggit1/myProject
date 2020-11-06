import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_EnterRoom } from "../Protobuf/billiard_pb";

export class C_Lobby_EnterRoom
{
    public static Send()
    {
        let req = C2S_EnterRoom.create();
        let bytes = C2S_EnterRoom.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.INIT_ROOM);
        // // console.log("发送进入房间的消息");
    }
}
