import { FFunction } from "../Core/FFunction";
import { dispatchSoundEvent } from "../Utility/dx/dispatchSoundEvent";
import { SoundEvent } from "../Events/SoundEvent";
import { dispatchFEventWith } from "../Utility/dx/dispatchFEventWith";



const { ccclass, inspector, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu('Components/基础组件/CButton')
@inspector("packages://inspector/inspectors/comps/button.js")
/**
 * 按钮组件
 * 1.增加外部
 */
export class CButton extends cc.Button 
{
    public static ClassName: string = "CButton";

    public clickAudio: string = null;
    /**点击回调 */
    public click: FFunction = null;
    /**点击按钮后派发的事件 */
    public clickEvent:string = null;
    
    _onTouchEnded(evt) 
    {
        let temp = this["_pressed"];
        super["_onTouchEnded"](evt);
        if (this["_pressed"] != temp) 
        {
            if (this.click != null) 
            {
                if (this.click.length == 0) this.click.excute();
                else this.click.excute([this]);
            }
            if(this.clickEvent!=null&& this.clickEvent != "")
                dispatchFEventWith(this.clickEvent,this);
            if (this.clickAudio != null && this.clickAudio != "")
                dispatchSoundEvent(SoundEvent.PLAY_EFFECT, this.clickAudio);
        }
        evt.stopPropagation();
    }
    onDestroy()
    {
        this.clickAudio = null;
        this.clickEvent = null;
        if(this.click)this.click = null;
    }
}