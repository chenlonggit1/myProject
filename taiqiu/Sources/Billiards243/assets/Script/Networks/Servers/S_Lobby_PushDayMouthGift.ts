import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_PushAuthentication, S2C_PushAward} from "../Protobuf/billiard_pb";
import { LobbyEvent } from "../../Common/LobbyEvent";

/** 每日月礼包下发 */ 
export class S_Lobby_PushDayMouthGift extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_PushAward.decode(msg.content);
        GameDataManager.SetDictData(GameDataKey.DayMouthGift, data);
        // dispatchFEventWith(LobbyEvent.ActivityUpdate, data);
        if(this.code == 0 && data.awards.length)
            dispatchFEventWith(LobbyEvent.Open_dayMouthGift);
    } 
}
