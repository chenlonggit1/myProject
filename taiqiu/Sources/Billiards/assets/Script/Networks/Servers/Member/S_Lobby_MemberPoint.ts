import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_Member_Upgrade } from "../../Protobuf/billiard_pb";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";
import { MemberConfigVO } from "../../../VO/MemberConfigVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
/**
 * 会员领取升级奖励
 */
export class S_Lobby_MemberPoint extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_Member_Upgrade.decode(msg.content);
        let memberConfig:MemberConfigVO = GameDataManager.GetDictData(GameDataKey.MemberConfig,MemberConfigVO);
        memberConfig.memberPoint = data.points;
        dispatchFEventWith(LobbyEvent.Server_GetMemberInfo);
        console.log("升级点数",data)
       
    } 
}
