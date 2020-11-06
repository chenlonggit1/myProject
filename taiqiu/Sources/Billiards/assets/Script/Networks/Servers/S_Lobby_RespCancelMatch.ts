import { ReceiveHandler } from "../../../Framework/Network/Sockets/ReceiveHandler";
import { IClient } from "../../../Framework/Interfaces/Network/IClient";
import { IClientMessage } from "../../../Framework/Interfaces/Network/IClientMessage";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { GameEvent } from "../../GameEvent";
import { GameReceiveHandler } from "../GameReceiveHandler";
import { S2C_SystemNotice } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { LobbyEvent } from "../../Common/LobbyEvent";

export class S_Lobby_RespCancelMatch extends GameReceiveHandler 
{
    public onDeal(client:IClient, msg:IClientMessage):void
    {
        dispatchFEventWith(LobbyEvent.Server_Cancel_Match);
    }
}
