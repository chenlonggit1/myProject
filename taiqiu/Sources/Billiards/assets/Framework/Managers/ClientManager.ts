import { Client } from "../Network/Sockets/Client";
import { ClientMessage } from "../Network/Sockets/ClientMessage";
import { StoreManager } from "./StoreManager";

export class ClientManager
{
    private static clientClass:any = Client;
    private static messageClass:any = ClientMessage;
    private static clients:{[key:string]:Client} = {}; 
    /**设置默认使用的Client类型 */
    public static SetDefaultClass(clientClass:typeof Client,messageClass:typeof ClientMessage):void
    {
        this.clientClass = clientClass;
        this.messageClass = messageClass;
    }
    public static SwapClient(client1:Client,client2:Client):void
    {
        var name1:string = client1.clientName;
        client1.clientName = client2.clientName;
        client2.clientName = name1;

        this.clients[client1.clientName] = client1;
        this.clients[client2.clientName] = client2;
    }
    public static IsActiveClient(clientName:string):boolean
    {
        let client = this.clients[clientName];
        if(client)return client.isConnected;
        return false;
    }

    private static traceMsgs = [1103,1201,1112,105];
    /**
     * 向指定的Client发送消息
     */		
    public static SendMessage(clientName:string,data:any,packetID:number,RTOTarget?:any,RTOCallBack?:Function,...RTOPacketIDs):void
    {
        if(data==null)return;
        if(this.traceMsgs.indexOf(packetID)==-1)
            console.log("向服务器发送消息====>",packetID);
        
        // data.TimeStamp = new Date().getTime();
        var client:Client = this.GetClientByName(clientName);
        if(client!=null&&client.isConnected)
        {
            let msg:ClientMessage = StoreManager.New(this.messageClass);
            msg.setMessage(packetID,data,true);
            client.sendMessage(msg);
        }
    }

    public static SendProtobufMessage(clientName:string,data:any,packetID:number)
    {
        if(data==null)return;
        
        if(packetID!=1103)console.log("向服务器发送消息====>",packetID);
        var client:Client = this.GetClientByName(clientName);
        if(client!=null&&client.isConnected)
        {
            let msg:ClientMessage = StoreManager.New(this.messageClass);
            msg.setMessage(packetID,data,true);
            client.sendMessage(msg);
        }
    }
    /**
     * 通过ClientName获取到Client实例
     */		
    public static GetClientByName(clientName:string):Client
    {
        let client = this.clients[clientName];
        if(client==null)client = this.GetNewClient(clientName);
        return client;
    }
    /**
     * 关闭Client
     */		
    public static DisposeClients(...clientNames):void
    {
        for (let i = 0; i < clientNames.length; i++) 
        {
            let client:Client = this.clients[clientNames[i]];
            if(client==null)continue;
            client.dispose();
            delete this.clients[clientNames[i]];
        }
    }
    private static GetNewClient(clientName:string,ip:string=null,port:number=0):Client
    {
        var client:Client = StoreManager.New(this.clientClass);
        if(ip!=null&&port!=0)client.connect(ip,port);
        client.clientName = clientName;
        this.clients[clientName] = client;
        return client;
    }
}