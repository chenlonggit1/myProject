import { FEvent } from "./FEvent";
import { GameLayer } from "../Enums/GameLayer";

export class ModuleEvent extends FEvent 
{
    public static ClassName:string = "ModuleEvent";
	/**
     * 显示模块
     */
    public static SHOW_MODULE: string = "ShowModule";
    /**
     * 隐藏模块
     */
    public static HIDE_MODULE: string = "HideModule";
    /**
     * 销毁模块
     */
    public static DISPOSE_MODULE: string = "DisposeModule";
    /**
     * 播放完动画销毁模块
     */
    public static PLAY_DISPOSE_ANIMATION: string = "PlayDisposeAnimation";
    /**
     * 模块素材加载进度
     */
    public static LOAD_MODULE_ASSET_PROGRESS: string = "LoadModuleAssetProgress";
    /**
    * 模块素材加载完成
    */
    public static LOAD_MODULE_ASSET_COMPLETE: string = "LoadModuleAssetComplete";
    /**
     * 调用模块方法
     */
    public static EXCUTE_MODULE_FUNCTION: string = "ExcuteModuleFunction";
    /**模块被销毁时通知其他地方 */
    public static ON_DISPOSE_MODULE_OBJECT: string = "OnDisposeModuleObject";
    

    private _moduleName: string = null;
    private _gameLayer: GameLayer|cc.Node = null;
    private _instanceName: string = null;

    public constructor(type: string, moduleName: string, instanceName?: string, gameLayer?: GameLayer|cc.Node, data?: object) {
        super(type, data);
        this._moduleName = moduleName;
        this._gameLayer = gameLayer;
        this._instanceName = instanceName;
        if(this._gameLayer==null)this._gameLayer=GameLayer.UI;// 默认让模块显示在UI层
    }

    public get instanceName(): string { return this._instanceName; }
    public get moduleName(): string { return this._moduleName; }
    public get gameLayer(): GameLayer|cc.Node { return this._gameLayer; }
}
