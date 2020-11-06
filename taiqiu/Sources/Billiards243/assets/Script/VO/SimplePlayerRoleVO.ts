import { FObject } from "../../Framework/Core/FObject";

export class SimplePlayerRoleVO extends FObject
{
    public static ClassName:string = "SimplePlayerRoleVO";

    //唯一ID
    public id:number = 0;
    //角色ID
    public roleId:number = 0;
    //名称
    public name:string = "";
    //品级
    public quality:string = "";
    //等级
    public star:number = 0;
    //价格
    public price:string = "";
    //加塞
    public gase:number = 0;
    //瞄准器、
    public aim:number = 0;
    //战力
    public combat:number = 0;
    //力量
    public power:number = 0;
    //升级经验
    public roleExp:number = 0;
    //当前经验
    public exp:number = 0;
    //是否使用
    public isUse:number = 0;
}
