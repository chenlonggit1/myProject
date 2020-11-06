import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_RoomInfo } from "../Protobuf/billiard_pb";
import { SimpleCardVO } from "../../VO/SimpleCardVO";
import { StoreManager } from "../../../Framework/Managers/StoreManager";

export class S_Lobby_EnterRoom extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void 
    {
        super.onDeal(client,msg);
        if(this.code == 0){
            let data = S2C_RoomInfo.decode(msg.content);//msg.content.data;
            let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
            player.pocketBalls.length = 0;
            //自己始终在0位置(右边),交换位置
            for (let i = 0; i < data.players.length; i++) 
            {
                if(data.players[i].id==player.id)
                {
                    player = data.players[i];
                    data.players.splice(i,1);
                    data.players.unshift(player);
                    break;
                }
            }
            //头像处理一下
            for (let i = 0; i < data.players.length; i++) 
            {
                data.players[i].head = data.players[i].head.startsWith("http") ? data.players[i].head : null;
            }
            let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
            room.update(data);
            if(data.divide) room.isAllotBall = true;
            for (let j = 0; j < room.players.length; j++) 
            {
                let p = room.players[j];
                for (let m = 0; m < p.cards.length; m++) 
                {
                    let card:SimpleCardVO = StoreManager.New(SimpleCardVO);
                    card.parse(p.cards[m]);
                    p.cards[m] = card;
                }
            }
        }
        
        dispatchFEventWith(GameEvent.EnterRoom_Succ);
    } 
}
