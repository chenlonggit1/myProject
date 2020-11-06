import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_SyncPos2 } from "../Protobuf/billiard_pb";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { RoomVO } from "../../VO/RoomVO";

export class S_Game_OptionComplete extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_SyncPos2.decode(msg.content);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        // if(data.playerID==player.id)return;// 玩家自己不用处理
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        if(room.reconnectOption) {
            room.reconnectOption = false;
            dispatchFEventWith(GameEvent.onReconnectLoad);
        }
        dispatchFEventWith(GameEvent.OtherPlayer_PhysicSleep,data);
    }
}
