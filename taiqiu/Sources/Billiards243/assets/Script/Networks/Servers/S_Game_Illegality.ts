import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_Foul } from "../Protobuf/billiard_pb";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { RoomVO } from "../../VO/RoomVO";
/**轮到指定玩家操作 */
export class S_Game_Illegality extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data:any = S2C_Foul.decode(msg.content);
        data.type = data.foul;
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room, RoomVO);
        for(let i = 0; i < room.players.length; i++) {
			if(room.players[i].id == data.playerID) {
				room.players[i].foul = data.repeatFoul;
				break;
			}
        }
        //超时未操作杆数+1
        if(data.type == 4) room.gan++;
        dispatchFEventWith(GameEvent.Player_Illegality,data);
        // console.log("收到 玩家"+data.playerID+"  犯规的消息！！！",data.type);
    }
}
