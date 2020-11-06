
import { JTimer } from "../../../Framework/Timers/JTimer";
import { FFunction } from "../../../Framework/Core/FFunction";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { PopupType } from "../../PopupType";
import { EventManager } from "../../../Framework/Managers/EventManager";



const {ccclass,menu} = cc._decorator;
@ccclass
@menu("游戏模块/弹出模块/BasePopup")
export default class BasePopup extends cc.Component
{
    public static ClassName:string = "BasePopup";
    protected onClose:Function;
    protected onCancel:Function;
    protected onConfirm:Function;
    protected target:any;
    protected timer: JTimer;
    public type:PopupType = PopupType.WINDOW;
    public onModuleNotify:FFunction;
	/**使用弹出遮罩**/
    public usePopupMask:boolean = true;

    
    private _data:any = null;
    

    public get data():any{return this._data;}
    public set data(value:any)
    {
        this._data = value;
        this.setPopupPos();
        this.invalidate();
    }
    public show(p: cc.Node, data?: object): void 
    {
        if (p != null && this.node != null)
        {
            if(p!=this.node.parent)
            {
                this.node.removeFromParent();
                p.addChild(this.node);
            }
        }
        if(data!=null)this.data = data;
    }
    public close():void
    {
        if (this.node)this.node.removeFromParent();
        if(this.onClose!=null)
        {
            if(this.onClose.length==0)this.onClose.call(this.target);
            else this.onClose.call(this.target,this);
        }
        if(this.onModuleNotify!=null)
        {
            if(this.onModuleNotify.length==0)this.onModuleNotify.excute();
            else this.onModuleNotify.excute([this]);
        }
        this.onClose = null;
        this.onCancel = null;
        this.onConfirm = null;
    }
    protected onCloseClick():void
    {
        this.close();
    }
    protected onCancelClick():void
    {
        if( this.onCancel!=null)
        {
            if(this.onCancel.length==0) this.onCancel.call(this.target);
            else  this.onCancel.call(this.target,this);
        }
        this.close();
    }
    protected onConfirmClick():void
    {
        if(this.onConfirm!=null)
        {
            if(this.onConfirm.length==0)this.onConfirm.call(this.target);
            else this.onConfirm.call(this.target,this);
        }
        this.close();
    }
    protected invalidate():void
    {
        if(this.data.hasOwnProperty("target"))
            this.target = this.data["target"];
        if(this.data.hasOwnProperty("onConfirm"))
            this.onConfirm = this.data["onConfirm"];
        if(this.data.hasOwnProperty("onCancel"))
            this.onCancel = this.data["onCancel"];
        if(this.data.hasOwnProperty("onClose"))
            this.onClose = this.data["onClose"];
    }
    protected setPopupPos():void
    {
        if(!this.data)return;
        let pos = cc.v2();
        
        if(this.data.hasOwnProperty("pos"))
        {
            pos.x = this.data["pos"].x;
            pos.y = this.data["pos"].y;
        }
        this.node.x = pos.x;
        this.node.y = pos.y;
    }
    protected getPopupMsg(...args): string 
    {
        let str = "";
        if (this.data.hasOwnProperty("msg")) str = this.data["msg"];
        else if (this.data.hasOwnProperty("label")) str = this.data["label"];
        else if (this.data.hasOwnProperty("lang")) 
        {
            var args: any[] = this.data["args"];
            if (args == null) args = [];
            args.unshift(this.data["lang"]);
            str = getLang.apply(null, args);
        }
        return str;
    }
    protected getPopupTitle(...args): string
    {
        let str = "";
        if (this.data.hasOwnProperty("title")) str = this.data["title"];
        return str;
    }
    public onDisable():void
    {
        EventManager.removeEvent(this);
        this.timer&&this.timer.dispose();
        this.timer = null;
    }
}
