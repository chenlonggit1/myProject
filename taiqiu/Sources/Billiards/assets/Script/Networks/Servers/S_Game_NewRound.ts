import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_NewRound } from "../Protobuf/billiard_pb";
/**再来一局 */
export class S_Game_NewRound extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_NewRound.decode(msg.content);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let isCanStartNewRound = true;
        for (let i = 0; i < room.players.length; i++) 
        {
            if(data.id==room.players[i].id)
            {
                room.players[i].isReady = true;
                break;
            }
        }
        for (let i = 0; i < room.players.length; i++) 
        {
            if(room.players[i].isReady==false)
            {
                isCanStartNewRound = false;
                break;
            }
        }
        if(isCanStartNewRound)
        {
            console.log("===开始新一轮======》");
            dispatchFEventWith(GameEvent.On_Start_NewRound);
        }
    }
}
