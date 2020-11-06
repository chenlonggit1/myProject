import { FObject } from "../../Framework/Core/FObject";
import { SignDayVO } from "./SignDayVO";
import { S2C_SignIfo } from "../Networks/Protobuf/billiard_pb";

export class GoodsItemVO extends FObject
{
    public static ClassName:string = "GoodsItemVO";
    /** 物品Id */
    public goodsId: number = 0;;
    
    /** 物品数量 */
    public count: number = 0;

    /** 价格 */
    public price: number = 0;

    /** 商品类型 */ // 货币类型：1 金币、2钻石、 3 微信红包、 4 话费、5复活新手礼包（限一次）、6月卡、7复活月卡、11支付宝红包、12京东卡'
    public goodsType: number = 0;

    /** 支付类型 */  // 1.人民币  2.红包
    public payType: number = 0;

    /** 额外添加钻石 */
    public addCount: number = 0;

    // 0 下架  1 上架
    public status: number = 0;

    // 得到道具id
    public itemId: number = 0;

    // 1.永久限购  2.每日限购  3.买赠 4.热销 5.打折
    promotionType: number = 0;

    promotionValue: number = 0;

}
