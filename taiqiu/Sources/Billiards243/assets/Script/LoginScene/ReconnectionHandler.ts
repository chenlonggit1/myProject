import { FMediator } from "../../Framework/Core/FMediator";
import { StoreManager } from "../../Framework/Managers/StoreManager";
import { PlayGameID } from "../Common/PlayGameID";
import { GameCardMediator } from "../GameCardScene/GameCardMediator";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { GameMediator } from "../GameScene/GameMediator";
import { LobbyMediator } from "../LobbyScene/LobbyMediator";
import { C2S_SyncPos2 } from "../Networks/Protobuf/billiard_pb";
import { SceneNames } from "../SceneNames";
import { PlayerVO } from "../VO/PlayerVO";
import { RoomVO } from "../VO/RoomVO";
import { TableVO } from "../VO/TableVO";

export class ReconnectionHandler
{
    public static ReSetRoomData(data:C2S_SyncPos2)
    {
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room);
        if(room==null)return;
        let ballDatas = {};
        for (let i = 0; i < data.balls.length; i++) 
            ballDatas[data.balls[i].id] = data.balls[i];
        for (let j = 0; j < room.balls.length; j++) 
        {
            let bd = room.balls[j];
            let nbd = ballDatas[bd.id];
            if(nbd!=null)
            {
                let yy = nbd.position.y;
                nbd.position.y = nbd.position.z;
                nbd.position.z = yy;
                room.balls[j].position = nbd.position;
                room.balls[j].body = nbd.body;
                room.balls[j].angle = nbd.angle;
            }else 
            {
                room.balls.splice(j,1);
                j--;
            }
        }
        room.gan = data.gan;
        room.proto = null;
        this.ParseRoomData();
    }

    public static GetNextSceneData()
    {
        let isCanChangeScene = true;
        let nextSceneName = SceneNames.Lobby;
        let nextMediator:FMediator = null;
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        if(room!=null)// 断线重连进入游戏
        {
            room.isReconnection = true;
            if(room.optPlayer != player.id && room.optPlayer > 0){
                isCanChangeScene = false;
            }
            // 当前玩家已击球，并且球还没有静止
            if(room.proto!=null)
            {
                isCanChangeScene = false;
                // room.gan--;
            }else ReconnectionHandler.ParseRoomData();
            if(room.gameId==PlayGameID.Card54||room.gameId==PlayGameID.Card15)
            {
                console.log(room.gan,room.optPlayer);
                if(room.gan > 0 && room.optPlayer != player.id) isCanChangeScene = false;
                nextSceneName = SceneNames.Game_Card;
                nextMediator = new GameCardMediator();
            }else
            {
                nextSceneName = SceneNames.Game;
                nextMediator = new GameMediator();
            }
        }else nextMediator = new LobbyMediator();
        return {scene:nextSceneName,mediator:nextMediator,canChangeScene:isCanChangeScene};
    }
    public static ParseRoomData()
    {
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room);
        let table:TableVO = GameDataManager.GetDictData(GameDataKey.Table,TableVO);

        if(room==null)return;

        let pocketBalls = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];// 已进球
        for (let i = 0; i < room.balls.length; i++) 
        {
            let index = pocketBalls.indexOf(room.balls[i].id);
            if(index!=-1)pocketBalls.splice(index,1);
            // console.log("断线重连接收到的球=====>",room.balls[i].id,JSON.stringify(room.balls[i].position));
        }
        // table.pocketBalls = pocketBalls.concat();
        table.pocketBalls = room.snookerList.concat();
        if(room.snookerList.length < pocketBalls.length) {
            if(room.gameId==PlayGameID.EightBall){
                for (let i = 0; i < room.players.length; i++) 
                {
                    let p = room.players[i];
                    if(p.reConnectBalls.length > 0) {
                        for(let j = 0; j < p.reConnectBalls.length; j++){
                            if(!table.pocketBalls.includes(p.reConnectBalls[j]))
                                table.pocketBalls.push(p.reConnectBalls[j]);
                        }
                    }
                }
            }else if(room.gameId==PlayGameID.RedBall){
                for (let i = 0; i < room.players.length; i++) 
                {
                    let p = room.players[i];
                    if(p.reConnectBalls.length > 0) {
                        table.pocketBalls.push(16);
                    }
                }
            }
        }
        if(room.gameId!=PlayGameID.EightBall)room.isAllotBall = true;
        for (let i = 0; i < room.players.length; i++) 
        {
            let p = room.players[i];
            if(room.isAllotBall && room.gameId==PlayGameID.EightBall){
                for(let j = 0; j < table.pocketBalls.length; j++) {
                    let idx = p.strikeBalls.indexOf(table.pocketBalls[j]);
                    if(idx > -1){
                        p.strikeBalls.splice(idx,1);
                    }
                }
            }
        }
        for (let i = 0; i < room.players.length; i++) 
        {
            let p = room.players[i];
            if(p.strikeBalls.length > 0) return;
            if(p.balls.length!=0)
            {
                if(room.gameId==PlayGameID.EightBall)
                {
                    p.strikeBalls = p.balls.concat();
                    if(p.reConnectBalls.length > 0) {
                        for(let j = 0; j < p.reConnectBalls.length; j++){
                            let idx = p.strikeBalls.indexOf(p.reConnectBalls[j]);
                            if(idx > -1){
                                p.strikeBalls.splice(idx,1);
                            }
                        }
                    }
                    let count = 7-p.strikeBalls.length;
                    for(let i = 0; i < count; i++)
                        p.pocketBalls.push(1);
                }else if(room.gameId==PlayGameID.RedBall)
                {
                    if(p.reConnectBalls.length > 0) {
                        for(let j = 0; j < p.reConnectBalls.length; j++){
                            if(p.balls[0]!=8) {
                                p.balls.splice(0,1);
                            }
                        }
                        if(p.balls.length == 0) p.balls.push(8);
                    }
                    /// 不是击打黑8
                    if(p.balls[0]!=8)
                    {
                        for(let i = 0; i < p.balls.length; i++) {
                            p.strikeBalls.push(16);
                        }
                        let count = 7-p.strikeBalls.length;
                        for(let i = 0; i < count; i++)
                            p.pocketBalls.push(1);
                    }else{
                        p.strikeBalls.push(8);
                        p.pocketBalls = [1,1,1,1,1,1,1].concat();
                    }
                }
            }
            if(room.gameId==PlayGameID.Card15||room.gameId==PlayGameID.Card54){
                for (let m = 0; m < p.cards.length; m++) 
                {
                    if(pocketBalls.indexOf(p.cards[m].value)!=-1)
                    {
                        StoreManager.Store(p.cards[m]);
                        p.cards.splice(m,1);
                        m--;
                    }
                }
            }
            //中式八球已经分球
            if(room.divide && room.gameId==PlayGameID.EightBall && p.balls.length==0) {
                p.strikeBalls.push(8);
                p.pocketBalls = [1,1,1,1,1,1,1].concat();
            }
            if(room.gameId==PlayGameID.RedBall && p.strikeBalls.length==0) {
                for(let i = 0; i < 7; i++) {
                    p.strikeBalls.push(16);
                }
                if(p.reConnectBalls.length > 0) {
                    for(let j = 0; j < p.reConnectBalls.length; j++){
                        if(p.strikeBalls[0] == 16){
                            p.strikeBalls.splice(0,1);
                        }
                    }
                }
            }
            if(room.isAllotBall && (room.gameId==PlayGameID.EightBall || room.gameId==PlayGameID.RedBall)){
                if(p.strikeBalls.length == 0) {
                    p.strikeBalls.push(8);
                }
            }
        }
    }
}
