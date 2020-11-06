import { FObject } from "../../Framework/Core/FObject";

export class SimplePlayerTaskVO extends FObject
{
    public static ClassName:string = "SimplePlayerTaskVO";

    //成长任务后置ID
    public afterTaskId:number = 0;
    //日活跃
    public dayActive:number = 0;
    //周活跃
    public weekActive:number = 0;
    //条件ID
    public conditionId:string = "";
    //条件ID
    public conditionIds:number[] = [];
    //当前进度
    public currentProgress:number = 0;
    //游戏类型
    public gameType:number = 0;
    //唯一ID
    public id:number = 0;
    //奖励
    public reward:string = "";
    //奖励
    public rewards:object = {};
    //条件配置ID
    public taskId:number = 0;
    //任务文案
    public taskText:string = "";
    //任务类型
    public taskType:number = 0;
    //总进度
    public totalProgress:number = 0;
    //状态 0未完成 1未领取 2已领取
    public state:number = 0;
    //客户端排序 0未领取 1未完成 2已领取
    public sortState:number = 0;
}
