import { GameReceiveHandler } from "../../GameReceiveHandler";
import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { S2C_LuckCue } from "../../Protobuf/billiard_pb";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";

export class S_Game_LuckBall extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_LuckCue.decode(msg.content);
        if(this.code!=0) // 2. 该环奖励已领取
            dispatchFEventWith(GameEvent.onGameLuckResultReward,null)
        // console.log("接收到幸运一球的结果===========>",this.code);
    }
}