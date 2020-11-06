import { FObject } from "../../Framework/Core/FObject";

/**
 * 幸运一击 收费、免费机会数据结构
 */
export class SimpleLuckTimesVO extends FObject {
    public static ClassName: string = "SimpleLuckTimesVO";

    public freeTimes: number = 0; //免费次数
    public vipTimes: number = 0;//vip次数
    public remainTime: number = 0;//剩余时间
    public level: number = 0;//当前等级
    public vipFlag: number = 0;//当前等级已经领奖的标识，1+2+4+8 根据环按位与
    public freeFlag: number = 0;//当前等级已经领奖的标识，1+2+4+8 根据环按位与


}   
