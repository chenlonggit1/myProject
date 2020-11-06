import { GameLayer } from '../Enums/GameLayer';
import { IMediator } from '../Interfaces/IMediator';
import { EventManager } from '../Managers/EventManager';
import { stageHeight } from '../Utility/dx/stageHeight';
import { stageWidth } from '../Utility/dx/stageWidth';
import { Application } from './Application';
import { FMediator } from './FMediator';

const { ccclass, property } = cc._decorator;
@ccclass
export class FScene extends cc.Component
{
    protected static layerNames: string[] = ["Background", "Content", "UI", "PopupMask", "Popup", "WindowMask", "Window"];
    
    @property({type:cc.Node,serializable:true,displayName:"3D Root",tooltip:"3D 场景的根节点"})
    public root3D:cc.Node = null;
    
    
    @property({ serializable: true})
    private _creatLayer: boolean = false;
    @property({ serializable: true})
    public get creatLayer(): boolean { return this._creatLayer; }
    public set creatLayer(value: boolean) 
    {
        this._creatLayer = value;
        if (value) this.createLayers();
    }

    protected layers: cc.Node[] = [];
    protected mediator: IMediator = null;

    protected cameras:{[key:string]:cc.Camera} = {};

    public onLoad(): void 
    {
        Application.SetCurrentScene(this);
        this.createLayers();
        this.findCameras();
    }
    /**获取到所有场景中使用的Camera */
    protected findCameras()
    {
        let cams = cc.director.getScene().getComponentsInChildren(cc.Camera);
        for (let i = 0; i < cams.length; i++) 
        {
            if(cams[i].node.active==false)continue;
            this.cameras[cams[i].node.name] = cams[i];
            // console.log("===>",cams[i].node.name);
        }
    }
    /**获取摄像机 */
    public getCamera(cameraName:string){return this.cameras[cameraName];}
    
    public start():void
    {
        if(this.mediator!=null)
        {
            this.mediator.sceneName = cc.director.getScene().name;
            this.mediator.startMediator();
        }
    }
    protected createLayers(): void 
    {
        this.layers.length = 0;
        for (let i = 0; i < FScene.layerNames.length; i++) 
        {
            let layer = this.node.getChildByName(FScene.layerNames[i]);
            if (layer == null) 
            {
                layer = new cc.Node(FScene.layerNames[i]);
                layer.setContentSize(stageWidth(),stageHeight());
                this.node.addChild(layer);
            }
            layer.setContentSize(cc.Canvas.instance.designResolution);
            this.layers.push(layer);
        }
    }
    public getLayer(layer: GameLayer): cc.Node{return layer==-1?this.root3D:this.layers[layer];}
    public onDisable(): void 
    {
        EventManager.removeEvent(this);
        if (this.mediator != null)
            this.mediator.dispose();
        this.mediator = null;
    }
    public onDestroy() 
    {
        Application.OnCurrentSceneDestroy();
    }
    public onGetSceneData(data:any):void
    {
        if(data instanceof FMediator)
            this.mediator = data;
    }
}