import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_Member_Level } from "../../Protobuf/billiard_pb";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";
import { MemberConfigVO } from "../../../VO/MemberConfigVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { getLang } from "../../../../Framework/Utility/dx/getLang";
/**
 * 会员领取升级奖励
 */
export class S_Lobby_MemberUpgrade extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        if(this.code == 0) {
            let data = S2C_Member_Level.decode(msg.content);
            let memberConfig:MemberConfigVO = GameDataManager.GetDictData(GameDataKey.MemberConfig,MemberConfigVO);
            memberConfig.levelGift = data.levelGift;
            // memberConfig.memberPoint = data.points;
            dispatchFEventWith(LobbyEvent.Server_GetMemberInfo);
            console.log("升级奖励",data)
            // 构建数据
            let popData: {id:number,num:number}[] = [];
            let tmp: {[id:string]: number} = {};
    
            for (let j in data.award)
                tmp[data.award[j].id] = data.award[j].num;
            for (let i in tmp)
                popData.push({id: Number(i), num: tmp[i]});
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
