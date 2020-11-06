import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_UpdateGuide } from "../Protobuf/billiard_pb";


export class C_NewGuide_UpdateGuide
{
    public static Send(data: string)
    {
        let req = C2S_UpdateGuide.create();
        req.num = data;

        let bytes = C2S_UpdateGuide.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.NewGuideUpdate);
        cc.log("同步新手引导数据====");
    }
}
