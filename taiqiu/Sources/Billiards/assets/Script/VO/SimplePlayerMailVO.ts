import { FObject } from "../../Framework/Core/FObject";

export class SimplePlayerMailVO extends FObject
{
    public static ClassName:string = "SimplePlayerMailVO";

    //邮件ID
    public mailId:number = 0;
    //标题
    public title:string = "";
    //内容
    public content:string = "";
    //邮件状态，0-未读，1-已读未领取,2-已读已领取
    public mailState:number = 0;
    //到期时间
    public time:number = 0;
    //是否有奖励
    public isAward:boolean = false;
}
