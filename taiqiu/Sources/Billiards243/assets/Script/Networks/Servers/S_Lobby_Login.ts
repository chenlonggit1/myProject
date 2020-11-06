import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_Login } from "../Protobuf/billiard_pb";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { ProxyManager } from "../../../Framework/Managers/ProxyManager";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { NewPlayerVO } from "../../VO/NewPlayerVO";

export class S_Lobby_Login extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        if(this.code==0)
        {
            let data = S2C_Login.decode(msg.content);
            let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
            player.update(data);
            let newPlayer: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide, NewPlayerVO);
            newPlayer.updateData(data.nociveGuideNum);
            console.log("新手引导源数据:"+player.nickName, data.nociveGuideNum, newPlayer._curGuideeIdx);
           
            
            player.head = data.head.startsWith("http") ? data.head : null;
            GameDataManager.SetDictData(GameDataKey.Player,player);
            GameDataManager.SetShareData("token",player.token);
            dispatchFEventWith(LobbyEvent.Login_Succ);
        }else // 
        {
            ProxyManager.ProxyDispose("GameProxy");
            dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Preload);
            if(this.code==1)// 找不到此玩家
            {
                showPopup(PopupType.CONFIRM_WINDOW,{msg:getLang("Text_AbnormalAccount1")},true);
            }else if(this.code==2)// 玩家帐号被封禁
            {
                showPopup(PopupType.CONFIRM_WINDOW,{msg:getLang("Text_AbnormalAccount2")},true);
            }else if(this.code==3)// 登录失效，重新拉取微信登录
            {
                dispatchFEventWith(LobbyEvent.Login_Retry);
            }
        }
    } 
}
