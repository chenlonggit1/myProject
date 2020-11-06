import { ClientNames } from "../../../ClientNames";
import { PacketID } from "../../PacketID";
import { ClientManager } from "../../../../Framework/Managers/ClientManager";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { S2C_PayInfo } from "../../Protobuf/billiard_pb";
import { GameDataKey } from "../../../GameDataKey";
import { GameDataManager } from "../../../GameDataManager";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { PayEvent } from "../../../Common/PayEvent";

export class S_Pay_GetPayMode extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_PayInfo.decode(msg.content);
       
        // let playerTask:PlayerTaskVO = GameDataManager.GetDictData(GameDataKey.PlayerTask,PlayerTaskVO);
        let PayModes = GameDataManager.SetDictData(GameDataKey.PayModes, data);
        cc.log("支付方式",data);

 
        dispatchFEventWith(PayEvent.Pay_GetPayModes);
    } 
}

