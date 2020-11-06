import { AudioType } from "../Enums/AudioType";
import { LoaderType } from "../Enums/LoaderType";
import { ModuleEvent } from "../Events/ModuleEvent";
import { IDispose } from "../Interfaces/IDispose";
import { IModule } from "../Interfaces/IModule";
import { Loader } from "../Loaders/Loader";
import { EventManager } from "../Managers/EventManager";
import { ResourceManager } from "../Managers/ResourceManager";
import { DelayFramer } from "../Timers/DelayFramer";
import { AssetUtility } from "../Utility/AssetUtility";
import { cancelDelayReleaseRes } from "../Utility/dx/cancelDelayReleaseRes";
import { delayReleaseRes } from "../Utility/dx/delayReleaseRes";
import { dispatchModuleEvent } from "../Utility/dx/dispatchModuleEvent";
import { Fun } from "../Utility/dx/Fun";
import { getQualifiedClassName } from "../Utility/dx/getQualifiedClassName";
import { trace } from "../Utility/dx/trace";
import { Assets } from "./Assets";
import { FBinder } from "./FBinder";


/**
 * 如果模块中需要加载Prefab，需要重写assets
 * protected get assets():string[]
 * {
 *      return [];
 * }
 */
export class FModule implements IModule {
    public moduleName: string = null;
    /**是否需要对素材进行预加载 */
    public isNeedPreload: boolean = false;
    /**是否在销毁时释放资源*/
    public isReleaseAsset: boolean = false;
    /**销毁释放资源时延时释放，部位ms */
    public delayReleaseAssetTime: number = 0;

    /**是否需要对素材进行缓存 */
    public isNeedCache: boolean = true;
    /**需要播放完动画才销毁 */
    public isPlayDisposeAnimation: boolean = false;
    /**是否需要显示加载进度条 */
    public isNeedShowLoadBar: boolean = false;
    protected node: cc.Node;
    protected parent: cc.Node;
    protected moduleData: any = null;
    protected isInitAsset: boolean = false;// 模块中的素材是否已经初始完成，包括加载完成
    protected _isInitialize: boolean = false;// 模块是否初始化
    protected isShowModule: boolean = false;// 模块是否被显示
    private delayCalls: any[] = [];
    protected disObjects: IDispose[] = [];

    protected binder: FBinder = null;

