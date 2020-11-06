import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_Chat, C2S_ResurrectionNum } from "../Protobuf/billiard_pb";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { RelifVO } from "../../VO/RelifVO";

export class C_Lobby_relifeNum
{
    public static Send()
    {
        let req = C2S_ResurrectionNum.create();
        let relife: RelifVO = GameDataManager.GetDictData(GameDataKey.RelifeGift, RelifVO);
        req.roomNum = relife.chanId; //TODO
        let bytes = C2S_ResurrectionNum.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.reLifeNum);
    }
}
