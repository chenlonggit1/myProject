import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { TableVO } from "../../VO/TableVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_BigSmall } from "../Protobuf/billiard_pb";
import { RoomVO } from "../../VO/RoomVO";
import { PlayerVO } from "../../VO/PlayerVO";
/**收到玩家自己要击打的球的列表消息 */
export class S_Game_GetMineBalls extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_BigSmall.decode(msg.content);
        
        // data.bigOrSmall==1 小球（单色球）
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let table:TableVO = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
        room.isAllotBall = true;
        let sbs = [1,2,3,4,5,6,7];
        let bbs = [9,10,11,12,13,14,15];
        let sps = this.filterBalls(sbs,table.pocketBalls);
        let bps = this.filterBalls(bbs,table.pocketBalls);
        for (let i = 0; i < room.players.length; i++) 
        {
            if(room.players[i].id!=player.id)
            {
                room.players[i].strikeBalls = data.bigOrSmall!=1?sbs:bbs;
                room.players[i].pocketBalls = data.bigOrSmall!=1?sps:bps;
            }else
            {
                room.players[i].strikeBalls = data.bigOrSmall==1?sbs:bbs;
                room.players[i].pocketBalls = data.bigOrSmall==1?sps:bps;
            }
        }
        ////////////////////////////
        dispatchFEventWith(GameEvent.Get_Play_Ball_List,data.bigOrSmall);
    }

    private filterBalls(sballs:number[],pballs:number[])
    {
        let arr:number[] = [];
        for (let i = 0; i < pballs.length; i++) 
        {
            let index = sballs.indexOf(parseInt(pballs[i]+""));
            if(index!=-1)
            {
                arr.push(pballs[i]);
                sballs.splice(index,1);
            }
        }
        return arr;
    }
}
