import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_SyncPos } from "../Protobuf/billiard_pb";
/**向服务器发送同步当前球的位置信息 */
export class C_Game_UpdateBalls
{
    public static Send(ballDatas:any)
    {
        // 
        // //           发送消息的玩家       当前操作的玩家                所有的球
        // let data = {playerID:player.id,balls:ballDatas};
        // // console.log("发送同步球位置的信息====>",JSON.stringify(data));
        // ClientManager.SendMessage(ClientNames.Game, data, PacketID.SYNC_POS);


        let arr = [];
        for (const id in ballDatas) 
            arr.push({id:id,p:ballDatas[id].p,q:ballDatas[id].q});
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let req = C2S_SyncPos.create();
        req.playerID = player.id;
        req.ballMoves = arr;
        let bytes = C2S_SyncPos.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.SYNC_POS);

    }
}
