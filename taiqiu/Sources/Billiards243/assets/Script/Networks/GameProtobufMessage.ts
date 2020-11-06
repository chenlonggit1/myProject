
import { ClientMessage } from "../../Framework/Network/Sockets/ClientMessage";
import { CryptoUtility } from "../../Framework/Utility/CryptoUtility";
import { S2C_Login } from "./Protobuf/billiard_pb";


// /** 客户端向服务器发送消息 */
// message C2S 
// {
//     /** 服务器序列 */
//     int32 sid = 1;
//     /** 消息号（各个服独立的，跨服之间可以重复，同一个服内不可重复） */
//     int32 cid = 2;
//     /** 消息序号，用作客户端识别服务器响应 */
//     int32 sequence = 3;
//     /** 消息体数据 */
//     bytes body = 4;
// }


export class GameProtobufMessage extends ClientMessage
{
    public write(value:any,writePacketID:boolean =false):void
    {
        let array = Array.from(value);
        let sid = CryptoUtility.int2Bytes(5,true);// 服务器序列，默认使用5为台球服
        let cid = CryptoUtility.int2Bytes(this.packetID,true);// PacketID
        let sequence = CryptoUtility.int2Bytes(3,true);// 消息序号，暂无使用
        let len = CryptoUtility.int2Bytes(array.length+12,true);
        let arr1 = len.concat(sid).concat(cid).concat(sequence).concat(array);
        this._bytes = new Uint8Array(arr1);        
    }

    public parser(value:any):void
    {
        this._content = value.concat();//Uint8Array.from(value);
    }
}
