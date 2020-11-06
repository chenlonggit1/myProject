import { FObject } from "../../Framework/Core/FObject";

export class SimpleActiveTaskVO extends FObject
{
    public static ClassName:string = "SimpleActiveTaskVO";

    //唯一ID
    public id:number = 0;
    //里程碑
    public milepost:number = 0;
    //奖励
    public reward:string = "";
    //icon
    public icon:number = 0;
}
