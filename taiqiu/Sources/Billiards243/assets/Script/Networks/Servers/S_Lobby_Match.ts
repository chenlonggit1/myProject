import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { showPopup } from "../../Common/showPopup";
import { GameEvent } from "../../GameEvent";
import { PopupType } from "../../PopupType";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_Match } from "../Protobuf/billiard_pb";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_Match extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_Match.decode(msg.content);
        console.log("接收到服务器匹配结果--->",this.code,data);
        if(this.code != 0)
        {
            showPopup(PopupType.TOAST, {msg:getLang("Text_msg6")});
            // 返回大厅
            dispatchFEventWith(GameEvent.On_Match_Back);
        }
    } 
}
