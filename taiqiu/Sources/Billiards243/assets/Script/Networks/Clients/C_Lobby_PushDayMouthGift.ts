import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_Chat } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";

export class C_Lobby_PushDayMouthGift
{
    public static Send()
    {
       
        ClientManager.SendMessage(ClientNames.Lobby, {}, PacketID.PushDayMouthGift);
    }
}
