import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_Login, S2C_Authentication } from "../Protobuf/billiard_pb";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { GetErrInfo } from "../../Pay/GetErrInfo";

/** 实名认证请求回复  */
export class S_Lobby_CheckName extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data: S2C_Authentication = S2C_Authentication.decode(msg.content);
        let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
        player && (player.isShiming = !!data.success);
        dispatchFEventWith(LobbyEvent.ActivityUpdate);
        
        !this.code && showPopup(PopupType.TOAST, {msg: GetErrInfo(2005)});
    } 
}
