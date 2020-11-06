import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { SceneEvent } from "../../../Framework/Events/SceneEvent";
import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ProxyManager } from "../../../Framework/Managers/ProxyManager";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { ClientNames } from "../../ClientNames";
import { showPopup } from "../../Common/showPopup";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { LoginMediator } from "../../LoginScene/LoginMediator";
import { ModuleNames } from "../../ModuleNames";
import { PopupType } from "../../PopupType";
import { SceneNames } from "../../SceneNames";
import { PacketID } from "../PacketID";
import { C2S_Heart } from "../Protobuf/billiard_pb";

export class C_Heartbeat
{
    public static Send(sn:number)
    {
        let req = C2S_Heart.create();
        req.sequence = sn;
        let bytes = C2S_Heart.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.Heartbeat);
        JTimer.ClearTimeOut(this);
        JTimer.TimeOut(this,3000,Fun(this.onHeartTimeOut,this));
        // console.log("向服务器发送心跳数据---->",sn);
        
    }

    public static Clear(sn:number,delaySend:boolean=true)
    {
       
        // console.log("接收到服务器心跳返回---->",sn);
        sn++;
        JTimer.ClearTimeOut(this);
        if(delaySend)JTimer.TimeOut(this,3000,Fun(()=>this.Send(sn),this));
    }

    private static onHeartTimeOut()
    {   
        JTimer.ClearTimeOut(this);
        console.log("心跳超时，返回登陆界面！！！");
        ProxyManager.ProxyDispose("GameProxy");
        dispatchFEventWith("HeartTimeOut");
        showPopup(PopupType.CONFIRM_WINDOW,{msg:getLang("Text_fwqlj"),onConfirm:()=>
        {
            GameDataManager.SetDictData(GameDataKey.Room,null);
            GameDataManager.SetDictData(GameDataKey.Table,null);
            GameDataManager.SetDictData(GameDataKey.Player,null);
            let loginMediator:LoginMediator = new LoginMediator();
            dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup);
            dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Login,loginMediator));
        }},true);
    }
}
