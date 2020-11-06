import { FObject } from "../../Framework/Core/FObject";
import { SimplePlayerVO } from "./SimplePlayerVO";
import { GamePlayerVO } from "./GamePlayerVO";
import { RoomMatchVO } from "./RoomMatchVO";
import { GameDataManager } from "../GameDataManager";
import { GameDataKey } from "../GameDataKey";
import { C2S_LayBall } from "../Networks/Protobuf/billiard_pb";

export class RoomVO extends FObject
{
    public static ClassName:string = "RoomVO";
    /**房间号 */
    public id:number = 0;
    /**当前击球玩家 */
    public optPlayer:number = -1;
    /**倒计时时间戳 */
    public endTime:number = 0;

    public players:SimplePlayerVO[] = [];
    /**场次id 1：初级场   2：中级场   3：高级场 */
    public changId:number = 0;
    /**玩家id  1:经典九球    2：红球玩法     3：抽牌玩法 */
    public gameId:number = 0;
    /**1:金币场    2：钻石场 */
    public moneyId:number = 0;
    /**杆数 */
    public gan:number = 0;
    /**当前倒计时 */
    public countDown:number = 0;
    /**倒计时的总值  */
    public totalTime:number = 0;
    /**玩家操作倒计时 */
    public remainTime:number = 0;
    /**是否是断线重连 */
    public isReconnection:boolean = false;
    /**服务器用于记录当前桌子上所有的球的位置信息 */
    public balls:any[] = [];
    /**当前操作轮的击球信息{playerID，angle，powerScale，velocity，force，contactPoint，gasserAngle} */
    public proto:any = null;

    /**当前场次倍数 */
    public doubleNum:number = 1;
    /**加倍人数 */
    public doublePersonNum:number = 0;
    /**当前房间底分 */
    public roomScore:number = 0;
    /**上次击球玩家，用于判断是否切换球权 */
    public lastPlayer:number = -1;
    /**连杆次数 */
    public cueNum:number = 0;
    /**重连摆球 */
    public reconnectBall:boolean = false;
    /**重连操作 */
    public reconnectOption:boolean = false;
    /**切后台次数 */
    public changeNumber:number = 0;

    /**是否已经分球 0未分球 1分球 */
    public divide:number = 0;
    /**是否已经分球 */
    public isAllotBall:boolean = false;
    /**重连首次黑八进洞 */
    public reconnectFirstPole:boolean = false;
    /**重连进洞的球 */
    public snookerList:number[] = [];
    /**重连机器人摆球 */
    public robotPutBall:boolean = false;
    /**重连机器人摆球数据 */
    public robotData:C2S_LayBall = null;

    public update(data:object):void
    {
        this.analysis(data,"players","changId");
    }

    protected customSetProperty(thisObj:object,data:object,property:string)
    {
        if(property=="players")
        {
            this.updatePlayers(data[property]);
        }else if(property=="changId")// 接收到服务器与场次相关的数据，进行切割存放
        {
            let str = data[property]+"";
            if(str.length==4)
            {
                this.moneyId = parseInt(str.charAt(0));
                this.gameId = parseInt(str.substring(1,3));
                this.changId = parseInt(str.charAt(3));
                let roomMatch: RoomMatchVO = GameDataManager.GetDictData(GameDataKey.RoomMatch,RoomMatchVO);
                [roomMatch.moneyId,roomMatch.gameId,roomMatch.changId] = [this.moneyId,this.gameId,this.changId];
            }else console.log("解析房间场次信息错误=====>",data[property]);
        }
    }
    /**
     * 当前对象不存在正在解析的属性值
     */
    protected unOwnSetProperty(thisObj:object,data:object,property:string):void
    {
        if(property=="roomNo")this.id = data[property];
        else if(property=="gamePlayers"||property=="playerList"||property=="matchPlayers")
        {
            this.updatePlayers(data[property]);
        }
    }
    protected updatePlayers(list)
    {
        while(this.players.length>list.length)
            this.players.pop();
        while(this.players.length<list.length)
            this.players.push(new GamePlayerVO());
        for (let i = 0; i < list.length; i++) 
            this.players[i].update(list[i]);
    }

    public reset()
    {
        for (let i = 0; i < this.players.length; i++) 
            this.players[i].reset();
        this.isReconnection = false;// 非断线重连
        this.balls.length = 0;
        this.proto = null; // 置空击球数据
        this.gan = 0;
        this.doubleNum = 1; //重置场次倍数
        this.doublePersonNum = 0;
        this.lastPlayer = -1;//上次击球玩家
        this.cueNum = 0;
        this.reconnectBall = false;
        this.reconnectOption = false;
        this.reconnectFirstPole = false;
        this.snookerList.length = 0;
        this.isAllotBall = false;
        this.robotPutBall = false;
        this.robotData = null;
    }

}
