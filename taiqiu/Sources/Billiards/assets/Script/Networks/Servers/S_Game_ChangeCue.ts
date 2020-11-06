import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_ChangeCue } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { RoomVO } from "../../VO/RoomVO";
/**
 * 游戏中切换球杆
 */
export class S_Game_ChangeCue extends GameReceiveHandler 
{

    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_ChangeCue.decode(msg.content);
        let room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        if(data.playerId != player.id){
            for (let i = 0; i < room.players.length; i++) {
                if(room.players[i].id == data.playerId) {
                    room.players[i].cueId = data.cueId;
                    break;
                }
            }
        }
    }
}
