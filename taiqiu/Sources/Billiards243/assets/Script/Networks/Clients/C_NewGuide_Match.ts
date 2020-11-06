import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { ClientNames } from "../../ClientNames";
import { PacketID } from "../PacketID";
import { C2S_Chat, C2S_NoviceGuideMatch, C2S_ResurrectionNum } from "../Protobuf/billiard_pb";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { RelifVO } from "../../VO/RelifVO";
import { NewPlayerVO } from "../../VO/NewPlayerVO";

export class C_NewGuide_Match
{
    public static Send()
    {
        let req = C2S_NoviceGuideMatch.create();
        let newPlayer: NewPlayerVO = GameDataManager.GetDictData(GameDataKey.NewPlayerGuide);
        req.changId = newPlayer.changId;
        req.gameId = newPlayer.gameId;
        req.moneyId = newPlayer.moneyId;

        let bytes = C2S_NoviceGuideMatch.encode(req).finish();
        ClientManager.SendMessage(ClientNames.Lobby, bytes, PacketID.NewGuideMatch);
        cc.log("新手引导匹配====");
    }
}
