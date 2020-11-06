import { FObject } from "../../Framework/Core/FObject";

export class SimplePlayerCueVO extends FObject
{
    public static ClassName:string = "SimplePlayerCueVO";

    public cueID:number = 0;
    public id:number = 0;
    //等级
    public grade:number = 0;
    //星级
    public star:number = 0;
    //名称
    public name:string = "";
    //价格
    public price:number = 0;
    //品质
    public quality:string ="";
    //是否使用
    public isUse:boolean = false;
    //损坏时间
    public damageTime:number = 0;
    //损坏属性
    public damage:string = "";
    //维护
    public defendTimes:number = 0;
    public defendDay:number = 0;
    //维护时间
    public defend_3_days:string = "";
    public defend_7_days:string = "";
    public defend_30_days:string = "";
    public defend_30_times:string = "";
    public defend_365_days:string = "";
    //球杆资源
    public cueRes:number = 0;

    isNeedDefend () {
        return !(this.defendDay > 0 ||  this.defendTimes > 0);
    }
}
