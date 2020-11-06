import { FObject } from "../../Framework/Core/FObject";
import { SimpleMemberConfigVO } from "./SimpleMemberConfigVO";

export class MemberConfigVO extends FObject
{
    public static ClassName:string = "MemberConfigVO";

    /**vip配置数据集合 */
    public memberConfigs: SimpleMemberConfigVO[] = [];

    //vip点数
    public memberPoint:number = 0;

    //vip等级领取状态
    public levelGift:number = 0;

    //vip每天领取状态
    public dayGift:number = 0;


    /**更新vip配置数据 */
    public updateMemberConfigs(datas: any): void
    {
        this.memberConfigs.length = 0;
        // 更新数据
        for (let i in datas) 
        {
            // 创建新数据
            let d = new SimpleMemberConfigVO();
            d.updateData(datas[i]);
            // 添加新数据
            this.memberConfigs.push(d);
        }
    }

    //获取自己VIP等级
    public getMyVipLevel():number
    {
        let myVipLevel = 0;
        for(let i = 0; i < this.memberConfigs.length; i++) {
            if(this.memberPoint >= this.memberConfigs[i].point)
                myVipLevel = i;
            else
                break;
        }
        return myVipLevel;
    }

    //获取升级点数
    public getNextVipPoint(myLevel):number
    {
        let nextVipPoint = 0;
        if(this.memberConfigs.length == 0) return nextVipPoint;
        if(myLevel >= this.memberConfigs.length - 1) 
            nextVipPoint = this.memberConfigs[this.memberConfigs.length - 1].point;
        else
            nextVipPoint = this.memberConfigs[myLevel + 1].point;
        return nextVipPoint;
    }

    //获取自己VIP信息
    public getMyVipInfo():SimpleMemberConfigVO
    {
        for(let i = 0; i < this.memberConfigs.length; i++) {
            if(this.memberPoint >= this.memberConfigs[i].point)
                return this.memberConfigs[i];
        }
        return null;
    }
}
