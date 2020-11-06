import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_GameTimes } from "../../Protobuf/billiard_pb";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { RoomMatchVO } from "../../../VO/RoomMatchVO";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Game_GameTimes extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_GameTimes.decode(msg.content);
        let roomMatch:RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
        roomMatch.updateGameNums(data.gameTimes);
        console.log("游戏次数",data.gameTimes);
    } 
}
