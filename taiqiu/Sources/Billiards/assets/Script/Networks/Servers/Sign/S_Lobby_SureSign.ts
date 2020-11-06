import { GameReceiveHandler } from "../../GameReceiveHandler";
import { IClient } from "../../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../../Framework/Interfaces/Network/IClientMessage";
import { S2C_Sign } from "../../Protobuf/billiard_pb";
import { GameDataKey } from "../../../GameDataKey";
import { GameDataManager } from "../../../GameDataManager";
import { PlayerRoleVO } from "../../../VO/PlayerRoleVO";
import { SignActivityVO } from "../../../VO/SignActivityVO";
import { dispatchFEventWith } from "../../../../Framework/Utility/dx/dispatchFEventWith";
import { LobbyEvent } from "../../../Common/LobbyEvent";

/**
 * 接收到服务器匹配结果 的消息
 */
export class S_Lobby_SureSign extends GameReceiveHandler
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = S2C_Sign.decode(msg.content);
        if(data.awards.length) {
            let SignActivity:SignActivityVO = GameDataManager.GetDictData(GameDataKey.SignActivityVo, SignActivityVO);
            let day = SignActivity.getCurSignDay();
            day.state = true;
            SignActivity.isSignIn = false;
            dispatchFEventWith(LobbyEvent.Server_Lobby_Sgin_Update, day);
        }

    } 
}
