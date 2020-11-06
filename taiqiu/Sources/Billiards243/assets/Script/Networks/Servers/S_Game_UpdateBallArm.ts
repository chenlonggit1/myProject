import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_CueMove } from "../Protobuf/billiard_pb";
/**更新操作玩家的亚球杆位置、角度 */
export class S_Game_UpdateBallArm extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_CueMove.decode(msg.content);
        let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        if(player.id==data.playerID)return;// 玩家自己不需要更新球杆信息
        // console.log("更新球杆------->",data.playerID,player.id);
        dispatchFEventWith(GameEvent.Update_BallCue,data);
    }
}
