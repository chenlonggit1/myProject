import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C2S_LayBall } from "../Protobuf/billiard_pb";

export class C_Game_PutTheBall
{
    /**
     * 
     * @param pos 
     * @param dropStatus 0:开始摆球(拿起白球)\n    1：摆球中(拖动白球)\n    2:结束摆球(放下白球)   4：白球进洞后归位，服务端机器人使用(客户端不做同步)
     */
    public static Send(pos:cc.Vec3,dropStatus:number)
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_LayBall.create();
        req.dropStatus = dropStatus;
        req.playerID = player.id;
        req.position = pos;
        let bytes = C2S_LayBall.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.PUT_THE_BALL);
    }
}
