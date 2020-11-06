import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_Task } from "../../Protobuf/billiard_pb";
import { PlayerTaskVO } from "../../../VO/PlayerTaskVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_Task extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_Task.decode(msg.content);
        // console.log("任务",data.tasks);
        let playerTask:PlayerTaskVO = GameDataManager.GetDictData(GameDataKey.PlayerTask,PlayerTaskVO);
        if(data.tasks.length == 0) return;
        if(data.tasks[0].taskType == 1){
            playerTask.updateDailyTasks(data.tasks);
            playerTask.dailyActive = data.active;
            playerTask.dailyActiveStatus = data.activeStatus;
        }
        else if(data.tasks[0].taskType == 2){
            playerTask.updateWeekTasks(data.tasks);
            playerTask.weekActive = data.active;
            playerTask.weekActiveStatus = data.activeStatus;
        }
        else if(data.tasks[0].taskType == 3){
            playerTask.updateGrowthTasks(data.tasks);
        }
        playerTask.currentActive = data.active;
        playerTask.activeStatus = data.activeStatus;
        // console.log(playerTask);
        dispatchFEventWith(LobbyEvent.Server_UpdateTask,data);
    } 
}
