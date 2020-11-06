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
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_DefendInfo extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_DefendCue.decode(msg.content);
        let playerCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
        playerCue.defendCues(data.playerCue);
    } 
}
