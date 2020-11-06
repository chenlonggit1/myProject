import { GameReceiveHandler } from "../GameReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { S2C_Chat } from "../Protobuf/billiard_pb";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";

export class S_Game_Chat extends GameReceiveHandler 
{



    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_Chat.decode(msg.content);
        dispatchFEventWith(GameEvent.onGetPlayerChat,data);
        
    }
}
