
import { IJuggle } from "../Interfaces/IJuggle";
import { StoreManager } from "../Managers/StoreManager";
import { JuggleManager } from "../Managers/JuggleManager";
import { IDispose } from "../Interfaces/IDispose";
import { EventManager } from "../Managers/EventManager";

export class JFramer implements IJuggle,IDispose
{
    public static ClassName:string = "JFramer";
	private isStarting:boolean = false;
    private frameHandler:Function;
    private _frame:number = 0;
    private thisObj:any = null;
    public name:string = "";
    public start():void
    {
        if(this.isStarting)return;
        this._frame = 0;
        JuggleManager.AddJuggle(this);
        this.isStarting = true;
    }
    public stop():void
    {
        if(!this.isStarting)return;
        this._frame = 0;
        this.isStarting = false;
        JuggleManager.RemoveJuggle(this);
    }
    public onJuggle(value:number):void
    {
        this._frame++;
        if(this.frameHandler!=null)
            this.frameHandler.call(this.thisObj);
    }
    public addFramerCallback(thisObj:any,tick:Function):void
    {
        this.thisObj = thisObj;
        this.frameHandler = tick;
    }
    public dispose():void
    {
        this.stop();
        this.frameHandler = null;
        this.thisObj = null;
        EventManager.removeEvent(this);
    }
    public get frame():number{return this._frame;}
    public get running():boolean{return this.isStarting;}
    
    public toString():string{return "[Object JFramer name="+this.name+"]";}
    public static GetFramer():JFramer{return StoreManager.New(JFramer);}
}
