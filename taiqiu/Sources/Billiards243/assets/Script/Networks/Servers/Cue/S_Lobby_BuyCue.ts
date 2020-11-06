import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_BuyCue } from "../../Protobuf/billiard_pb";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { getLang } from "../../../../Framework/Utility/dx/getLang";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_BuyCue extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {

        super.onDeal(client,msg);
        if(this.code == 0) {
            let data = S2C_BuyCue.decode(msg.content);
            // console.log("购买球杆",data);
            dispatchFEventWith(LobbyEvent.Server_BuyCue,data);
            showPopup(PopupType.TOAST, {msg:getLang("Text_gmcg")});
        }
        else if(this.code == 1) showPopup(PopupType.TOAST, {msg:getLang("Text_msg7")});
        else if(this.code == 2) showPopup(PopupType.TOAST, {msg:getLang("Text_qgbcz")});
        else if(this.code == 3) showPopup(PopupType.TOAST, {msg:getLang("Text_jbbz")});
        else if(this.code == 4) showPopup(PopupType.TOAST, {msg:getLang("Text_goumaits")});
        else if(this.code == 101) showPopup(PopupType.TOAST, {msg:getLang("Text_buy1")});
    } 
}
