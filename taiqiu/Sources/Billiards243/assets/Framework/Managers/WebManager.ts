import { WebClient } from "../Network/Web/WebClient";
import { HttpRequest } from "../Network/Web/HttpRequest";
import { IHttpRequest } from "../Interfaces/Network/IHttpRequest";
import { FFunction } from "../Core/FFunction";
import { trace } from "../Utility/dx/trace";
import { StoreManager } from "./StoreManager";

export class WebManager
{
    private static clientClass:any = WebClient;
    private static clientDict:{[key:string]:object} = {};


     /**设置默认使用的Client类型 */
     public static SetDefaultClass(clientClass:typeof HttpRequest|IHttpRequest):void
     {
        this.clientClass = clientClass;
     }

    public static GetWebData(url:string,data:object,onComplete:Function,onFail:Function = null):void
    {
        if(this.clientDict[url]!=undefined)return;// 不允许重复调用接口
        this.clientDict[url] = {onComplete:onComplete,onFail:onFail};
        let client = this.GetClient();
        if("timeOut" in client)(client as any)["timeOut"] = 10000;
        client.open(url);
        client.api = url;
        client.send(data?JSON.stringify(data):null);
    }


    public static async GetWebDataAsync(url:string,data?:object)
    {
        return new Promise((resolve, reject)=>
        {
            let client = this.GetClient(false);
            if("timeOut" in client)(client as any)["timeOut"] = 5000;
            // client.setRequestHeader("Access-Control-Allow-Origin","*")
            client.addCallBacks(this,(c,d)=>resolve(d),null,(c)=>resolve(""));
            client.open(url,"GET");
            client.send(data?JSON.stringify(data):null);
        });
    }
    private static onWebClientGetData(client:HttpRequest,data:any):void
    {
        if(this.clientDict[client.api]!=undefined)
        {
            let o:any = this.clientDict[client.api];
            if(o.onComplete!=null)o.onComplete(data);//.//call(o.obj,data);
            o.onComplete = null;
        }
        this.storeClient(client);
    }
    private static onWebClientFail(client:HttpRequest):void
    {
        trace("[WebManager] 无法获取Web接口===>",client.api," 的数据!!!");
        if(this.clientDict[client.api]!=undefined)
        {
            let o:any = this.clientDict[client.api];
            if(o.onFail!=null)o.onFail();//.call(o.obj);
        }
        this.storeClient(client);
    }
    private static onWebClientTimeOut(client:HttpRequest):void
    {
        trace("[WebManager]调用Web接口===>",client.api," 超时!!!");
        if(this.clientDict[client.api]!=undefined)
        {
            let o:any = this.clientDict[client.api];
            if(o.onFail!=null)o.onFail();//.call(o.obj);
        }
        this.storeClient(client);
    }
    private static storeClient(client:HttpRequest):void
    {
        if(this.clientDict[client.api]!=undefined)
            delete this.clientDict[client.api];
        client.dispose();
    }
    public static GetClient(isSetCallback:boolean=true):HttpRequest
    {
        var client:HttpRequest = StoreManager.New(this.clientClass);
        if(isSetCallback)
        {
            if(client instanceof WebClient)
                (client as WebClient).addCallBacks(this,this.onWebClientGetData,null,this.onWebClientFail,this.onWebClientTimeOut);
            else client.addCallBacks(this,this.onWebClientGetData,null,this.onWebClientFail);
        }
        return client;
    }
}
