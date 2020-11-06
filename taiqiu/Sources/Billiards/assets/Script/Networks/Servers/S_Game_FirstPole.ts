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
/**首杆进黑八重置 */
export class S_Game_FirstPole extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        console.log("首杆进黑八");
        dispatchFEventWith(GameEvent.On_Start_NewRound);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        if(room.isReconnection)
            room.reconnectFirstPole = true;
        console.log(room.isReconnection,room.reconnectFirstPole);
    }
}
