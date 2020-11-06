import { JTimer } from "../../../Framework/Timers/JTimer";
import { formatString } from "../../../Framework/Utility/dx/formatString";
import BasePopup from "./BasePopup";


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("游戏模块/弹出模块/PopupSystemTip")
export default class PopupSystemTip extends BasePopup 
{
    public static ClassName:string = "PopupSystemTip";
    @property(cc.Label)
    protected label: cc.Label = null;
    @property(cc.Label)
    protected title: cc.Label = null;
    protected invalidate(): void 
    {
        if (this.getPopupMsg() && this.label!=null) this.label.string = this.getPopupMsg();
        if (this.getPopupTitle() && this.title!=null) this.title.string = this.getPopupTitle();
        super.invalidate();
    }
    protected getPopupMsg(...args): string 
    {
        let str = super.getPopupMsg.apply(this,args);
        if (this.data.hasOwnProperty("time") && this.data["time"] > 0) 
        {
            if (!this.timer) 
            {
                this.timer = JTimer.GetTimer(1000, this.data["time"]);
                this.timer.addTimerCallback(this, this.invalidate, this.onConfirmClick);
                this.timer.start();
            }
            let tstr = (this.data["time"] - this.timer.currentCount) + "";
            return formatString(str, [tstr]);
        }
        return str;
    }
    public show(p: cc.Node, data?: object): void
    {
        if (this.node.parent == null)
            this.node.scale = 0.1;
        super.show(p, data);
        this.node.stopAllActions();
        cc.tween(this.node).to(0.2,{scale:1}).start();
    }
    protected onCloseClick():void
    {
        this.node.stopAllActions();
        cc.tween(this.node).to(0.2,{scale:0.1}).call(super.onCloseClick.bind(this)).start();
    }
    protected onCancelClick():void
    {
        this.node.stopAllActions();
        cc.tween(this.node).to(0.2,{scale:0.1}).call(super.onCancelClick.bind(this)).start();
    }
    protected onConfirmClick():void
    {
        this.node.stopAllActions();
        cc.tween(this.node).to(0.2,{scale:0.1}).call(super.onConfirmClick.bind(this)).start();
    }
}
