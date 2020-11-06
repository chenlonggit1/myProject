import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_PushAuthentication} from "../Protobuf/billiard_pb";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { RelifVO } from "../../VO/RelifVO";

/** 实名认证信息下发 吐过没有实名认证才会推送此消息 */ // 227 接口改为 推送各种礼包活动时效
export class S_Lobby_NameInfo extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_PushAuthentication.decode(msg.content);
  
        let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
        GameDataManager.SetDictData(GameDataKey.Gift_Activity, data);
        let RelifeGift: RelifVO = GameDataManager.GetDictData(GameDataKey.RelifeGift, RelifVO);
        player.isShiming = !!data.Authentication;
        RelifeGift.isActive = !!data.resurrection;
        RelifeGift.liveTime = data.resurrectionTime / 1000;
        dispatchFEventWith(LobbyEvent.ActivityUpdate);
    } 
}
