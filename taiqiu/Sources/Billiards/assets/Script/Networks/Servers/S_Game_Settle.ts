import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_GameSettle } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { RoomVO } from "../../VO/RoomVO";
import { GuideEvent } from "../../GuideEvent";
/**游戏结算 */
export class S_Game_Settle extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_GameSettle.decode(msg.content);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        room.isReconnection = false;
        if(!data.losers.length && !data.winner.length) {
            dispatchFEventWith(GuideEvent.MatchEnd,data);
            return;
        }
        for (let j = 0; j < room.players.length; j++) 
            {
                if(room.players[j].id == data.winner[0].id){
                    room.players[j].winNum++;
                    break;
                }
            }
            //头像处理一下
            for (let i = 0; i < data.winner.length; i++) 
            {
                data.winner[i].head = data.winner[i].head.startsWith("http") ? data.winner[i].head : null;
            }
            for (let i = 0; i < data.losers.length; i++) 
            {
                data.losers[i].head = data.losers[i].head.startsWith("http") ? data.losers[i].head : null;
            }
        dispatchFEventWith(GameEvent.Server_Game_Settle,data);
    }
}
