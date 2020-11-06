import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C2S_SyncPos2 } from "../Protobuf/billiard_pb";
import { RoomVO } from "../../VO/RoomVO";

export class C_Game_OptionComplete
{
    /**
     * 
     * @param ballDatas 
     * @param illegality 犯规类型 0:正常 1:空杆  2:打到别人的球   3:白球落袋
     */
    public static Send(ballDatas:any[],hitBalls:any[],isHitKu:boolean)
    {
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let req = C2S_SyncPos2.create();

        if(room.gan > 0)
            req.playerID = room.optPlayer;
        else 
            req.playerID = player.id;

        req.hitFirstBall = hitBalls.length==0?0:hitBalls[0];
        req.balls = ballDatas;
        req.gan = room.gan;
        req.hitKu = isHitKu?1:0;
        let bytes = C2S_SyncPos2.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.OPTION_COMPLETE);        
    }
}
