import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_RespDouble } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { RoomVO } from "../../VO/RoomVO";
import { PlayGameID } from "../../Common/PlayGameID";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { getLang } from "../../../Framework/Utility/dx/getLang";
/**加倍 */
export class S_Game_RespDouble extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_RespDouble.decode(msg.content);
        let room:RoomVO = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);

        room.doublePersonNum++;
        if(this.code == 1) {
            if(room.doublePersonNum == 1)
                showPopup(PopupType.TOAST,{msg:getLang("Text_jz1")});
            if(room.gameId == PlayGameID.Card15 || room.gameId == PlayGameID.Card54)
            {
                dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Mask,null,GameLayer.WindowMask);
                dispatchModuleEvent(ModuleEvent.DISPOSE_MODULE,ModuleNames.Popup);
                cc.director.getScene().getChildByName('Canvas').getChildByName("Window").destroy();
            }
        }
        else {
            //抽牌玩法需要两人同意加倍
            if(room.gameId == PlayGameID.EightBall || room.gameId == PlayGameID.RedBall)
                room.doubleNum *= 2;
            else {
                if(room.doublePersonNum == 2){
                    room.doubleNum *= 2;
                    room.doublePersonNum = 0;
                }
            }
            dispatchFEventWith(GameEvent.Update_Game_Multiple);
        }
    }
}
