import { GameDataKey } from "../../Script/GameDataKey";
import { GameDataManager } from "../../Script/GameDataManager";
import { GuideEvent } from "../../Script/GuideEvent";
import { NewPlayerGuideModule } from "../../Script/NewPlayerGuide/NewPlayerGuideModule/NewPlayerGuideModule";
import { NewPlayerVO } from "../../Script/VO/NewPlayerVO";
import { GameLayer } from "../Enums/GameLayer";
import { FEvent } from "../Events/FEvent";
import { ModuleEvent } from "../Events/ModuleEvent";
import { IDispose } from "../Interfaces/IDispose";
import { IMediator } from "../Interfaces/IMediator";
import { IModule } from "../Interfaces/IModule";
import { IProxy } from "../Interfaces/IProxy";
import { Loader } from "../Loaders/Loader";
import { EventManager } from "../Managers/EventManager";
import { ModuleManager } from "../Managers/ModuleManager";
import { AssetUtility } from "../Utility/AssetUtility";
import { addEvent } from "../Utility/dx/addEvent";
import { cancelDelayReleaseRes } from "../Utility/dx/cancelDelayReleaseRes";
import { dispatchModuleEvent } from "../Utility/dx/dispatchModuleEvent";
import { getQualifiedClassName } from "../Utility/dx/getQualifiedClassName";
import { Assets } from "./Assets";
import { FModule } from "./FModule";

/**
 * 启动Mediator需要
 * 1.先调用startMediator(); 初始化所有模块，并获取到需要预加载的素材
 * 2.调用 initialize(); 完成Mediator自身的初始化
 */
export class FMediator implements IMediator {
    /**对应的场景名称 */
    public sceneName: string = "";
    public mediatorName: string = "";
    /**是否已经初始化模块**/
    protected isInitModules: boolean = false;
    protected modules: { [key: string]: IModule } = {};
    protected moduleEvents: { [key: string]: Array<IModule> };
    protected disObjects: IDispose[] = [];
    protected proxy: IProxy = null;
    protected isStartMediator: boolean = false;

    public constructor() {
        this.mediatorName = getQualifiedClassName(this);
    }
    
    public startMediator(): void 
    {
        if (this.isStartMediator) return;
        this.isStartMediator = true;
        if (!this.isInitModules) this.initialize();
        this.showModules();
        this.addEvents();
        this.initDatas();
    }
    protected initProxy(): void {

    }
    /**预加载的素材 */
    public preloadAssets(): Loader {
        let assets = [];
        for (let key in this.modules) {
            if (this.modules[key].isNeedPreload)
                assets = assets.concat(this.modules[key].assets);
        }
        let loader: Loader = Loader.Get();
        let assetData = Assets.GetAssets(assets);
        cancelDelayReleaseRes(assetData.assets);
        AssetUtility.RemoveInvalidAsset(assetData);
        loader.loads(assetData.assets, assetData.assetTypes);
        return loader;
    }
    /**初始化Mediator，不初始化mediator无法获取所有依赖了mediator的module */
    public initialize(): void 
    {
        if (this.isInitModules) return;
        this.isInitModules = true;
        this.initModules();
        this.initProxy();
    }

    /**初始化模块 */
    protected initModules(): void 
    {
        // 新手引导
        let guide:NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide, NewPlayerVO);
        if(guide.isNeedGuide) {
            this.addModule(GuideEvent.newPlayerModule, NewPlayerGuideModule);
        }
    }
    /**初始化一些数据 */
    protected initDatas():void
    {

    }
    public addModule(moduleName: string, moduleData: typeof FModule | IModule, ...events): IModule 
    {
        if (typeof moduleData === "function") ModuleManager.AddModuleClass(moduleName, moduleData, true);
        else if (typeof moduleData === "object") ModuleManager.AddModule(moduleData, moduleName);
        let m: IModule = ModuleManager.GetModule(moduleName);
        this.modules[moduleName] = m;
        m.moduleName = moduleName;
        this.addModuleEvent(m, events);
        return m;
    }
    public addModuleEvent(m: IModule, events: string[]): void {
        if (this.moduleEvents == null) this.moduleEvents = {};
        for (let i = 0; i < events.length; i++) {
            if (this.moduleEvents[events[i]] == null)
                this.moduleEvents[events[i]] = [];
            if (this.moduleEvents[events[i]].indexOf(m) == -1)
                this.moduleEvents[events[i]].push(m);
        }
    }

    public showModules(): void {
        let guide:NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide, NewPlayerVO);
        if(guide.isNeedGuide) {
            this.showModule(GuideEvent.newPlayerModule, GameLayer.UI);
        }
    }
    protected addEvents(): void {
        addEvent(this, ModuleEvent.ON_DISPOSE_MODULE_OBJECT, this.onDisposeModuleObject);
    }
    protected showModule(moduleName: string, layer: GameLayer): void {
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE, moduleName, null, layer);
    }
    protected removeEvents(): void {
        EventManager.removeEvent(this);
    }

    protected removeModules(): void {
        for (let key in this.modules) {
            dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE, key);
            delete this.modules[key];
        }
    }
    protected excuteModuleEvent(eventName: string, funName: string, ...args): void {
        if (!this.moduleEvents) return;
        let modules = this.moduleEvents[eventName];
        if (modules != null) {
            args.unshift(funName);
            for (let i = 0; i < modules.length; i++) {
                let fun: Function = modules[i].excuteModuleFun;
                if (fun != null) fun.apply(modules[i], args);
            }
        }
    }

    private onDisposeModuleObject(evt: FEvent): void {
        let m: IModule = evt.data;
        if (m == null) return;
        if (!this.modules[m.moduleName]) return;
        for (let eventName in this.moduleEvents) {
            let index = this.moduleEvents[eventName].indexOf(m);
            if (index != -1) this.moduleEvents[eventName].splice(index, 1);
        }
        delete this.modules[m.moduleName];
    }
    public dispose(): void {
        this.moduleEvents = null;
        this.removeEvents();
        // this.releaseModuleAssets();
        this.removeModules();
        this.disposeObjects();
        this.disposeProxy();
    }
    protected disposeProxy(): void {
        if (this.proxy != null)
            this.proxy.dispose();
    }
    protected addObject(obj: IDispose): void {
        if (this.disObjects.indexOf(obj) == -1)
            this.disObjects.push(obj);
    }
    protected disposeObjects(): void {
        while (this.disObjects.length > 0) {
            this.disObjects.shift().dispose();
        }
    }
}
