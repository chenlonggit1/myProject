import { FObject } from "../../Framework/Core/FObject";

export class SimpleRedPacketVO extends FObject
{
    public static ClassName:string = "SimpleRedPacketVO";

    /**玩家id */
    public id: number = 0;
    /**玩家昵称 */
    public nick: string = "";
    /**vip等级 */
    public vip: number = 0;
    /**红包数量 */
    public num: number = 0;
    /**时间戳 */
    public time: number = 0;
}
