import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_DefendCue } from "../../Protobuf/billiard_pb";
import { PlayerCueVO } from "../../../VO/PlayerCueVO";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { getLang } from "../../../../Framework/Utility/dx/getLang";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_DefendCue extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        if(this.code == 0) {
            let data = S2C_DefendCue.decode(msg.content);
            let playerCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
            // console.log("维护球杆",data);
            playerCue.defendCues(data.playerCue);
            showPopup(PopupType.TOAST, {msg:getLang("Text_whcg")});
            let myCue = playerCue.getMyCueByCueID(data.playerCue.cueID);
            dispatchFEventWith(LobbyEvent.Server_DefendCue,myCue);
            dispatchFEventWith(LobbyEvent.Server_MyCue);
        }
        else if(this.code == 1) showPopup(PopupType.TOAST, {msg:getLang("Text_msg7")});
        else if(this.code == 2) showPopup(PopupType.TOAST, {msg:getLang("Text_qgbcz")});
        else if(this.code == 3) showPopup(PopupType.TOAST, {msg:getLang("Text_jbbz")});
        else if(this.code == 4) showPopup(PopupType.TOAST, {msg:getLang("Text_goumaits")});
        else if(this.code == 101) showPopup(PopupType.TOAST, {msg:getLang("Text_buy2")});
    } 
}
