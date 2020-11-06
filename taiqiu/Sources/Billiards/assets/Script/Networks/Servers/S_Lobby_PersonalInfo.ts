import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { C2S_BilliardInfo } from "../Protobuf/billiard_pb";
import { LobbyEvent } from "../../Common/LobbyEvent";
/**个人信息 */
export class S_Lobby_PersonalInfo extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        super.onDeal(client,msg);
        let data = C2S_BilliardInfo.decode(msg.content);
        dispatchFEventWith(LobbyEvent.Update_Personal_Info,data.billiardInfos);
    }
}
