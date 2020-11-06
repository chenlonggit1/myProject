import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_SyncPos } from "../Protobuf/billiard_pb";
/**更新所有台球的位置信息 */
export class S_Game_UpdateBalls extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_SyncPos.decode(msg.content);
        let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        if(player.id==data.playerID)return;// 玩家自己不需要更新球信息
        let balls = {};
        for (let i = 0; i < data.ballMoves.length; i++) 
        {
            let o = data.ballMoves[i];
            balls[o.id] = {q:o.q,p:o.p};
        }
        dispatchFEventWith(GameEvent.Update_Balls,{playerID:data.playerID,balls:balls});
    }
}
