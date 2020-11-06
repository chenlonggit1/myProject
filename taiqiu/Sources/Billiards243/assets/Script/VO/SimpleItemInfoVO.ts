import { FObject } from "../../Framework/Core/FObject";

export class SimpleItemInfoVO extends FObject
{
    public static ClassName:string = "SimpleItemInfoVO";

    public id:number = 0;
    //icon
    public icon:string = "";
    //名称
    public name:string = "";
    //取双语名称
    public code:string = "";
    //描述
    public describe:string = "";
}
