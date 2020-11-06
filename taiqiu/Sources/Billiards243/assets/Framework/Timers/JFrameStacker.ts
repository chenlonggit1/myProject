import { JFramer } from "./JFramer";
import { ArrayUtility } from "../Utility/ArrayUtility";
import { StoreManager } from "../Managers/StoreManager";
import { IDispose } from "../Interfaces/IDispose";
import { EventManager } from "../Managers/EventManager";


export class JFrameStacker implements IDispose
{
    public static ClassName:string = "JFrameStacker";
	private framer:JFramer;
    private frames:any[] = [];
    private isStart:Boolean = false;
    public addFrame(frame:number,thisObj:any,fun:Function,...args):void
    {
        this.stop();
        this.frames.push({obj:thisObj,frame:frame,fun:fun,args:args});
    }
    public start():void
    {
        if(this.isStart)return;
        ArrayUtility.SortOn(this.frames,"frame");
        this.isStart = true;
        if(this.framer==null)
        {
            this.framer = JFramer.GetFramer();
            this.framer.addFramerCallback(this,this.onFrame);
            this.framer.name = "JFrameStacker";
        }
        this.framer.start();
        this.tickTriggerFrame();
    }
    private onFrame():void
    {
        this.tickTriggerFrame();
    }
    private tickTriggerFrame():void
    {
        for(let i:number = 0;i<this.frames.length;i++)
        {
            if(this.frames[i].frame==this.framer.frame)
            {
                let o:any = this.frames[i];
                this.frames.splice(i,1);
                if(o.fun)o.fun.call(o.obj,o.args);
                i--;
            }
        }
        if(this.frames.length==0)stop();
    }
    public stop():void
    {
        if(!this.isStart)return;
        this.isStart = false;
        this.framer&&this.framer.stop();
    }
    public dispose():void
    {
        this.stop();
        this.frames.length = 0;
        this.framer&&this.framer.dispose();
        this.framer = null;
        EventManager.removeEvent(this);
    }
    public static GetFramer():JFrameStacker{return StoreManager.New(JFrameStacker);}
}
