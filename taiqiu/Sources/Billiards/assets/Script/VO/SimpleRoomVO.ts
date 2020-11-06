import { FObject } from "../../Framework/Core/FObject";

export class SimpleRoomVO extends FObject
{
    public static ClassName:string = "SimpleRoomVO";

    public id:number = 0;
    //玩法类型
    public playType:number = 0;
    //场次等级
    public star:number = 0;
    //货币类型
    public moneyType:number = 0;
    //台费
    public fee:number = 0;
    //初始赌注
    public bet:number = 0;
    //翻倍上线
    public doubling:number = 0;
    //准入下线
    public lowerLimit:number = 0;
    //准入上线
    public upperLimit:number = 0;
    //抽成比例
    public percentage:number = 0;
    //出杆限制
    public rod:number = 0;
    //AI开关
    public ai:number = 0;
    //游戏次数
    public gameNum:number = 0;
    //场次开关
    public openFlag:number = 0;
    //匹配时间
    public matchTime:number = 0;
}
