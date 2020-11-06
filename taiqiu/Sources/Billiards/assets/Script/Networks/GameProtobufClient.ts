import { Client } from "../../Framework/Network/Sockets/Client";
import { ClientSocket } from "../../Framework/Network/Sockets/ClientSocket";
import { ClientMessage } from "../../Framework/Network/Sockets/ClientMessage";
import { IReceiveHandler } from "../../Framework/Interfaces/Network/IReceiveHandler";
import { trace } from "../../Framework/Utility/dx/trace";
import { CryptoUtility } from "../../Framework/Utility/CryptoUtility";
import { GameProtobufMessage } from "./GameProtobufMessage";
import { StoreManager } from "../../Framework/Managers/StoreManager";

export class GameProtobufClient extends Client 
{


    // /** 服务端向客户端发送消息 */
    // message S2C 
    // {
    //     /** 服务器序列 */
    //     int32 sid = 1;
    //     /** 消息号（各个服独立的，跨服之间可以重复，同一个服内不可重复） */
    //     int32 cid = 2;
    //     /** 消息序号，用作客户端识别服务器响应 */
    //     int32 sequence = 3;
    //     /** 响应结果，0是成功，1是请求超时（消息已发出），2是请求错误（消息未发出），大于100是服务器响应返回的错误 */
    //     int32 code = 4;
    //     /** 消息体数据 */
    //     bytes body = 5;
    //     /** 错误信息 */
    //     string errStr = 6;
    // }
    protected msgLen:number = -1;
    private traceMsgs = [1103,1103,1112,2007,1201,1112,105];
    protected onGetSocketData(data): void
    {
        let msgBytes = this.socket.socketBytes;
        while(msgBytes.length>=4&&msgBytes.length>=this.msgLen)
        {
            if(this.msgLen==-1)this.msgLen = CryptoUtility.bytes2Int(CryptoUtility.SpliteBytes(msgBytes,0,4,true),true);
            let sid = CryptoUtility.bytes2Int(CryptoUtility.SpliteBytes(msgBytes,0,4,true),true);
            let cid = CryptoUtility.bytes2Int(CryptoUtility.SpliteBytes(msgBytes,0,4,true),true);
            let sequence = CryptoUtility.bytes2Int(CryptoUtility.SpliteBytes(msgBytes,0,4,true),true);
            var msg:ClientMessage = this.createMessage(cid);
            msg.parser(msgBytes);
            CryptoUtility.SpliteBytes(msgBytes,0,this.msgLen-12,true);// 
            this.onGetReceiveMessage(msg);
            var handler:IReceiveHandler = this.dealer.getHandler(msg.packetID);
            if(handler!=null)
            {
                handler.onDeal(this,msg);
                if(this.traceMsgs.indexOf(msg.packetID)==-1)
                    trace("接收到消息--->PacketID=",msg.packetID);
            }
            else 
            {
                if(msg.packetID!=1111)
                    trace("Client "+this.clientName,"未设置用于处理 PacketID="+msg.packetID+" 的 ClientHandler",JSON.stringify(msg.content));
            }

            if(this.onGetClientData!=null)
            {
                if(this.onGetClientData.length==0)this.onGetClientData.call(this.thisObject);
                else if(this.onGetClientData.length==1)this.onGetClientData.call(this.thisObject,this);
                else if(this.onGetClientData.length==2)this.onGetClientData.call(this.thisObject,this,msg);
            }
            msg.dispose();
            this.msgLen = -1;
        }
    }

    protected createMessage(packetID:number):ClientMessage
    {
        let msg:GameProtobufMessage = StoreManager.New(GameProtobufMessage);
        msg.packetID = packetID;
        return msg;
    }
}
