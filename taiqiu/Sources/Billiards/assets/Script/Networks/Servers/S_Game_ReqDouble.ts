import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_ReqDouble } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { RoomVO } from "../../VO/RoomVO";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { C_Game_RespDouble } from "../Clients/C_Game_RespDouble";
import { getLang } from "../../../Framework/Utility/dx/getLang";
/**加倍 */
export class S_Game_ReqDouble extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_ReqDouble.decode(msg.content);
        let player:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        
        //1代表已经达到最大加倍，2代表已经拒绝加倍，金币不足，钻石不足
        if(this.code == 1) showPopup(PopupType.TOAST,{msg:getLang("Text_msg5")});
        else if(this.code == 2) showPopup(PopupType.TOAST,{msg:getLang("Text_jz1")});
        else if(this.code == 3) showPopup(PopupType.TOAST,{msg:getLang("Text_jbbz")});
        else if(this.code == 4) showPopup(PopupType.TOAST,{msg:getLang("Text_goumaits")});
        else if(this.code == 0) {
            if(player.id != data.playerID) {
                let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
                showPopup(PopupType.WINDOW,{
                    msg:getLang("Text_fanbei1",[room.doubleNum*room.roomScore]),
                    onConfirm:() => {
                        C_Game_RespDouble.Send(1);
                    },
                    onCancel:()=>{
                        C_Game_RespDouble.Send(2);
                    },
                },true);
            }
        } 
    }
}
