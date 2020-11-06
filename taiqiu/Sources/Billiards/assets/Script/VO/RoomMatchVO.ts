import { FObject } from "../../Framework/Core/FObject";
import { SimpleRoomVO } from "./SimpleRoomVO";

export class RoomMatchVO extends FObject
{
    public static ClassName:string = "RoomMatchVO";
    /**场次id 1：初级场   2：中级场   3：高级场 */
    public changId:number = 0;
    /**玩家id  1:经典九球    2：红球玩法     3：抽牌玩法 */
    public gameId:number = 0;
    /**1:金币场    2：钻石场 */
    public moneyId:number = 0;
    /**场次配置表 */
    public rooms:SimpleRoomVO[] = [];
    /**游戏数量 */
    public gameNums:object[] = [];

    //更新游戏数量
    public updateGameNums(data):void
    {
        this.gameNums = data;
        if(this.rooms.length > 0)
            this.setGameNums();
    }

    //更新场次配置
    public updateRooms(data):void
    {
        let index = 0;
        this.rooms = [];
        for (let key in data) {
            this.rooms.push(new SimpleRoomVO());
            this.rooms[index].update(data[key]);
            index++;
        }
        this.setGameNums();
    }

    //设置游戏次数
    public setGameNums()
    {
        for(let i = 0; i < this.rooms.length; i++) {
            let roomInfo = this.rooms[i];
            for(let j = 0; j < this.gameNums.length; j++) {
                if(roomInfo.id == this.gameNums[j]["chang"]){
                    roomInfo.gameNum = this.gameNums[j]["times"];
                    break;
                }
            }
        }
    }

    //获取底分
    public getRoomScore():number {
        for(let i = 0; i < this.rooms.length; i++) {
            let roomInfo = this.rooms[i];
            if(roomInfo.moneyType == this.moneyId && roomInfo.playType == this.gameId && roomInfo.star == this.changId)
                return roomInfo.bet;
        }
        return 0;
    }

    //获取场次信息
    public getRoomInfo():SimpleRoomVO {
        for(let i = 0; i < this.rooms.length; i++) {
            let roomInfo = this.rooms[i];
            if(roomInfo.moneyType == this.moneyId && roomInfo.playType == this.gameId && roomInfo.star == this.changId)
                return roomInfo;
        }
        return null;
    }
}
