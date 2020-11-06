
import { FObject } from "../../Framework/Core/FObject";
import { GameDataKey } from "../GameDataKey";
import { GameDataManager } from "../GameDataManager";
import { MemberConfigVO } from "./MemberConfigVO";
import { PlayerCueVO } from "./PlayerCueVO";
import { PlayerRoleVO } from "./PlayerRoleVO";
import { SimplePlayerCueVO } from "./SimplePlayerCueVO";

/**
 * 我的球杆属性
 * 力度、加塞、瞄准器、战力
 * 球杆+角色+VIP
 */
export class CuePropertyVO extends FObject 
{
    public static ClassName:string = "CuePropertyVO";
    /**力度 */
    public power:number = 0;
    /**加塞 */
    public gase:number = 0;
    /**瞄准器 */
    public aim:number = 0;
    /**战力 */
    public combat:number = 0;

    /**更新球杆属性 */
    public updateCueProperty()
    {
        //球杆
        let playerCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
        let simplePlayerCue:SimplePlayerCueVO = playerCue.getMyUseCue();
        if(!simplePlayerCue)return;
        let cueInfo = null;
        //球杆损坏
        if(simplePlayerCue.defendDay == 0 && simplePlayerCue.defendTimes == 0) {
            let myCue = playerCue.getMyCueByCueID(simplePlayerCue.cueID);
            cueInfo = {};
            let temp = myCue.damage.split(",");
            cueInfo.power = parseInt(temp[0]);
            cueInfo.gase = parseInt(temp[1]);
            cueInfo.aim = parseInt(temp[2]);
            cueInfo.combat = parseInt(temp[3]);
        }else
            cueInfo = playerCue.getCueById(simplePlayerCue.cueID);
        //VIP
		let memberConfig:MemberConfigVO = GameDataManager.GetDictData(GameDataKey.MemberConfig,MemberConfigVO);
        let memberInfo = memberConfig.getMyVipInfo();
        //角色
        let playerRole:PlayerRoleVO = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
        let roleInfo = playerRole.getMyRole();

        this.power = cueInfo.power + memberInfo.power + roleInfo.power;
        this.gase = cueInfo.gase + memberInfo.gase + roleInfo.gase;
        this.aim = cueInfo.aim + memberInfo.aim + roleInfo.aim;
        this.combat = cueInfo.combat + memberInfo.combat + roleInfo.combat;
        
    }
}
