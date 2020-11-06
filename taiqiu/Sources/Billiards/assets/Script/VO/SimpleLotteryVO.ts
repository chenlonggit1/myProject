import { FObject } from "../../Framework/Core/FObject";

export class SimpleLotteryVO extends FObject
{
    public static ClassName:string = "SimpleLotteryVO";

    public id:number = 0;
    //等级
    public grade:number = 0;
    //名称
    public name:string = "";
    //数量
    public num:number = 0;
    //类型
    public type:number = 0;
    //权重
    public weight:number = 15;
}
