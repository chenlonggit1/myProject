import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { C2S_GetRedPacket } from "../../Protobuf/billiard_pb";
import { RedPacketVO } from "../../../VO/RedPacketVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
/**
 * 接收到服务器返回的红包墙信息
 */
export class S_Lobby_GetRedPacket extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_GetRedPacket.decode(msg.content);
        let redpacket:RedPacketVO = GameDataManager.GetDictData(GameDataKey.RedPacket,RedPacketVO);
        let adds = redpacket.updateRedPacket(data.redPackets);

        dispatchFEventWith(LobbyEvent.Server_GetRedPacket,adds);
    } 
}
