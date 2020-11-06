import { FObject } from "../../Framework/Core/FObject";
import { SignDayVO } from "./SignDayVO";
import { S2C_SignIfo } from "../Networks/Protobuf/billiard_pb";
import { GoodsItemVO } from "./GoodsItemVO";

export class OrderInfoVO extends FObject
{
    public static ClassName:string = "OrderInfoVO";
    /** 订单Id */
    public orderId: number;
    
    /** 支付类型 */
    public payMode: number;

    /** 购买物品 */
    public item: GoodsItemVO;


}
