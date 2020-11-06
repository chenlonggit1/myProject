import BasePopup from "./BasePopup";
import { JTimer } from "../../../Framework/Timers/JTimer";


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("游戏模块/弹出模块/PopupToast")
export default class PopupToast extends BasePopup 
{
    public static ClassName:string = "PopupToast";
    @property(cc.Label)
    protected msg: cc.Label = null;

    public constructor() {
        super();
        this.usePopupMask = false;
    }

    protected invalidate(): void {
        if (this.timer == null) {
            this.timer = JTimer.GetTimer(1000);
            this.timer.addTimerCallback(this, this.onTimeComplete);
        }
        var duration: number = 3000;
        if (this.data.hasOwnProperty("duration"))
            duration = this.data["duration"];
        this.timer.delay = duration;
        this.timer.repeatCount = 1;
        this.timer.start();
        this.msg.node.active = true;
        if (this.getPopupMsg()) this.msg.string = this.getPopupMsg();
        super.invalidate();
    }
    private onTimeComplete(): void 
    {
        this.node.stopAllActions();
        cc.tween(this.node).to(0.5,{opacity:0}).call(this.close.bind(this)).start();
    }
    public show(p: cc.Node, data?: object): void {
        if (this.node.parent == null)
            this.node.opacity = 0;
        super.show(p, data);
        this.node.stopAllActions();
        cc.tween(this.node).to(0.5,{opacity:255}).start();
    }
}
