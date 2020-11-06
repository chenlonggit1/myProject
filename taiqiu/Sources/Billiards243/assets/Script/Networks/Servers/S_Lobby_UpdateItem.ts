import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { S2C_updateItem } from "../Protobuf/billiard_pb";
import { LobbyEvent } from "../../Common/LobbyEvent";
/**更新道具 */
export class S_Lobby_UpdateItem extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_updateItem.decode(msg.content);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        player.updateItemList(data.item);
        dispatchFEventWith(LobbyEvent.Server_Lobby_UpdateItem);
        // console.log("更新道具",data,player.itemList);
    }
}
