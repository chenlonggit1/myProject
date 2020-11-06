import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { RoomVO } from "../../VO/RoomVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_MatchOK } from "../Protobuf/billiard_pb";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_MatchOK extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {

        super.onDeal(client,msg);
        let data = S2C_MatchOK.decode(msg.content);
        let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        //自己始终在0位置(右边),交换位置
        for (let i = 0; i < data.matchPlayers.length; i++) 
        {
            if(data.matchPlayers[i].id==player.id)
            {
                player = data.matchPlayers[i];
                data.matchPlayers.splice(i,1);
                data.matchPlayers.unshift(player);
                break;
            }
        }
        //头像处理一下
        for (let i = 0; i < data.matchPlayers.length; i++) 
        {
            data.matchPlayers[i].head = data.matchPlayers[i].head.startsWith("http") ? data.matchPlayers[i].head : null;
        }
        room.update(data);
        dispatchFEventWith(GameEvent.MatchPlayer_Succ);
        // console.log("接收到服务器匹配结果--->",data);
    } 
}