    public constructor() { this.moduleName = getQualifiedClassName(this); }
    // {type:LoaderType,asset:"url",audioType:AudioType}
    public get assets(): string[]|{type:LoaderType,asset:string,audioType?:AudioType}[] { return []; }
    public get isInitialize(): boolean { return this._isInitialize; }
    public get isValid(): boolean { return !this.isInitAsset || (this.node && this.node.isValid); }
    /**启动模块,由Mediator或者Context调用 */
    public startModule(): void {
        if (this._isInitialize) return;
        this.initialize();
    }
    protected initialize(): void {
        this._isInitialize = true;
        this.loadAssets();
    }
    protected loadAssets(): void {
        if (this.assets.length == 0) this.initViews();
        else {
            let loader: Loader = Loader.Get();
            loader.cacheAsset = this.isNeedCache;
            loader.addCallback(null, () => this.initViews(), (p) => this.onLoadAssetProgress(p));
            let assetData = Assets.GetAssets(this.assets);
            cancelDelayReleaseRes(assetData.assets);
            AssetUtility.RemoveInvalidAsset(assetData);
            loader.loads(assetData.assets, assetData.assetTypes);
        }
    }
    protected onLoadAssetProgress(p: number): void {
        if (this.isNeedPreload) return;
        if (this.isNeedShowLoadBar) {
            dispatchModuleEvent(ModuleEvent.LOAD_MODULE_ASSET_PROGRESS + this.moduleName, this.moduleName, null, null, { progress: p });
        }
    }
    protected initViews(): void {
        if (this.isInitAsset) return;    
        if (this.node == null)
            this.node = this.createMainNode();
        this.createViews();
        this.bindViews();
        if (this.isShowModule)
            this.showViews();
        DelayFramer.Push(Fun(this.excuteDelayCalls, this));
        this.addEvents();
        this.isInitAsset = true;
        dispatchModuleEvent(ModuleEvent.LOAD_MODULE_ASSET_COMPLETE + this.moduleName, this.moduleName);
    }
    /**绑定界面，默认绑定的是主界面this.node */
    protected bindViews(): void {
        if (this.binder && this.node) {
            this.binder.bindView(this.node);
            this.binder["moduleNode"] = this.node;
        }
    }
    /**创建主节点 */
    protected createMainNode(): cc.Node 
    {
        if (this.assets.length > 0) 
        {
            let a:any = this.assets[0];
            if(!(typeof a==="string"))
            {
                if(a.type!=LoaderType.PREFAB)return new cc.Node(this.moduleName);
                a = a.asset;
            }
            return this.instantiatePrefab(a);
        }
        return new cc.Node(this.moduleName);
    }
    protected createViews(): void {

    }
    protected showViews(): void {

        if (this.node != null) {
            this.node.name = this.moduleName;
            if (!this.node.parent && this.parent)
                this.parent.addChild(this.node);
            if (this.moduleData != null) {
                if (this.moduleData["x"] != undefined) this.node.x = this.moduleData["x"];
                if (this.moduleData["y"] != undefined) this.node.y = this.moduleData["y"];
            }
        }
    }
    public show(p: cc.Node, data?: object): void {
        this.isShowModule = true;
        this.moduleData = data;
        this.parent = p;
        if (this.parent != p && this.node != null)
            this.node.removeFromParent();
        if (this.isInitAsset)
            this.showViews();
    }
    public hide(data?: any): void {
        this.hideViews();
    }
    protected hideViews(): void {
        this.isShowModule = false;
        if (this.node != null&&!this.isPlayDisposeAnimation)
            this.node.removeFromParent(false);
    }
    /**添加事件 */
    protected addEvents(): void { }
    protected removeEvents(): void { EventManager.removeEvent(this); }
    protected onHideAnimationComplete(): any 
    {
        this.isPlayDisposeAnimation = false;
        this.dispose();
    }
    /**是否成功播放销毁动画 */
    protected playDisposeAnimation(): boolean 
    {
        if (this.isPlayDisposeAnimation && this.node && this.node.isValid) 
        {
            this.hide();
        }
        return false;
    }
    public dispose(): void {
        if (this.playDisposeAnimation()) return;
        this.isPlayDisposeAnimation = false;
        this.binder && this.binder.dispose();
        this.removeEvents();
        this.disposeObjects();
        if (this.node && this.node.isValid) 
        {
            this.hideViews();
            this.node.destroyAllChildren();
            this.node.destroy();
        }
        // trace(this.moduleName, "==>销毁完成！！！");
        this.releaseAssets();
        this.isShowModule = false;
        this.isInitAsset = false;
        this._isInitialize = false;
        this.delayCalls.length = 0;
        this.parent = null;
        this.moduleData = null;
        this.moduleName = null;
        this.binder = null;
        this.node = null;
    }
    protected addObject(obj: IDispose): any 
    {
        if (obj instanceof FBinder)
            obj["moduleNode"] = this.node;
        if (this.disObjects.indexOf(obj) == -1)
            this.disObjects.push(obj);
        return obj;
    }
    protected disposeObjects(): void {
        while (this.disObjects.length > 0)
            this.disObjects.shift().dispose();
    }
    /**实例化预制体 */
    protected instantiatePrefab(prefabName: string): any { return ResourceManager.InstantiatePrefab(prefabName); }
    /**调用模块的方法，如果模块没有被初始化跟素材还没初始化完成，则会延时到素材初始化完成后调用模块的方法 */
    public excuteModuleFun(funName: string, ...args): void 
    {
        if (!this.isInitAsset || this.delayCalls.length > 0) this.delayCalls.push({ funName: funName, args: args });
        else {
            let fun: Function = this[funName];
            if (fun != null) fun.apply(this, args);
        }
    }
    private excuteDelayCalls(): void {
        if (!this.isInitAsset) return;
        while (this.delayCalls.length > 0) {
            let o = this.delayCalls.shift();
            let fun: Function = this[o.funName];
            if (fun != null) fun.apply(this, o.args);
        }
    }
    /**释放加载的资源,动态加载的资源需要手动释放  */
    protected releaseAssets(): void 
    {
        this.excuteModuleFun
        if(!this.isReleaseAsset)return;
        let res = Assets.GetAssets(this.assets);
        delayReleaseRes(res.assets,this.delayReleaseAssetTime);
        // assetPath 全路径
        // ResourceManager.ReleaseAsset(assetPath);
    }
    /**立即调用模块的方法 */
    public applyModuleFun(binderName:string,funName:string,args:any[]):void
    {
        // if(binderName==null)
    }
}