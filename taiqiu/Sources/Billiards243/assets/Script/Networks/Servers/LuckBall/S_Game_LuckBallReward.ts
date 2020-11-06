import { GameReceiveHandler } from "../../GameReceiveHandler";
import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { S2C_BilliardAward } from "../../Protobuf/billiard_pb";
import { GameEvent } from "../../../GameEvent";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";

export class S_Game_LuckBallReward extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_BilliardAward.decode(msg.content);
        // cc.log("接收2016",data);
        // 进入大厅时就已经接收到该消息了
        // var luckInfo:GameLuckBallVO =  GameDataManager.GetDictData(GameDataKey.GameLuckBall,GameLuckBallVO);
        // luckInfo.addLuckTimes(data)

        dispatchFEventWith(GameEvent.onGameLuckResultReward,data)

    }
}