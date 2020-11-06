import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_ActiveAward } from "../../Protobuf/billiard_pb";
import { PlayerTaskVO } from "../../../VO/PlayerTaskVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_ActiveAward extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {

        super.onDeal(client,msg);
        let data = S2C_ActiveAward.decode(msg.content);
        // console.log("领取活跃奖励",data);

        let playerTask:PlayerTaskVO = GameDataManager.GetDictData(GameDataKey.PlayerTask,PlayerTaskVO);
        playerTask.activeStatus = data.activeStatus;
        if(data.taskType == 1) playerTask.dailyActiveStatus = data.activeStatus;
        else if(data.taskType == 2) playerTask.weekActiveStatus = data.activeStatus;
        playerTask.getAllRedPoint();
        dispatchFEventWith(LobbyEvent.Server_GetAcitveReward,data);
    } 
}
