import { IDispose } from "../../Interfaces/IDispose";
import { IHttpRequest } from "../../Interfaces/Network/IHttpRequest";

export class HttpRequest implements IHttpRequest,IDispose
{
    public static ClassName:string = "HttpRequest";

    private _responseType:"" | "arraybuffer" | "blob" | "document" | "json" | "text";
    private _url:string = "";
    private _method:string = "";
    private _withCredentials:boolean;
    private _xhr:XMLHttpRequest;
    protected headerObj:any;
    protected thisObj:any;
    protected onComplete:Function;
    protected onProgress:Function;
    protected onError:Function;
    public api:string = "";
    private async:boolean = true;


    public addCallBacks(thisObject:any,onComplete:Function,onProgress:Function, onError:Function):void 
    {
        this.onComplete = onComplete;
        this.onError = onError;
        this.onProgress = onProgress;
        this.thisObj = thisObject;
    }
    /**设置返回的数据格式，请使用 HttpResponseType 里定义的枚举值。设置非法的值或不设置，都将使用HttpResponseType.TEXT。*/
    public get responseType():"" | "arraybuffer" | "blob" | "document" | "json" | "text" {return this._responseType;}
    public set responseType(value:"" | "arraybuffer" | "blob" | "document" | "json" | "text"){this._responseType = value;}
    /**表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。(这个标志不会影响同站的请求)*/
    public get withCredentials():boolean{return this._withCredentials;}
    public set withCredentials(value:boolean) {this._withCredentials = value;}
    /**
     * 本次请求返回的数据，数据类型根据responseType设置的值确定。
     */
    public get response():any 
    {
        if (!this._xhr) return null;        
        if (this._xhr.response != undefined)return this._xhr.response;
        if (this._responseType == "text")return this._xhr.responseText;
        if (this._responseType == "arraybuffer" && /msie 9.0/i.test(navigator.userAgent))
        {
            let w:any = window;
            return w.convertResponseBodyToText(this._xhr["responseBody"]);
        }
        if (this._responseType == "document")return this._xhr.responseXML;
        return null;
    }

	/**
     * 初始化一个请求.注意，若在已经发出请求的对象上调用此方法，相当于立即调用abort().
     * @param url 该请求所要访问的URL该请求所要访问的URL
     * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
     */
    public open(url:string, method:string = "GET",async:boolean=true):void 
    {
        this._url = url;
        this._method = method;
        if (this._xhr) {
            this._xhr.abort();
            this._xhr = null;
        }
        this.async = async;
        this._xhr = this.getXHR();//new XMLHttpRequest();
        this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
        this._xhr.onprogress = this.updateProgress.bind(this);
        this._xhr.open(this._method, this._url, this.async);
    }

    protected get xhr():any{
        return this._xhr;
    }

    private getXHR():any 
    {
        if (window["XMLHttpRequest"]) return new window["XMLHttpRequest"]();
        else 
        {
            throw Error("Not Fount XMLHttpRequest!!!!");
            //return new ActiveXObject("MSXML2.XMLHTTP");
        }
    }
    protected onReadyStateChange():void 
    {
        let xhr = this._xhr;
        if (xhr.readyState == 4) 
        {// 4 = "loaded"
            let ioError = (xhr.status >= 400 || xhr.status == 0);
            let url = this._url;
            setTimeout(function ():void
            {
                if (ioError) //请求错误
                {
                    if(this.onError)
                    {
                        if(this.onError.length==0)this.onError.call(this.thisObj);
                        else this.onError.call(this.thisObj,this);
                    }
                }else // 请求完成
                {
                    if(this.onComplete)
                    {
                        if(this.onComplete.length==0)this.onComplete.call(this.thisObj);
                        else this.onComplete.call(this.thisObj,this,this.response);
                    }
                }
            }.bind(this), 0);
        }
    }
    private updateProgress(event):void 
    {
        if (event.lengthComputable) 
        {
            if(this.onProgress)
                this.onProgress.call(this.thisObj,event.loaded, event.total);
        }
    }
    /**
     * 发送请求.
     * @param data 需要发送的数据
     */
    public send(data?:any):any 
    {
        if (this._responseType != null)this._xhr.responseType = this._responseType;
        if (this._withCredentials != null)this._xhr.withCredentials = this._withCredentials;
        if (this.headerObj) 
        {
            for(let key in this.headerObj) 
                this._xhr.setRequestHeader(key, this.headerObj[key]);
        }
        this._xhr.send(data);
        if(!this.async)return this._xhr.responseText;
    }

    /**如果请求已经被发送,则立刻中止请求.**/
    public abort():void 
    {
        this.api = "";
        if (this._xhr)
            this._xhr.abort();
    }
    /**返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".**/
    public getAllResponseHeaders():string 
    {
        if (!this._xhr)return null;
        let result = this._xhr.getAllResponseHeaders();
        return result ? result : "";
    }
    /**给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.*/
    public setRequestHeader(header:string, value:string):void 
    {
        if(!this.headerObj)this.headerObj = {};
        this.headerObj[header] = value;
    }
    /**
     * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
     * @param header 要返回的响应头名称
     */
    public getResponseHeader(header:string):string 
    {
        if (!this._xhr) return null;
        let result = this._xhr.getResponseHeader(header);
        return result ? result : "";
    }
    public dispose():void
    {
        this.abort();
        this.async = true;
        this.headerObj = null;
        this.onProgress = null;
        this.onComplete = null;
        this.onError = null;
        this.thisObj = null;
    }
}
