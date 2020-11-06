import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_Member_Award } from "../../Protobuf/billiard_pb";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";
import { MemberConfigVO } from "../../../VO/MemberConfigVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { getLang } from "../../../../Framework/Utility/dx/getLang";
/**
 * 会员领取每日奖励
 */
export class S_Lobby_MemberAward extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        if(this.code == 0) {
            let data = S2C_Member_Award.decode(msg.content);
            let memberConfig:MemberConfigVO = GameDataManager.GetDictData(GameDataKey.MemberConfig,MemberConfigVO);
            memberConfig.dayGift = data.dayGift;
            dispatchFEventWith(LobbyEvent.Server_UpdateDailyReward);
            // console.log("领取每日奖励奖励",data);
            // 构建数据
            let popData: {id:number,num:number}[] = [];
            for (let i in data.award)
            {
                popData.push({id: data.award[i].id, num: data.award[i].num});
            }
            // 显示弹出
            if (popData.length > 0)
                showPopup(PopupType.GET_REWARD, {list: popData}, false);
        }
        //1玩家不存在，2奖励已领取，3未达到会员等级
        else if(this.code == 1) showPopup(PopupType.TOAST, {msg:getLang("Text_msg7")});
        else if(this.code == 2) showPopup(PopupType.TOAST, {msg:getLang("Text_itemget")});
        else if(this.code == 3) showPopup(PopupType.TOAST, {msg:getLang("Text_msg10")});
    } 
}
