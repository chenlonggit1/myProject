import { PopupType } from "../PopupType";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../ModuleNames";
import { GameLayer } from "../../Framework/Enums/GameLayer";

export function showPopup(popupType:PopupType,data,isNeedMask:boolean=false)
{

    if(!data.type)data.type = popupType;
    let layer = GameLayer.Popup;
    if(popupType!=PopupType.TOAST)layer = GameLayer.Window;
    dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Popup,null,layer,data);
    if(isNeedMask)
    {
        let layer = GameLayer.PopupMask;
        if(popupType!=PopupType.TOAST)layer = GameLayer.WindowMask;
        dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Mask,null,layer);
    }
}