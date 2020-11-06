import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameDataManager } from "../../../GameDataManager";
import { PlayerTaskVO } from "../../../VO/PlayerTaskVO";
import { GameDataKey } from "../../../GameDataKey";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { PayEvent } from "../../../Common/PayEvent";
import { S2C_BuyGoods, S2C_BuyGoodsEnd, S2C_AliInfo, S2C_WxOpenIdInfo, S2C_PhoneCodeSuccess } from "../../Protobuf/billiard_pb";
import { PayOrderVO } from "../../../VO/PayOrderVO";
/** 绑定手机 */
export class S_Pay_BinderPhone extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        // debugger
        if(msg.packetID == PacketID.Pay_BinderPhone) {
            return;
        }
        let data = S2C_PhoneCodeSuccess.decode(msg.content);
        console.log("=============S_Pay_BinderPhone", data.success);
        dispatchFEventWith(PayEvent.Pay_ServerBinderPhone, data);
        
    } 
}
