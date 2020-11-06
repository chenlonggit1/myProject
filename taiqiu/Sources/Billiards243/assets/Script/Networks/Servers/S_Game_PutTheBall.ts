import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { formatDate } from "../../../Framework/Utility/dx/formatDate";
import { PlayGameID } from "../../Common/PlayGameID";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_LayBall } from "../Protobuf/billiard_pb";
/**玩家发球 */
export class S_Game_PutTheBall extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_LayBall.decode(msg.content);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        if(player.id==data.playerID)return;//玩家自己不用摆球


        console.log(data.playerID,"摆球---->",data.dropStatus,data.position);
        if(room.gameId==PlayGameID.Card54||room.gameId==PlayGameID.Card15) {
            if(data.playerID < 0 && room.isReconnection){
                room.robotPutBall = true;
                room.robotData = data;
            }
        }
        dispatchFEventWith(GameEvent.On_Player_PutTheBall,data);
    }
}
