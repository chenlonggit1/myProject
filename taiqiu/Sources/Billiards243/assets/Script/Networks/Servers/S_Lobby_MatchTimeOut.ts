import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { S2C_MatchTimeOut } from "../Protobuf/billiard_pb";
/**
 * 匹配超时
 */
export class S_Lobby_MatchTimeOut extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_MatchTimeOut.decode(msg.content);
        
        dispatchFEventWith(GameEvent.MatchPlayer_TimeOut, data);
        // console.log("匹配超时！！！！");
    }
}
