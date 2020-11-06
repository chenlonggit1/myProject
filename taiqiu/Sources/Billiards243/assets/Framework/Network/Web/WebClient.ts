import { HttpRequest } from "./HttpRequest";
import { HttpResponseType } from "./HttpResponseType";
import { JTimer } from "../../Timers/JTimer";
import { Fun } from "../../Utility/dx/Fun";


export class WebClient extends HttpRequest
{
    public static ClassName:string = "WebClient";
    public clientName:string="";
    public timeOut:number = 0;
    protected onTimeOut:Function;
    public constructor()
    {
        super();
        this.responseType = HttpResponseType.TEXT;
        //设置响应头
    }
    public addCallBacks(thisObject:any,onComplete:Function,onProgress:Function, onError:Function,onTimeOut?:Function):void 
    {
        super.addCallBacks(thisObject,onComplete,onProgress,onError);
        this.onTimeOut = onTimeOut;
    }
    public open(url:string, method:string = "POST"):void
    {
        super.open(url,method);
        if(this.timeOut>0)
            JTimer.TimeOut(this,this.timeOut,Fun(this.onTimeOutHandler,this));
    }
    protected onReadyStateChange():void 
    {
        JTimer.ClearTimeOut(this);
        super.onReadyStateChange();
    }
    private onTimeOutHandler():void
    {
        if(this.onTimeOut)
        {
            if(this.onTimeOut.length==0)this.onTimeOut.call(this.thisObj);
            else this.onTimeOut.call(this.thisObj,this);
        }else
        {
            if(this.onError)
            {
                if(this.onError.length==0)this.onError.call(this.thisObj);
                else this.onError.call(this.thisObj,this);
            }
        }
        this.abort();
    }

    public abort():void
    {
        JTimer.ClearTimeOut(this);
        super.abort();
    }
    public dispose():void
    {
        this.timeOut = 0;
        super.dispose();
    }
}