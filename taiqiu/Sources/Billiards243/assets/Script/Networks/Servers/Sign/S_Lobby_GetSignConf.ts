import { GameReceiveHandler } from "../../GameReceiveHandler";
import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { S2C_SignIfo } from "../../Protobuf/billiard_pb";
import { SignActivityVO } from "../../../VO/SignActivityVO";
import { GameDataKey } from "../../../GameDataKey";
import { GameDataManager } from "../../../GameDataManager";
import { LobbyEvent } from "../../../Common/LobbyEvent";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { PlayerVO } from "../../../VO/PlayerVO";

/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_GetSignConf extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data:S2C_SignIfo = S2C_SignIfo.decode(msg.content);
        let SignActivity:SignActivityVO = GameDataManager.GetDictData(GameDataKey.SignActivityVo,SignActivityVO);
        SignActivity.updateData(data);
        if(SignActivity.isSignIn) {
            dispatchFEventWith(LobbyEvent.Open_LobbySign);
        }else{
            let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
            if(!player.isOpenNotice)
                dispatchFEventWith(LobbyEvent.Open_LobbyActivity);
        }
        
    } 
}
