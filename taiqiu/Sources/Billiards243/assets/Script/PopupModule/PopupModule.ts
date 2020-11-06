import { FModule } from "../../Framework/Core/FModule";
import BasePopup from "./Views/BasePopup";
import { PopupType } from "../PopupType";
import { InstanceManager } from "../../Framework/Managers/InstanceManager";
import { StoreManager } from "../../Framework/Managers/StoreManager";
import { Fun } from "../../Framework/Utility/dx/Fun";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../ModuleNames";
import { GameLayer } from "../../Framework/Enums/GameLayer";


/**
*@description:弹出框模块
**/
export class PopupModule extends FModule 
{
	public static ClassName:string = "PopupModule";
    public get assets():any[]{return ["PopupModule/PopupWindow","PopupModule/PopupConfirmWindow","PopupModule/PopupToast",
    "PopupModule/PopupGetReward","PopupModule/PopupSystemTip"]}
	private isDispose:boolean = false;
	private currentViews:BasePopup[] = [];
	public showViews():void
    {
        this.showWindow(this.moduleData);
    }
    protected createMainNode():cc.Node{return null}
    private showWindow(popupData:any):void
    {
        let type:PopupType = popupData.hasOwnProperty("type")?popupData["type"]:PopupType.WINDOW;
        let isAlone:boolean = popupData.hasOwnProperty("alone")?popupData["alone"]:false;
        let isQueue:boolean = popupData.hasOwnProperty("queue")?popupData["queue"]:false;

        let view:cc.Node = null;
        if(!isAlone)
        {
            let views = InstanceManager.GetInstance(Object,this.moduleName);
            if(views[type]&&views[type].length>0)view = views[type].shift();
        }
        if(view==null)
            view = StoreManager.NewPrefabNode(this.assets[type]);
        if(view==null)return;
        if(!isAlone)
        {
            let views = InstanceManager.GetInstance(Object,this.moduleName);
            if(!views[type])views[type] = [];
            views[type].push(view);
        }
        if(isQueue&&view.parent)// 说明需要进行队列显示
        {
            let queues = InstanceManager.GetInstance(Object,this.moduleName+"_Queues");
            if(!queues[type])queues[type] = [];
            queues[type].push(popupData);
            return;
        }
        let popup:BasePopup = view.getComponent(BasePopup);
        popup.type = type;
        popup.show(this.parent,this.moduleData);
        popup.onModuleNotify = Fun(this.onPopupViewClose,this,true,[type,isAlone]);
        if(this.currentViews.indexOf(popup)==-1)
            this.currentViews.push(popup);
        if(popup.usePopupMask)
            dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Mask,null,GameLayer.WindowMask);
    }
    private onPopupViewClose(type:PopupType,isAlone:boolean,popup:BasePopup):void
    {
        if(popup==null)return;
        if(!isAlone)
        {
            let views = InstanceManager.GetInstance(Object,this.moduleName);
            let arr:any[] = views[type];
            if(arr!=null&&arr.indexOf(popup.node)!=-1)
                arr.splice(arr.indexOf(popup.node),1);
        }
        if(this.isDispose)return;
        let index = this.currentViews.indexOf(popup);
        if(index!=0)this.currentViews.splice(index,1);
        if(popup.usePopupMask)
            dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Mask);
        StoreManager.StoreNode(popup.node);

        let queues = InstanceManager.GetInstance(Object,this.moduleName+"_Queues");
        if(queues[type]&&queues[type].length>0)
            this.showWindow(queues[type].shift());
    }

    protected hideViews()
    {
        super.hideViews();
        let views = InstanceManager.GetInstance(Object,this.moduleName);
        while(this.currentViews.length>0)
        {
            let popup = this.currentViews.shift();
            let arr:any[] = views[popup.type];
            if(arr!=null&&arr.indexOf(popup.node)!=-1)
                arr.splice(arr.indexOf(popup.node),1);
        }
    }
    public dispose():void
    {
        this.isDispose = true;
        let views = InstanceManager.GetInstance(Object,this.moduleName);
        while(this.currentViews.length>0)
        {
            let popup = this.currentViews.shift();
            let arr:any[] = views[popup.type];
            if(arr!=null&&arr.indexOf(popup.node)!=-1)
                arr.splice(arr.indexOf(popup.node),1);
        }
        super.dispose();
    }
    public get isValid():boolean{return !this.isDispose}


	
}