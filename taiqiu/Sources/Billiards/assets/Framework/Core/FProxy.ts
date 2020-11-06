import { IProxy } from "../Interfaces/IProxy";
import { EventManager } from "../Managers/EventManager";
import { ProxyManager } from "../Managers/ProxyManager";
import { IClient } from "../Interfaces/Network/IClient";
import { ClientManager } from "../Managers/ClientManager";
import { ReceiveHandler } from "../Network/Sockets/ReceiveHandler";


export default class FProxy implements IProxy
{
    public static ClassName:string = "FProxy";
    protected client: IClient = null;
    protected isNeedDisposeClient: boolean = true;
    public initialize(): void
    {
        ProxyManager.AddProxy(this);
        this.client = this.initClient();
        if(!this.client.isConnected)
            this.connectServer();
        this.initHandlers();
        this.addEvents();
    }

    protected addHandler(key:any, handlerClass:typeof ReceiveHandler):void
    {
        this.client.addHandler(key,new handlerClass,true);
    }

    protected connectServer():void
    {
        
    }
    protected initClient(): IClient
    {
        return null;
    }
    protected initHandlers(): void
    {

    }
    protected addEvents(): void
    {

    }

    protected removeEvents(): void 
    {
        EventManager.removeEvent(this);
    }
    public dispose(): void 
    {
        ProxyManager.RemoveProxy(this);
        this.removeEvents();
        if(this.client != null)
        {
           
            this.client.clearHandlers();
            if (this.isNeedDisposeClient)
                ClientManager.DisposeClients(this.client.clientName);
        }
    }
}
