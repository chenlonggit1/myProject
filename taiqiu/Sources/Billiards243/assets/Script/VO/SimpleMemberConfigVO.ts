import { FObject } from "../../Framework/Core/FObject";

export class SimpleMemberConfigVO extends FObject
{
    public static ClassName:string = "SimpleMemberConfigVO";

    /**VIP等级 */
    public vip:number = 0;
    /**升级所需经验 */
    public point:number = 0;
    /**每日礼包(id:num) */
    public dayRewards:{[id:number]:number} = {};
    /**升级礼包(id:num) */
    public upgradeRewards:{[id:number]:number} = {};
    /**描述 */
    public content: string = "";
    //瞄准
    public aim:number = 0;
    //战力
    public combat:number = 0;
    //加塞
    public gase:number = 0;
    //力度
    public power:number = 0;
    //衰减
    public decline:number = 0;

    public updateData(data:any): void
    {
        if (data.id) this.vip = data.id;
        if (data.point) this.point = data.point;
        if (data.dayRewards)
            for (let i in data.dayRewards)
                if (data.dayRewards.hasOwnProperty(i))
                    this.dayRewards[Number(i)] = data.dayRewards[i];
        if (data.upgradeRewards)
            for (let i in data.upgradeRewards)
                if (data.upgradeRewards.hasOwnProperty(i))
                    this.upgradeRewards[Number(i)] = data.upgradeRewards[i];
        if (data.content) this.content = data.content ? data.content : "";
        if (data.aim) this.aim = data.aim;
        if (data.combat) this.combat = data.combat;
        if (data.gase) this.gase = data.gase;
        if (data.power) this.power = data.power;
        if (data.decline) this.decline = data.decline;
    }
}
