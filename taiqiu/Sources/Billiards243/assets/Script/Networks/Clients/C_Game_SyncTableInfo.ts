import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_SyncDesk } from "../Protobuf/billiard_pb";

export class C_Game_SyncTableInfo
{
    public static Send(pockets:any[])
    {
        let arr = [];
        for (let i = 0; i < pockets.length; i++) 
            arr.push({id:pockets[i].id,position:pockets[i].position});
        let req = C2S_SyncDesk.create();
        req.pockets = arr;
        let bytes = C2S_SyncDesk.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.SYNC_TABLE_INFO);
    }
}
