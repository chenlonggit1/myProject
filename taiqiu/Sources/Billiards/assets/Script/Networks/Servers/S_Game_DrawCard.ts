import { GameReceiveHandler } from "../GameReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { S2C_DrawCard } from "../Protobuf/billiard_pb";
import { TableVO } from "../../VO/TableVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { SimpleCardVO } from "../../VO/SimpleCardVO";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { RoomVO } from "../../VO/RoomVO";
import { PlayerVO } from "../../VO/PlayerVO";

export class S_Game_DrawCard extends GameReceiveHandler 
{

    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_DrawCard.decode(msg.content);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let cards:SimpleCardVO[] = [];
        for (let i = 0; i < data.cards.length; i++) 
        {
            let card:SimpleCardVO = StoreManager.New(SimpleCardVO);
            card.parse(data.cards[i]);
            cards.push(card);
        }
        if(room.players.length>0)
        {
            for (let j = 0; j < room.players.length; j++) 
            {
                if(room.players[j].id==player.id)
                {
                    room.players[j].cards = cards;
                    break;
                }
            }
        }else player.cards = cards;        

        console.log("抽牌--->",cards);
        
    }
}
