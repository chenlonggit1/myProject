import { CacheManager } from "../Managers/CacheManager";
import { LoaderType } from "../Enums/LoaderType";
import { StoreManager } from "../Managers/StoreManager";
import { ILoader } from "../Interfaces/ILoader";
import { getFileExtension } from "../Utility/dx/getFileExtension";

export class Loader implements ILoader 
{
    public static ClassName: string = "Loader";
    public cacheAsset: boolean = true;
    protected _contents: any[] = [];
    protected _callbacks: any[] = [];
    protected _index: number = -1;
    protected _urls: string[] = [];
    protected countRatio: number = 0;
    protected _assetTypes: any[];
    protected _loaderTypes: LoaderType[];
    public get length(): number { return this._urls.length }
    public getURL(index: number): string { return this._urls[index] }
    public getAssetType(index: number): any { return this._assetTypes ? this._assetTypes[index] : null }
    public getLoaderType(index: number): LoaderType { return this._loaderTypes ? this._loaderTypes[index] : null }
    public getContent(index: number): any { return this._contents[index] }

    public addCallback(target: any, complete: Function, progress?: Function, error?: Function): void {
        this._callbacks.push({ target: target, onComplete: complete, onProgress: progress, onError: error });
    }
    public load(url: string, assetType?: any, loaderType?: LoaderType): void 
    {
        if (this._urls.length > 0) {
            this._urls.push(url);
            if (assetType != null) 
            {
                if (this._assetTypes == null)
                    this._assetTypes = [];
                this._assetTypes[this._assetTypes.length] = assetType;
            }
            if (loaderType != null) 
            {
                if (this._loaderTypes == null)
                    this._loaderTypes = [];
                this._loaderTypes[this._loaderTypes.length] = loaderType;
            }
        } else this.loads([url], assetType!=null?[assetType] : null, loaderType!=null?[loaderType] : null);
    }
    public loads(urls: string[], assetTypes?: any[], loaderTypes?: LoaderType[]): void 
    {
        this._urls = urls;
        this._assetTypes = assetTypes;
        this._loaderTypes = loaderTypes;
        this.countRatio = 100 / urls.length;
        this.loadAsset();
    }
    protected loadAsset(): void {
        this._index++;
        if (this._index >= this._urls.length) setTimeout(() => this.complete(), 1);
        else 
        {
            let res = this.getURL(this._index);
            if (CacheManager.HasCache(res)) this.onLoadComplete(null, CacheManager.GetCache(res));
            else 
            {
                let assetType = this.getAssetType(this._index);
                let loadType =  this.getLoaderType(this._index);
                if(loadType==LoaderType.IMAGE)
                {
                    cc.assetManager.loadRemote(res,{ cacheEnabled: true }, (d, e) => this.onLoadComplete(d, e));
                }
                else if(loadType==LoaderType.RAW)cc.assetManager.resources.load(cc.url.raw(res),(a, b, c) => this.onLoadProgress(a, b, c), (d, e) => this.onLoadComplete(d, e));
                else cc.assetManager.resources.load(res,assetType,(a, b, c) => this.onLoadProgress(a, b, c), (d, e) => this.onLoadComplete(d, e));

            }
        }
    }
    protected onLoadComplete(error: Error, resource: any): void 
    {
        this._contents.push(resource);
        if (error != null) this.onLoadError(error);
        else if (this.cacheAsset) 
        {
            let res = this._urls[this._index];
            if (!CacheManager.HasCache(res)) 
                CacheManager.Cache(res, resource);
        }
        this.loadAsset();
    }
    protected complete(): void 
    {
        this.excuteCallback("onComplete");
        this.dispose();
    }
    protected onLoadProgress(completedCount: number, totalCount: number, item: any): void 
    {
        let p = 100;
        if (totalCount != 0) p = Math.floor(this.countRatio * this._index + (completedCount / totalCount * this.countRatio));
        this.excuteCallback("onProgress", p);
    }
    protected onLoadError(err: any): void 
    {
        //cc.log("[加载资源出错] 第",this._index+1,"个资源==",this._urls,"===>",err.message);
        this.excuteCallback("onError", { resName: this._urls[this._index], message: err.message, index: this._index, loaderType: this.getLoaderType(this._index) });
        if (this._callbacks.length <= 1) {
            if (this._callbacks[0] == null && this._callbacks[0].onError == null) {
                cc.log("[加载资源出错] 第", this._index + 1, "个资源==", this._urls, "===>", err.message);
            }
        }
    }
    protected excuteCallback(funName: string, arg?: any): void 
    {
        for (let i = 0; i < this._callbacks.length; i++) {
            let fun: Function = this._callbacks[i][funName];
            if (fun != null) {
                if (fun.length == 0) fun.call(this._callbacks[i]["target"]);
                else if (fun.length == 1) {
                    if (arg != null) fun.call(this._callbacks[i]["target"], arg);
                    else fun.call(this._callbacks[i]["target"], this);
                } else if (fun.length == 2) fun.call(this._callbacks[i]["target"], arg, this);
            }
        }
    }
    public dispose(): void {
        this._index = -1;
        this._callbacks.length = 0;
        this._assetTypes && (this._assetTypes.length = 0);
        this._urls.length = 0;
        this._contents.length = 0;
        this.cacheAsset = true;
        // 丢入缓存池
        StoreManager.Store(this);
    }
    public static Get(): Loader {
        return StoreManager.New(Loader);
    }
}
