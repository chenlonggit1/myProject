import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { PlayGameID } from "../../Common/PlayGameID";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { RoomVO } from "../../VO/RoomVO";
import { SimplePlayerVO } from "../../VO/SimplePlayerVO";
import { TableVO } from "../../VO/TableVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_Snooker } from "../Protobuf/billiard_pb";
/**玩家发球 */
export class S_Game_PocketBall extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_Snooker.decode(msg.content);
        let table:TableVO = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        let pocketBallID = data.numbers[0];
        table.pocketNum = data.pos;
        if(pocketBallID!=0)// 进洞的不是白球
        {
            if(table.pocketBalls.indexOf(pocketBallID)!=-1)return;// 重复进球了
            table.pocketBalls.push(pocketBallID);// 桌子记录所有已进袋的球
            if(room.gameId==PlayGameID.Card54||room.gameId==PlayGameID.Card15)// 抽牌玩法
            {
                for (let k = 0; k < room.players.length; k++) 
                {
                    let p = room.players[k];
                    for (let m = 0; m < p.cards.length; m++) 
                    {
                        if(p.cards[m].value==pocketBallID)
                        {
                            p.cards.splice(m,1);
                            m--;
                        }
                    }
                }
                dispatchFEventWith(GameEvent.Server_Pocket_Ball,data);
                return;
            }
            if(room.gameId!=PlayGameID.EightBall) room.isAllotBall = true;
            if(!room.isAllotBall)
            {
                for (let i = 0; i < room.players.length; i++)
                {
                    room.players[i].reConnectBalls.push(pocketBallID);
                }
                dispatchFEventWith(GameEvent.Server_Pocket_Ball,data);
                return;// 还未分球
            }
            let isAgainst:boolean = false;
            let isOper:boolean = false;
            if(room.gameId==PlayGameID.RedBall && room.players[0].strikeBalls.length == 0) {
                isOper = true;
            }
            for (let i = 0; i < room.players.length; i++)
            {
                if(room.gameId==PlayGameID.RedBall)// 红球玩法
                {
                    if(room.players[i].id==data.playerID && isOper) {
                        room.players[i].reConnectBalls.push(pocketBallID);
                        break;
                    }
                    if(isAgainst)
                    {
                        if(room.players[i].pocketBalls.length<7)
                        {
                            this.setPlayerPocketBall(room.players[i],0,pocketBallID,table.pocketBalls);
                            break;
                        }
                    }else
                    {
                        if(room.players[i].id==data.playerID)//
                        {
                            // 玩家已经打进了7个红球，继续打红球进袋，相当于帮对手进球
                            if(pocketBallID!=8&&room.players[i].pocketBalls.length>=7)
                            {
                                isAgainst = true;
                                i = -1;
                            }else 
                            {
                                this.setPlayerPocketBall(room.players[i],0,pocketBallID,table.pocketBalls);
                                break;
                            }
                        }
                    }
                }else
                {
                    // 查找所进袋的球是属于哪个玩家的球
                    let index = room.players[i].strikeBalls.indexOf(pocketBallID);
                    if(index!=-1)
                    {
                        this.setPlayerPocketBall(room.players[i],index,pocketBallID,table.pocketBalls);
                        break;
                    }else{
                        room.players[i].reConnectBalls.push(pocketBallID);
                    }
                    console.log(index,pocketBallID,room.players[i].strikeBalls,room.players[i].reConnectBalls)
                }
            }
        }
        dispatchFEventWith(GameEvent.Server_Pocket_Ball,data);
    }

    private setPlayerPocketBall(player:SimplePlayerVO,ballIndex,ballID,pocketBalls:any)
    {
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        if(room.gameId==PlayGameID.RedBall) {
            //红球玩法在落袋球不是黑8 或者 落袋是黑8并且击打球中有黑8 更新击打球
            if(pocketBalls.indexOf(8)==-1 || (player.strikeBalls.includes(8) && pocketBalls.indexOf(8)>-1))
                player.strikeBalls.splice(ballIndex,1);
        }
        else player.strikeBalls.splice(ballIndex,1);
        player.pocketBalls.push(ballID);
        //// 如果玩家需要击打的球已经打完，并且黑8并没有进袋，则显示击打黑8
        if(player.strikeBalls.length==0&&pocketBalls.indexOf(8)==-1)
            player.strikeBalls.push(8);

        console.log("--------->",player.strikeBalls);
    }
}
