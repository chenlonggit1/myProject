import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_Batting } from "../Protobuf/billiard_pb";
import { RoomVO } from "../../VO/RoomVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
/**玩家发球 */
export class S_Game_ShotBall extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_Batting.decode(msg.content);
        dispatchFEventWith(GameEvent.Player_ShotBall,data);

        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        //console.log("玩家发球",room.isReconnection);
        if(room.isReconnection) {
            room.reconnectOption = true;
        }
    }
}
