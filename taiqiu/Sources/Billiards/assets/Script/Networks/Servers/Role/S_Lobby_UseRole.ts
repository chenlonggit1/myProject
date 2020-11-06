import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { GameDataManager } from "../../../GameDataManager";
import { GameDataKey } from "../../../GameDataKey";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../../GameEvent";
import { GameReceiveHandler } from "../../GameReceiveHandler";
import { S2C_UseRole } from "../../Protobuf/billiard_pb";
import { PlayerTaskVO } from "../../../VO/PlayerTaskVO";
import { showPopup } from "../../../Common/showPopup";
import { PopupType } from "../../../PopupType";
import { PlayerRoleVO } from "../../../VO/PlayerRoleVO";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { getLang } from "../../../../Framework/Utility/dx/getLang";
/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_UseRole extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_UseRole.decode(msg.content);
        // console.log(this.code,data)
        if(this.code == 0){
            let playerRole:PlayerRoleVO = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
            playerRole.updateRoleUse(data.id);
            dispatchFEventWith(LobbyEvent.Switch_Role);
            showPopup(PopupType.TOAST, {msg:getLang("Text_jsxx4")});
            // console.log("使用角色",data.id,playerRole.myPlayerRoles);
        }
        else if(this.code == 1) showPopup(PopupType.TOAST, {msg:getLang("Text_msg7")});
        else if(this.code == 2) showPopup(PopupType.TOAST, {msg:getLang("Text_norole")});
        else if(this.code == 3) showPopup(PopupType.TOAST, {msg:getLang("Text_jsxx5")});
        // dispatchFEventWith(LobbyEvent.Server_UpdateTask,data);
    } 
}
