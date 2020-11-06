import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C2S_Batting } from "../Protobuf/billiard_pb";
/**
 * 向服务器发送发球
 */
export class C_Game_ShotBall
{
    public static Send(angle:number,force:cc.Vec3,velocity:cc.Vec3,powerScale:number,contactPoint:cc.Vec2,gasserAngle:number,hitPos:cc.Vec2,hitAngle:number)
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_Batting.create();
        req.playerID = player.id;
        req.angle = angle;
        req.powerScale = powerScale;
        req.velocity = velocity;
        req.contactPoint = contactPoint;
        req.gasserAngle = gasserAngle;
        req.force = force;
        req.hitPoint = hitPos;
        req.hitAngle = hitAngle;
        let bytes = C2S_Batting.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.PLAYER_OPT);
    }
}
