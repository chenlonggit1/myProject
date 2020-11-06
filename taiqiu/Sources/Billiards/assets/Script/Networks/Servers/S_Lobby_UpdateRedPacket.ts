import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_UpdateRedPacket } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { LobbyEvent } from "../../Common/LobbyEvent";
/**更新红包券 */
export class S_Lobby_UpdateRedPacket extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_UpdateRedPacket.decode(msg.content);
        // console.log(data.redPacket);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        player.redPacket = data.redPacket;
        dispatchFEventWith(LobbyEvent.Server_Lobby_UpdateRedPacket);
    }
}
