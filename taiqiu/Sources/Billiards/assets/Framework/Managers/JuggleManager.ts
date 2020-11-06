import { IJuggle } from "../Interfaces/IJuggle";
import { Fun } from "../Utility/dx/Fun";
import { trace } from "../Utility/dx/trace";
import { JuggleFramer } from "../Timers/JuggleFramer";
import { getTime } from "../Utility/dx/getTime";


export class JuggleManager
{
    private static juggles:Array<IJuggle> = [];
    private static isStartJuggle:boolean = false;
    private static currentJuggleTime:number = 0;
    private static lastJuggleTime:number = 0;
    private static framer:JuggleFramer = null;

    public static AddJuggle(juggle:IJuggle):void
    {
        if(this.juggles.indexOf(juggle)==-1)
        {
            this.juggles.push(juggle);
            this.startJuggle();
        }
    }
    public static RemoveJuggle(juggle:IJuggle):void
    {
        let index = this.juggles.indexOf(juggle);
        if(index==-1)return;
        this.juggles.splice(index,1);
        if(this.juggles.length==0)this.stopJuggle();
    }
    /**开启**/
    private static startJuggle():void
    {
        if(this.isStartJuggle)return;
        this.isStartJuggle = true;
        this.lastJuggleTime = getTime();
        if(this.framer == null)
        {
            this.framer = new JuggleFramer();
            this.framer.onFrame = Fun(this.onJuggle,this,false);
        }
        this.framer.start();
    }
    /**停止**/	
    private static stopJuggle():void
    {
        if(this.isStartJuggle==false)return;
        this.isStartJuggle = false;
        this.framer&&this.framer.stop();
    }
    private static onJuggle(evt?:any):void
    {
        if(this.isStartJuggle==false)return;
        var currentTime:number = getTime();
        this.currentJuggleTime = currentTime-this.lastJuggleTime;
        if(this.currentJuggleTime>1000)this.currentJuggleTime = 1000;
        this.lastJuggleTime = currentTime;
        for (let i = 0; i < this.juggles.length; i++) 
            this.juggles[i].onJuggle(this.currentJuggleTime);
    }

    public static Print()
    {
        trace("----------------- Start Juggles----------------------");
        for (let i = 0; i < this.juggles.length; i++) 
            trace(this.juggles[i]["name"],"===>",this.juggles[i]);
        trace("-----------------Total Juggles:"+this.juggles.length+"----------------------");
    }
}