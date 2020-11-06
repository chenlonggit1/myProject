import { IBinder } from "../Interfaces/IBinder";
import { IDispose } from "../Interfaces/IDispose";
import { EventManager } from "../Managers/EventManager";
import { JTimer } from "../Timers/JTimer";

export class FBinder implements IBinder
{
    public asset:cc.Node;
    protected moduleNode:cc.Node = null;
    protected disObjects:IDispose[] = [];

    public constructor()
    {
        this.initialize();
    }

    public initialize():void
    {
        
    }
    public bindView(asset:cc.Node,...args):void
    {
        if(this.asset!=null)
        {
            this.removeEvents();
            this.clearViews();
        } 
        this.asset = asset;
        this.initViews();
        this.addEvents();
    }
    protected initViews():void
    {
    }

    protected addEvents():void
    {

    }
    protected clearViews():void
    {
    }

    protected removeEvents():void
    {
        EventManager.removeEvent(this);
    }
    public update(data:any):void
    {
    }
    public dispose():void
    {
        JTimer.ClearTimeOut(this);
        this.removeEvents();
        this.clearViews();
        this.disposeObjects();
        this.moduleNode = null;
        this.asset = null;
    }
    protected addObject(obj:IDispose):any
    {
        if(this.disObjects.indexOf(obj)==-1)
            this.disObjects.push(obj);
        return obj;
    }
    protected disposeObjects():void
    {
        while(this.disObjects.length>0)
        {
            this.disObjects.shift().dispose();
        }
    }
}
