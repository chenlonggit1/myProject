import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_LotteryAward } from "../../Protobuf/billiard_pb";
import { LobbyEvent } from "../../../Common/LobbyEvent";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Game_LotteryAward extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_LotteryAward.decode(msg.content);
        console.log("领取抽奖奖励",data,this.code);
        
        dispatchFEventWith(LobbyEvent.Server_RewardLottery,data);
    } 
}
