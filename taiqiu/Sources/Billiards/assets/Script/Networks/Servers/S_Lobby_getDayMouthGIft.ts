import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_BilliardInfo, S2C_MonCardGiftBag } from "../Protobuf/billiard_pb";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
/**个人信息 */
export class S_Lobby_getDayMouthGIft extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_MonCardGiftBag.decode(msg.content);
        // dispatchFEventWith(LobbyEvent.Update_Personal_Info,data.billiardInfos);
        if(data && data.awards.length) {
            showPopup(PopupType.GET_REWARD, {list: data.awards}, false);
        }
    }
}
