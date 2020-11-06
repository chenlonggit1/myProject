import { IDispose } from "../IDispose";
import { IClientMessage } from "./IClientMessage";
import { IReceiveHandler } from "./IReceiveHandler";

/**
*@description:游戏通用客户端
**/
export interface IClient extends IDispose
{
    connect(IP:string,port:number): void;
    connectURL(url:string):void;

    addCallBacks(thisObject:any,onConnect:Function,onGetClientData:Function, onClose:Function, onError:Function,onTimeOut:Function):void;
    sendMessage(msg: IClientMessage):void;

    addHandler(key:any, handler:IReceiveHandler,isForce:boolean):void;
    removeHandler(key:any):void;
    clearHandlers():void;
    
    close():void;

    isConnected:boolean;
    clientName:string;

}
