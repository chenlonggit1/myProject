import { FObject } from "../../Framework/Core/FObject";
import { IAward } from "../Networks/Protobuf/billiard_pb";

// export class GoodItem extends FObject {
//    /*** 道具ico */
//    public iconUrl: string;

//    /** 道具数量 */
//    public count: number = 0;
// }

export class SignDayVO extends FObject
{
    public static ClassName:string = "SignDayVO";

    /** 第几天 */
    public day:number = 0;

    /** 签到状态 */
    public state: boolean = false; // true 已签到

   /*** 道具ico */
   public iconUrl: string;

   /** 道具数量 */
   public count: number = 0;
   /** 道具类型 */
   public type: number = 0;

   public awards: IAward[] = [];
}
