import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { C2S_UpgradeCue } from "../../Protobuf/billiard_pb";

export class C_Lobby_UpgradeCue
{
    public static Send(playerID:number=0,id:number=0)
    {
        let req = C2S_UpgradeCue.create();
        req.playerID = playerID;
        req.id = id;
        let bytes = C2S_UpgradeCue.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.UPGRADE_CUE);
    }
}
