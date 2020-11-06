import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataKey } from "../../../GameDataKey";
import { GameDataManager } from "../../../GameDataManager";
import { PlayerTaskVO } from "../../../VO/PlayerTaskVO";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_UpdateTask } from "../../Protobuf/billiard_pb";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_UpdateTask extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {

        super.onDeal(client,msg);
        let data = S2C_UpdateTask.decode(msg.content);
        // console.log("更新任务",data.task);
        let playerTask:PlayerTaskVO = GameDataManager.GetDictData(GameDataKey.PlayerTask,PlayerTaskVO);
        playerTask.updateSingleTask(data.task);
        // dispatchFEventWith(GameEvent.MatchPlayer_Succ);
    } 
}
