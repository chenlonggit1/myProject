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
import { S2C_BuyGoods } from "../../Protobuf/billiard_pb";
import { PayOrderVO } from "../../../VO/PayOrderVO";

export class S_Pay_OrderItem extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        // debugger;
        let data = S2C_BuyGoods.decode(msg.content);
        // let playerTask:PayOrderVO = GameDataManager.GetDictData(GameDataKey.PlayerTask, PayOrderVO);
        let order = new PayOrderVO();
        order.update(data);

        cc.log(data);
        dispatchFEventWith(PayEvent.Pay_ServerOrder ,order);
    } 
}
