import { CacheManager } from "../Managers/CacheManager";
import { LoaderType } from "../Enums/LoaderType";
import { StoreManager } from "../Managers/StoreManager";
import { ILoader } from "../Interfaces/ILoader";

export class SceneLoader implements ILoader
{
    public static ClassName:string = "SceneLoader";
    public cacheAsset:boolean = true;
    private _callbacks:any[] = [];
    private _contents:any[] = [];
    private _index:number = -1;
    private _sceneNames:string[] = [];
    private countRatio:number = 0;

    public get length():number{return 1};
    public getSceneName(index:number):string{return this._sceneNames[index]}
    public getLoaderType(index:number):LoaderType{return LoaderType.SCENE;}
    public getContent(index:number):any{return this.getSceneName(index)}

    public getAssetType(index:number):any{return null}
    
    public addCallback(target:any,complete:Function,progress?:Function,error?:Function):void
    {
        this._callbacks.push({target:target,onComplete:complete,onProgress:progress,onError:error});
    }
    public load(sceneName:string,assetType?:any,loaderType?:LoaderType):void
    {
        this._sceneNames.push(sceneName);
        this.countRatio = 100/this._sceneNames.length;
        this.loadAsset();
    }
    private loadAsset():void
    {
        this._index++;
        if(this._index>=this._sceneNames.length)setTimeout(() => this.complete(), 1);
        else
        {
            let res = this.getSceneName(this._index);
            if(CacheManager.HasCache(res))this.onLoadComplete(null,CacheManager.GetCache(res));
            else
            {
                cc.director.preloadScene(res,(a,b,c)=>this.onLoadProgress(a,b,c),(e)=>this.onLoadComplete(e,res));
            }
        }
    }
    private complete():void
    {
        this.excuteCallback("onComplete");
        this.dispose();
    }
    private onLoadComplete(error: Error, resource: any):void
    {
        this._contents.push(resource);
        if(error!=null)this.onLoadError(error);
        else if(this.cacheAsset)
        {
            let res = this._sceneNames[this._index];
            if(!CacheManager.HasCache(res))
                CacheManager.Cache(res,resource);
        }
        this.loadAsset();
    }
    private onLoadProgress(completedCount: number, totalCount: number, item: any):void
    {
        let p = 100;
        if(totalCount!=0)p = Math.floor(this.countRatio*this._index+(completedCount/totalCount*this.countRatio));                
        this.excuteCallback("onProgress",p);
    }
    private onLoadError(err:any):void
    {
        err.loaderType = this.getLoaderType(0);
        this.excuteCallback("onError",err);
    }
    private excuteCallback(funName:string,arg?:any):number
    {
        let count = 0;
        for(let i = 0;i<this._callbacks.length;i++)
        {
            let fun:Function = this._callbacks[i][funName];
            if(fun!=null)
            {
                count++;
                if(fun.length==0)fun.call(this._callbacks[i]["target"]);
                else if(fun.length==1)
                {
                    if(arg!=null)fun.call(this._callbacks[i]["target"],arg);
                    else fun.call(this._callbacks[i]["target"],this);
                }else if(fun.length==2)fun.call(this._callbacks[i]["target"],arg,this);
            }
        }
        return count;
    }
    public dispose():void
    {
        this._index = -1;
        this._callbacks.length = 0;
        this._sceneNames.length = 0;
        this._contents.length = 0;
        this.cacheAsset = true;
        // 丢入缓存池
        StoreManager.Store(this);
    }
	public static Get():SceneLoader
    {
        return StoreManager.New(SceneLoader);
    }
}
