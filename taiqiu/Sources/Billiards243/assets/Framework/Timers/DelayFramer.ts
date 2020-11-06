import { FFunction } from "../Core/FFunction";
import { JFramer } from "./JFramer";
import { trace } from "../Utility/dx/trace";
import { getTime } from "../Utility/dx/getTime";


export class DelayFramer
{
    public static ClassName:string = "DelayFramer";
    private static delayFuns:Array<FFunction> = [];
    private static framer:JFramer;
    /**允许当前帧执行的最大时长，设置0为不限制 **/
    public static executeFrameDelay:number = 0;
    private static _onExecuteComplete:Function;
    private static _thisObj:any;
    /**将一个延时运行添加到堆栈中**/		
    public static Push(fun:FFunction):void
    {
        if(fun==null)return;
        if(FFunction.FindIndexOf(fun,this.delayFuns)!=-1)
        {
            fun.dispose();
            return;
        }
        this.delayFuns.push(fun);
        this.delayFuns.length>0&&this.Invalidate();
    }
    public static Remove(fun:FFunction):void
    {
        var index:number = FFunction.FindIndexOf(fun,this.delayFuns);
        if(index>-1)this.delayFuns.splice(index,1);
        fun.dispose();
    }
    private static Invalidate():void
    {
        if(!this.framer)
        {
            this.framer = JFramer.GetFramer();
            this.framer.addFramerCallback(this,this.OnInvalidate);
            this.framer.name = "DelayFramer";
        }
        if(!this.framer.running)this.framer.start();        
    }
    private static OnInvalidate():void
    {
        if(this.executeFrameDelay<=0)
        {
            this.framer&&this.framer.stop();
            while(this.delayFuns.length>0)
            {
                this.delayFuns.shift().excute();
            }
            if(this._onExecuteComplete!=null)
                this._onExecuteComplete.call(this._thisObj);
            this._onExecuteComplete = null;
        }else
        {
            var totalExecuteTime:number = 0;
            while(this.delayFuns.length>0)
            {
                var fTime:number = getTime();
                this.delayFuns.shift().excute();
                totalExecuteTime+=getTime()-fTime;
                if(totalExecuteTime>=this.executeFrameDelay)
                {
                    trace("[DelayFramer] 超时执行(ms):",totalExecuteTime,"  允许执行时长(ms):",this.executeFrameDelay,"  剩余 ",this.delayFuns.length," 个方法将延时至第",this.framer.frame+1,"帧执行.....");
                    break;// 执行时间大于设定的时间，其余的方法需要放到下一帧执行
                }
            }
            if(this.delayFuns.length==0)
            {
                this.framer&&this.framer.stop();
                if(this._onExecuteComplete!=null)
                    this._onExecuteComplete.call(this._thisObj);
                this._onExecuteComplete = null;
            }
        }
    }
}
