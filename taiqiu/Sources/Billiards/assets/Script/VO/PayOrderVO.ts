import { FObject } from "../../Framework/Core/FObject";
import { PayType } from "../LobbyScene/PayModeModule/PayDefine";

// export class GoodItem extends FObject {
//    /*** 道具ico */
//    public iconUrl: string;

//    /** 道具数量 */
//    public count: number = 0;
// }

export class PayOrderVO extends FObject
{
    public static ClassName:string = "PayOrderVO";

    /** 商品id */
    id: number = 0;
    /**支付类型 */
    payType: number = 0;
    /** 订单号 */
    outTradeNo: string = "";

    /** 支付数据体 */
    body: any = "";

    /** 支付环境 00正式 01测试 */
    mode: string = "00";

    protected analysis(data:object,...customPropertys) {
        super.analysis(data, customPropertys);
        if(this.payType == PayType.WX) {
            this.body = JSON.parse(this.body);
            // this.body.
        } else if ( this.payType == PayType.YL) {
            this.body = JSON.parse(this.body);
        }
    }


}
