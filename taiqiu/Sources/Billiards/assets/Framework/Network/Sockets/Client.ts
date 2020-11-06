import { IClient } from "../../Interfaces/Network/IClient";
import { IClientMessage } from "../../Interfaces/Network/IClientMessage";
import { IReceiveHandler } from "../../Interfaces/Network/IReceiveHandler";
import { trace } from "../../Utility/dx/trace";
import { ClientDealer } from "./ClientDealer";
import { ClientMessage } from "./ClientMessage";
import { ClientSocket } from "./ClientSocket";
import { PacketBuffer } from "./PacketBuffer";



export class Client implements IClient
{
    public static ClassName:string = "Client";
    public repeatConnectCount:number = 3;
    protected onConnected:Function;
    protected onClosed:Function;
    protected onGetClientData:Function;
    protected onError:Function;
    protected onTimeOut:Function;
    protected thisObject:any;
    protected _clientName:string = null;
    protected currentRepeat:number = 0;
    protected socket:ClientSocket;
    protected dealer:ClientDealer = new ClientDealer();;
    // protected encrypter:Encrypter;
    protected address:string;
    public constructor()
    {
        this.initialize();
    }

    protected initialize(): void
    {
        this._clientName = "Client";
        this.socket = new ClientSocket();
        this.socket.buffer = new PacketBuffer();
        this.socket.timeOut = 5000;
        this.socket.addCallBacks(this,this.onSocketConnected,this.onGetSocketData,this.onSocketClosed,this.onSocketError,this.onSocketTimeOut);
    }

    public addCallBacks(thisObject:any,onConnect:Function,onGetClientData:Function, onClose:Function, onError:Function,onTimeOut:Function):void 
    {
        this.onConnected = onConnect;
        this.onClosed = onClose;
        this.onGetClientData = onGetClientData;
        this.onError = onError;
        this.onTimeOut = onTimeOut;
        this.thisObject = thisObject;
    }
    public connect(IP:string,port:number): void
    {
        this.currentRepeat = 0;
        this.connectURL(IP+":"+port);
    }
    public connectURL(url:string):void
    {
        if(url.indexOf("ws://")==-1)url = "ws://"+url;
        this.address = url;
        this.socket&&this.socket.connectByUrl(url);
    }
    protected onSocketConnected():void
    {
        this.currentRepeat = this.repeatConnectCount;
        if(this.onConnected!=null)
        {
            if(this.onConnected.length==0)this.onConnected.call(this.thisObject);
            else if(this.onConnected.length==1)this.onConnected.call(this.thisObject,this);
        }
    }
    protected onGetSocketData(data):void
    {
        let msgBytes = this.socket.socketBytes;
        if(msgBytes.length==0)return;
        var packetID:number = msgBytes.shift();
        var msg:ClientMessage = this.createMessage(packetID);
        // msg.parser(CryptoUtility.GetString(CryptoUtility.ConvertWordArray(msgBytes)));
        this.socket.socketBytes.length = 0;
        this.onGetReceiveMessage(msg);
        var handler:IReceiveHandler = this.dealer.getHandler(packetID);
        if(handler!=null)handler.onDeal(this,msg);
        else
        {
            trace("Client "+this.clientName,"未设置用于处理 PacketID=0x"+packetID.toString(16)+" 的 ClientHandler",JSON.stringify(msg.content));
        } 
        if(this.onGetClientData!=null)
        {
            if(this.onGetClientData.length==0)this.onGetClientData.call(this.thisObject);
            else if(this.onGetClientData.length==1)this.onGetClientData.call(this.thisObject,this);
            else if(this.onGetClientData.length==2)this.onGetClientData.call(this.thisObject,this,msg);
        }
        msg.dispose();
    }

    protected createMessage(packetID:number):ClientMessage
    {
        return ClientMessage.Get(packetID);
    }
    protected onGetReceiveMessage(msg:ClientMessage):void
    {

    }
    protected onSocketClosed():void
    {
        // trace("Client "+this.clientName,"===>",this.address,"clientonSocketClosed关闭");
        if(this.onClosed!=null)
        {
            if(this.onClosed.length==0)this.onClosed.call(this.thisObject);
            else if(this.onClosed.length==1)this.onClosed.call(this.thisObject,this);
        }
    }
    protected onSocketError():void
    {
        this.currentRepeat++;
        if(this.currentRepeat<this.repeatConnectCount)
        {
            this.socket.reconnect();
            return;
        }
        // trace("Client "+this.clientName,"===>连接",this.address,"失败！！！");
        if(this.onError!=null)
        {
            if(this.onError.length==0)this.onError.call(this.thisObject);
            else if(this.onError.length==1)this.onError.call(this.thisObject,this);
        }
    }
    protected onSocketTimeOut():void
    {
        this.currentRepeat++;
        if(this.currentRepeat<this.repeatConnectCount)
        {
            this.socket.reconnect();
            return;
        }
        // trace("Client "+this.clientName,"===>连接",this.address,"超时！！！");
        if(this.onTimeOut!=null)
        {
            if(this.onTimeOut.length==0)this.onTimeOut.call(this.thisObject);
            else if(this.onTimeOut.length==1)this.onTimeOut.call(this.thisObject,this);
        }
    }
    public sendMessage(msg: IClientMessage):void
    {
        if(msg==null)return;
        var bytes:ArrayBuffer = msg.bytes;
        // 屏蔽所有数据加密
        // bytes = this.encrypter.EncodeSocketData(msg.packetID,bytes);
        // console.log("发送字节长度====>",bytes.byteLength);
        this.sendBytes(bytes);
        msg.dispose();
    }

    public sendBytes(bytes:ArrayBuffer)
    {
        this.socket&&this.socket.send(bytes);
    }


    public get isConnected():boolean{return this.socket&&this.socket.connected;}
    public get clientName():string{return this._clientName;}
    public set clientName(value:string){this._clientName = value;}
    // public setEncrypter(encrypter:Encrypter):void{this.encrypter = encrypter;}
    public clearHandlers():void{this.dealer&&this.dealer.clear();}
    public addHandler(key:any, handler:IReceiveHandler,isForce:boolean = false):void{this.dealer&&this.dealer.addHandler(key,handler,isForce);}
    public removeHandler(key:any):void{this.dealer&&this.dealer.removeHandler(key);}

    public clearCallbacks()
    {
        this.onError = null;
        this.onClosed = null;
        this.onTimeOut = null;
        this.onConnected = null;
        this.onGetClientData = null;
    }
    public close():void{this.socket&&this.socket.close();}
    public dispose(): void 
    {
        this.clearCallbacks();
        this.close();
        this.clearHandlers();
        this.socket&&this.socket.dispose();
        this.dealer&&this.dealer.dispose();
        // this.encrypter = null;
        this.thisObject = null;
        this.socket = null;
        this.dealer = null;
    }
}