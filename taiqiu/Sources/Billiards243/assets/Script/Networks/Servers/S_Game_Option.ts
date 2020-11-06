import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { trace } from "../../../Framework/Utility/dx/trace";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_OptPlayer } from "../Protobuf/billiard_pb";
import { LoginMediator } from "../../LoginScene/LoginMediator";
/**轮到指定玩家操作 */
export class S_Game_Option extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_OptPlayer.decode(msg.content);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        room.lastPlayer = room.optPlayer;
        if (data.gan > 0)
            room.cueNum = room.lastPlayer == data.id ? room.cueNum + 1 : 0;
        room.optPlayer = data.id;
        room.endTime = data.endTime;
        // room.gan = data.gan;
        //摆球
        if(room.isReconnection && player.id == room.optPlayer && data.layBall > 0) {
            room.reconnectBall = true;
        }else{
            room.reconnectBall = false;
        }
        trace(player.id,"==当前操作的玩家->", room.optPlayer,data.layBall,room.reconnectBall);  
        dispatchFEventWith(GameEvent.Player_Option,room.optPlayer);
        
        
    }
}
