import { FObject } from "../../Framework/Core/FObject";

/**
 * 幸运一击 配置表
 */
export class SimpleLuckBallItamVO extends FObject
{
    public static ClassName:string = "SimpleLuckBallItamVO";
    // 从外到内各区域奖励（ID，数量；ID，数量|ID，数量；ID，数量）
    public award:string = "";

    //奖励区圆心位置
    public centerPosition:string = "";
    //免费区域奖励（ID，数量；ID，数量|ID，数量）
    public freeAward:string = "";

    public freeAwardList:[] = [];

    public id:number = 0;
    // 各奖励区域半径（从外到内配置）
    public radius:string = "";
    // 红球位置
    public redBall:string = "";

    public vipAwardList:[] = [];
    // 白球位置
    public whiteBall:string = "";

    
    
   
}
