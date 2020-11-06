import { IJuggle } from "../Interfaces/IJuggle";
import { AdvanceTick } from "./AdvanceTick";
import { JuggleManager } from "../Managers/JuggleManager";
import { StoreManager } from "../Managers/StoreManager";
import { Dictionary } from "../Structs/Dictionary";
import { FFunction } from "../Core/FFunction";
import { IDispose } from "../Interfaces/IDispose";
import { EventManager } from "../Managers/EventManager";


export class JTimer implements IJuggle,IDispose
{
    public static ClassName:string = "JTimer";
    public name:string = "";
    private juggleTick:AdvanceTick;
    private thisObj:any;
    private timeHandler:Function= null;
    private completeHandler:Function= null;
    private _repeatCount:number = -1;
    private isStarting:boolean = false;
    private lastSetRepeatCount:number = -1;
    private tickArgs:any[] = null;
    private completeArgs:any[] = null;
    private _currentCount:number = 0;

    public constructor()
    {
        this.juggleTick = new AdvanceTick();
        this.juggleTick.onTick = this.onRenderer;
        this.juggleTick.thisObj = this;
    }
    public addTimerCallback(thisObj:any,tick:Function,timeComplete?:Function,tickArgs?:any[],completeArgs?:any[]):void
    {
        this.thisObj = thisObj;
        this.timeHandler = tick;
        this.completeHandler = timeComplete;
        this.tickArgs = tickArgs;
        this.completeArgs = completeArgs;
    }
    private onRenderer():void
    {
        if(this.isStarting==false)return;
        this._currentCount++;
        if(this.repeatCount>0)
        {
            this._repeatCount--;
            this.applyTimeTick();
            if(this.repeatCount==0)
            {
                this.stop();
                this.applyTimeComplete();
            }
        }else this.applyTimeTick();
    }
    protected applyTimeComplete():void
    {
        if(this.completeHandler!=null)
        {
            if(this.completeArgs==null)
            {
                if(this.completeHandler.length==0)this.completeHandler.apply(this.thisObj);
                else this.completeHandler.apply(this.thisObj,this);
            }else this.completeHandler.apply(this.thisObj,this.completeArgs);
        }
    }
    protected applyTimeTick():void
    {
        if(this.timeHandler!=null)
        {
            if(this.tickArgs==null)
            {
                if(this.timeHandler.length==0)this.timeHandler.apply(this.thisObj);
                else this.timeHandler.apply(this.thisObj,this);
            }else this.timeHandler.apply(this.thisObj,this.tickArgs);
        }
    }
    public start():void
    {
        this.repeatCount = this.lastSetRepeatCount;
        if(this.isStarting)return;
        JuggleManager.AddJuggle(this);
        this.isStarting = true;
    }
    public stop():void
    {
        if(!this.isStarting)return;
        this.isStarting = false;
        JuggleManager.RemoveJuggle(this);
    }
    public reset():void
    {
        this.stop();
        this.juggleTick.clear();
        this.repeatCount = this.lastSetRepeatCount;
    }
    public set repeatCount(value:number)
    {
        this._repeatCount = value;
        this.lastSetRepeatCount = this._repeatCount;
    }
    public set delay(value:number)
    {
        if(value<=0)value = Number.MAX_VALUE;
        this.juggleTick.juggleInterval = value;
    }
    public get delay():number{return this.juggleTick.juggleInterval;}
    public get running():boolean{return this.isStarting;}
    public onJuggle(value:number):void{this.juggleTick.onJuggle(value);}
    public get repeatCount():number{return this._repeatCount;}
    public get currentCount():number{return this._currentCount;}
    public dispose():void
    {
        this.stop();
        this.name = "";
        this.thisObj = null;
        this.delay = Number.MAX_VALUE;
        this.repeatCount = -1;
        this.juggleTick.clear();
        this.completeHandler = null;
        this.completeArgs = null;
        this.tickArgs = null;
        this._currentCount = 0;
        this.timeHandler = null;
        this.lastSetRepeatCount = -1;
        EventManager.removeEvent(this);
    }
    /**
     * 从对象池内获取一个定时器
     */		
    public static GetTimer(delay:number,repeatCount:number=-1):JTimer
    {
        let timer:JTimer = StoreManager.New(JTimer);
        timer.delay = delay;
        timer.repeatCount = repeatCount;
        return timer;
    }

    private static times:Dictionary<any,any> = new Dictionary();
    public static TimeOut(obj:object,delay:number,fun:FFunction):JTimer
    {
        if(delay<=0)
        {
            fun&&fun.excute();
            return null;
        }else
        {
            let t = JTimer.GetTimer(delay,1);
            let arr = this.times.getValue(obj);
            if(arr==null)arr = [];
            arr.push(t);
            this.times.setValue(obj,arr);
            t.addTimerCallback(null,()=>
            {
                fun&&fun.excute();
                JTimer.ClearTimeOut(obj,t);
            });
            t.start();
            return t;
        }
    }
    public static ClearTimeOut(obj:object,time?:JTimer):void
    {
        let arr:JTimer[] = this.times.getValue(obj);
        if(arr==null)return;
        if(time!=null)
        {
            let index = arr.indexOf(time);
            if(index>-1)arr.splice(index,1);
            if(arr.length==0)this.times.remove(obj);
            time.dispose();
        }else
        {
            while(arr.length>0)
                arr.shift().dispose();
            this.times.remove(obj);
        }
    }

    public toString():String
    {
        return "[Object JTimer name="+name+" delay="+this.delay+" repeatCount="+this.lastSetRepeatCount+" tick="+this.timeHandler+" tickComplete="+this.completeHandler+"]";
    }
}
