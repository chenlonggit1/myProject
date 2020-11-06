import { GameReceiveHandler } from "../GameReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { S2C_ResurrectionNum } from "../Protobuf/billiard_pb";
import { RelifVO } from "../../VO/RelifVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../../Common/LobbyEvent";


export class S_Lobby_relifeNum extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_ResurrectionNum.decode(msg.content);
        let relife: RelifVO = GameDataManager.GetDictData(GameDataKey.RelifeGift, RelifVO);
        relife.count = data.num;
        dispatchFEventWith(LobbyEvent.ActivityUpdate);
        cc.log("f复活礼包数据===========>",data);
    }
}