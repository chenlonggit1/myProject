import { FObject } from "../../Framework/Core/FObject";

export class SimpleMatchVO extends FObject
{
    public static ClassName:string = "SimpleMatchVO";

    //唯一ID
    public id:number = 0;
    //等级
    public grade:string = "";
    //类型
    public moneyType:string = "";
    //玩法
    public playType:string = "";
}
