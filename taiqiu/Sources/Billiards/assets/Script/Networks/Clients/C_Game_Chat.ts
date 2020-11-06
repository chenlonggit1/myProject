import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_Chat } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";

export class C_Game_Chat
{
    public static Send(emoji:string)
    {
        let req = C2S_Chat.create();
        req.emoji = emoji;
        let bytes = C2S_Chat.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.SEND_CHAT);
    }
}
