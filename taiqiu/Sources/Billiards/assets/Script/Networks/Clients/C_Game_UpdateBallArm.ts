import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C2S_CueMove } from "../Protobuf/billiard_pb";
/**向服务器发送当前球杆的位置、角度 */
export class C_Game_UpdateBallArm
{
    public static Send(angle:cc.Vec3,position:cc.Vec3)
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_CueMove.create();
        req.angle = angle;
        req.playerID = player.id;
        req.position = position;
        let bytes = C2S_CueMove.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.CUE_MOVE);
    }
}
