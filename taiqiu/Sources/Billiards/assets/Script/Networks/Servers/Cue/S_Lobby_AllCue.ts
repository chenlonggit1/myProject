import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_AllCue } from "../../Protobuf/billiard_pb";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_AllCue extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {

        super.onDeal(client,msg);
        let data = S2C_AllCue.decode(msg.content);
        // console.log("所有球杆",data);
    } 
}
