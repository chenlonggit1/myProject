import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataKey } from "../../../GameDataKey";
import { GameDataManager } from "../../../GameDataManager";
import { PlayerVO } from "../../../VO/PlayerVO";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_NewMail } from "../../Protobuf/billiard_pb";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_NewMail extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_NewMail.decode(msg.content);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        player.newMail(data.mail);
        // console.log("新邮件",player.mailInfoList);
        // dispatchFEventWith(LobbyEvent.Server_GetMail,data.mail);
    } 
}
