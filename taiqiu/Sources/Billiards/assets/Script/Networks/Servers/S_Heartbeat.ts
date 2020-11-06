import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { C_Heartbeat } from "../Clients/C_Heartbeat";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_Heart } from "../Protobuf/billiard_pb";

export class S_Heartbeat extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_Heart.decode(msg.content);
        C_Heartbeat.Clear(data.sequence);
    }
}
