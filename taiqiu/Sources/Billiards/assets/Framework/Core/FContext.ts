import { GameLayer } from '../Enums/GameLayer';
import { ApplicationEvent } from '../Events/ApplicationEvent';
import { FEvent } from '../Events/FEvent';
import { ModuleEvent } from "../Events/ModuleEvent";
import { SceneEvent } from "../Events/SceneEvent";
import { SoundEvent } from '../Events/SoundEvent';
import { UIEvent } from '../Events/UIEvent';
import { IContext } from '../Interfaces/IContext';
import { IModule } from '../Interfaces/IModule';
import { AudioManager } from '../Managers/AudioManager';
import { EventManager } from "../Managers/EventManager";
import { ModuleManager } from '../Managers/ModuleManager';
import { ResourceManager } from '../Managers/ResourceManager';
import { addEvent } from '../Utility/dx/addEvent';
import { dispatchFEvent } from '../Utility/dx/dispatchFEvent';
import { Fun } from '../Utility/dx/Fun';
import { trace } from '../Utility/dx/trace';
import { Application } from './Application';

export class FContext implements IContext
{
    
    public static ClassName:string = "FContext";
    
    public initialize(): void 
    {
        this.initDatas();
        this.addEvents();
        this.initModules();
    }
    /**初始化一些全局 数据 */
    protected initDatas(): void 
    {
    }
    /**初始化全局模块 */
    protected initModules(): void 
    {
    }
    /**监听事件 */
    protected addEvents(): void 
    {
        addEvent(this,ModuleEvent.SHOW_MODULE, this.showModule);
        addEvent(this,ModuleEvent.HIDE_MODULE, this.hideModule);
        addEvent(this,ModuleEvent.DISPOSE_MODULE, this.disposeModule);
        addEvent(this,ModuleEvent.PLAY_DISPOSE_ANIMATION, this.playDisposeModuleAnmiation);
        addEvent(this,ModuleEvent.EXCUTE_MODULE_FUNCTION, this.excuteModuleFun);
        addEvent(this,UIEvent.ADD_TO_LAYER, this.onAddToLayer);
        addEvent(this,UIEvent.DISPOSE_LAYER_ELEMENTS, this.onDisposeLayerElements);
        addEvent(this,UIEvent.HIDE_LAYER_ELEMENTS, this.onHideLayerElements);
        addEvent(this,SceneEvent.CHANGE_SCENE, this.onChangeScene);
        addEvent(this,ApplicationEvent.ON_EXIT_APPLICATION,this.onExitApplication);

        addEvent(this,SoundEvent.PLAY_EFFECT, this.playEffect);
        addEvent(this,SoundEvent.PLAY_VOICE, this.playVoice);
        addEvent(this,SoundEvent.PLAY_MUSIC, this.playMusic);
        addEvent(this,SoundEvent.PLAY_NUMBER, this.playNumVoice);

    }

    /**播放音效 */
    protected playEffect(evt:SoundEvent):void
    {
        AudioManager.PlayEffect(evt.data);
    }
    /**播放人声 */
    protected playVoice(evt:SoundEvent):void
    {
        AudioManager.PlayVoice(evt.data);
    }
     /**播报数字 */
    protected playNumVoice(evt:SoundEvent):void
    {
        AudioManager.PlayNumVoice(evt.data);
    }
    /**播放背景音乐 */
    protected playMusic(evt:SoundEvent):void
    {
        AudioManager.PlayMusic(evt.data);
    }
    
    /**显示模块 */
    protected showModule(evt: ModuleEvent): void 
    {
        let m: IModule = ModuleManager.GetModule(evt.moduleName, evt.instanceName);
        if (m == null)
        {
            trace("未找到模块====>",evt.moduleName);
            return;
        }
        m.moduleName = evt.moduleName;
        if(Application.CurrentScene==null)return;
        let p = evt.gameLayer!=null?((evt.gameLayer instanceof cc.Node)?evt.gameLayer:Application.CurrentScene.getLayer(evt.gameLayer as GameLayer)):null;
        m.startModule();
        m.show(p, evt.data);
    }
    /**隐藏模块 */
    protected hideModule(evt: ModuleEvent): void 
    {
        if (!ModuleManager.HasModule(evt.moduleName, evt.instanceName)) return;
        let m: IModule = ModuleManager.GetModule(evt.moduleName, evt.instanceName,false);
        m.hide(evt.data);
    }
    /**播放完模块的动画后销毁模块 */
    protected playDisposeModuleAnmiation(evt: ModuleEvent): void 
    {
        if (!ModuleManager.HasModule(evt.moduleName, evt.instanceName)) return;
        let m: IModule = ModuleManager.GetModule(evt.moduleName, evt.instanceName);
        m.isPlayDisposeAnimation = true;
        ModuleManager.DisposeModule(evt.moduleName, evt.instanceName);
    }
    /**直接销毁模块 */
    protected disposeModule(evt: ModuleEvent): void 
    {
        if (!ModuleManager.HasModule(evt.moduleName, evt.instanceName)) return;
        ModuleManager.DisposeModule(evt.moduleName, evt.instanceName);
    }
    /**调用模块上的方法 */
    protected excuteModuleFun(evt:ModuleEvent):void
    {
        if (!evt.data||!ModuleManager.HasModule(evt.moduleName, evt.instanceName)) return;
        let funName:string = evt.data["funName"];
        if(funName==null||funName=="")return;
        let m: IModule = ModuleManager.GetModule(evt.moduleName, evt.instanceName);
        m.excuteModuleFun(funName,[evt.data]);
    }
    /**把view添加到指定的层上面 */
    protected onAddToLayer(evt: UIEvent): void 
    {
        let view = evt.view;
        if (view == null) return;
        let layer = Application.CurrentScene.getLayer(evt.gameLayer);
        layer.addChild(view);
        if (evt.data != null) 
        {
            let n: cc.Node = view.node;
            if (n == null) n = view;
            if (evt.data["x"]) n.x = evt.data["x"];
            if (evt.data["y"]) n.y = evt.data["y"];
        }
    }
    /**销毁显示层里的所有子元素 */
    protected onDisposeLayerElements(evt: UIEvent): void { }
    /**隐藏显示层里的所有子元素 */
    protected onHideLayerElements(evt: UIEvent): void { }
    /**切换场景 */
    protected onChangeScene(evt: SceneEvent): void 
    {
        let sceneName = evt.sceneName;
        ResourceManager.LoadScene(sceneName, Fun(this.onLoadSceneComplete, this, true,[evt.data]), Fun(this.onLoadSceneProgress, this,true,[sceneName]));
    }
    protected onLoadSceneProgress(sceneName: string, progress: FEvent): void 
    {
        dispatchFEvent(new SceneEvent(SceneEvent.LOAD_PROGRESS,sceneName, progress));
    }
    protected onLoadSceneComplete(data: any, sceneName: string): void 
    {
        cc.director.loadScene(sceneName, () => Application.CurrentScene.onGetSceneData(data));
    }
    protected removeEvents():void
    {
        document.onvisibilitychange = null;
        EventManager.removeEvent(this);
    }
    protected onExitApplication(evt:ApplicationEvent)
    {
        Application.Exit();
    }

    public dispose(): void 
    {
       
    }
}
