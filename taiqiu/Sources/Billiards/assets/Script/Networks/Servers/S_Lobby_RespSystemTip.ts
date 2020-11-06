import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_SystemTip } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { C_Lobby_GetSignConf } from "../Clients/Sign/C_Lobby_GetSignConf";
/**系统公告 */
export class S_Lobby_RespSystemTip extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        if(this.code == 0) {
            let data = S2C_SystemTip.decode(msg.content);
            dispatchFEventWith(LobbyEvent.Server_Lobby_UpdateRedPacket);
            let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
            let notice = data.notices[0];
		    let msgLabel = player.isChinese ? notice.cnContent : notice.wyContent;
		    let titleLabel = player.isChinese ? notice.cnTitle : notice.wyTitle;
            showPopup(PopupType.SYSTEM_TIP, {
                msg: msgLabel,
                title: titleLabel,
                onConfirm: () => {
                    C_Lobby_GetSignConf.Send(); // 获取签到配置
                }
            }, true);
        }else{
            C_Lobby_GetSignConf.Send();
        }
    }
}
