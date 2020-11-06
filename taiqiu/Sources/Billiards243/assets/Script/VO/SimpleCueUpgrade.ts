import { FObject } from "../../Framework/Core/FObject";

export class SimpleCueUpgrade extends FObject
{
    public static ClassName:string = "SimpleCueUpgrade";

    public cueID:number = 0;
    //唯一ID
    public id:number = 0;
    //瞄准
    public aim:number = 0;
    //战力
    public combat:number = 0;
    //加塞
    public gase:number = 0;
    //力度
    public power:number = 0;
    //星级
    public star:number = 0;
    //出售价格
    public sellPrice:string = "";
    //品级
    public quality:string ="";
    //名称
    public name:string = "";
    //升级消耗
    public upgrade:string = "";
    
}
