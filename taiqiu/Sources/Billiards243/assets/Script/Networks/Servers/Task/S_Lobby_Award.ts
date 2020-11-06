import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_Award } from "../../Protobuf/billiard_pb";
import { PlayerTaskVO } from "../../../VO/PlayerTaskVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_Award extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        if(this.code == 0) {
            let data = S2C_Award.decode(msg.content);
            // console.log("领取奖励",data);
            if(data.awards.length == 0) return;
            let playerTask:PlayerTaskVO = GameDataManager.GetDictData(GameDataKey.PlayerTask,PlayerTaskVO);
            playerTask.currentActive = data.active;
            if(data.taskType == 1) playerTask.dailyActive = data.active;
            else if(data.taskType == 2) playerTask.weekActive = data.active;
            playerTask.getAward(data);
            showPopup(PopupType.GET_REWARD, {list: data.awards}, false);
            dispatchFEventWith(LobbyEvent.Server_GetReward,data);
        }else{
            console.log("领取奖励失败",this.code);
        }
        
    } 
}
