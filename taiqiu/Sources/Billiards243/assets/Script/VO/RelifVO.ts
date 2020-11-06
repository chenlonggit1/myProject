import { FObject } from "../../Framework/Core/FObject";
import { SignDayVO } from "./SignDayVO";
import { S2C_SignIfo } from "../Networks/Protobuf/billiard_pb";
/** 复活礼包数据 */
export class RelifVO extends FObject
{
    public static ClassName:string = "RelifVO";
    /** 今日剩余次数 */
    public count: number = 0;

    /** 剩余时间 */
    public liveTime: number = 0;;

    /** 是否拥有复活礼包 */
    public isActive: boolean = false;

    /** 入场场次 */
    public chanId: number = 1;

    /** 入场所需费用 */
    public chargeNumber: number = 0;

    /** 复活礼包价格 */
    public price: number = 12;

    /** 货币类型 */
    public moneyType: number = 0;

    public setData(moneyType: number, playType: number,  chargeNumber: number, chanid:number = 1) {
        this.chanId = moneyType * 1000 + playType* 10 + chanid;
        this.moneyType = moneyType;
        this.chargeNumber = chargeNumber;
    }

}
