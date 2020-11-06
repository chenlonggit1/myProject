export class AdvanceTick
{
    public static ClassName:string = "AdvanceTick";
	/**每次执行的间隔**/
    public juggleInterval:number = 0;
    public onTick:Function;
    public thisObj:any;
    private time:number = 0;
    public onJuggle(value:number):boolean
    {
        this.time+=value;
        let v = false;
        while(this.time>=this.juggleInterval)
        {
            v = true;
            this.time-=this.juggleInterval;
            if(this.onTick!=null)this.onTick.call(this.thisObj);
        }

        
        return v;
    }
    public setFrameRate(frameRate:number):void
    {
        if(frameRate<=0)return;
        this.juggleInterval = 1000/frameRate;
    }
    /**
     * 清除time
     */		
    public clear():void
    {
        this.time = 0;
    }
    public dispose():void
    {
        this.time = 0;
        this.juggleInterval = 0;
        this.onTick = null;
        this.thisObj = null;
    }
}
