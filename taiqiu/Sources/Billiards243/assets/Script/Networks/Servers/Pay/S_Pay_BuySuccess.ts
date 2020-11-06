
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { PayEvent } from "../../../Common/PayEvent";
import { S2C_BuyGoods, S2C_BuyGoodsEnd } from "../../Protobuf/billiard_pb";
import { PayOrderVO } from "../../../VO/PayOrderVO";
import { GoodsId, GoodsType } from "../../../LobbyScene/PayModeModule/PayDefine";
import { C_Lobby_PushDayMouthGift } from "../../Clients/C_Lobby_PushDayMouthGift";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";

export class S_Pay_BuySuccess extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        // debugger;
        if(this.code != 0) {
            cc.error("支付失败!!!");
        }
        let data = S2C_BuyGoodsEnd.decode(msg.content);
        cc.log("====================S_Pay_BuySuccess==============", data.id);
        dispatchFEventWith(PayEvent.Pay_ServerBuySuccess, data);
    } 
}
