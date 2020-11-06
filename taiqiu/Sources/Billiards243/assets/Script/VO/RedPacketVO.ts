import { FObject } from "../../Framework/Core/FObject";
import { SimpleRedPacketVO } from "./SimpleRedPacketVO";

export class RedPacketVO extends FObject
{
    public static ClassName:string = "RedPacketVO";

    /**红包墙数据集合 */
    public redpackets: SimpleRedPacketVO[] = [];

    /**更新红包墙数据 */
    public updateRedPacket(datas: any[]): SimpleRedPacketVO[]
    {
        // 记录新增数据
        let adds: SimpleRedPacketVO[] = []
        // 更新数据
        for (let i = 0; i < datas.length; i++) 
        {
            // 只存储100条，移除最旧的数据
            if (this.redpackets.length > 100) 
                this.redpackets.shift();
            // 创建新数据
            let d = new SimpleRedPacketVO();
            d.update(datas[i]);
            // 添加新数据
            this.redpackets.push(d);
            adds.push(d);
        }
        return adds;
    }
}
