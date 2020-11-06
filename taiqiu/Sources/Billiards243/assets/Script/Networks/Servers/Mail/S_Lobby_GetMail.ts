import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { C2S_GetMail } from "../../Protobuf/billiard_pb";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { PlayerVO } from "../../../VO/PlayerVO";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_GetMail extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_GetMail.decode(msg.content);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        player.updateMailInfo(data.mails);
        // console.log("邮件",player.mailInfoList);
        dispatchFEventWith(LobbyEvent.Server_GetMail,data.mails);
    } 
}
