import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { PlayerVO } from "../../VO/PlayerVO";
import { C_Lobby_DefendCue } from "../../Networks/Clients/Cue/C_Lobby_DefendCue";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { formatDate } from "../../../Framework/Utility/dx/formatDate";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { getLang } from "../../../Framework/Utility/dx/getLang";

export class LobbyCueMaintainBinder extends FBinder 
{
    public static ClassName:string = "LobbyCueMaintainBinder";

    private player:PlayerVO = null;
    private playerCue:PlayerCueVO = null;
    private btnMaintainList:cc.Node[] = [];
    private img_money:cc.Sprite[] = [];
    private lb_money0:cc.Label[] = [];
    private lb_money1:cc.Label[] = [];
    private maintainId:number = 0;
    private removeIndex:number = 0;

    private right_dynamics:cc.Label = null;
    private right_addSai:cc.Label = null;
    private right_gunsight:cc.Label = null;
    private right_zhanli:cc.Label = null;
    private left_dynamics:cc.Label = null;
    private left_addSai:cc.Label = null;
    private left_gunsight:cc.Label = null;
    private left_zhanli:cc.Label = null;
    private lbDefend:cc.Label = null;

    public initViews()
    {
        super.initViews();
        super.addEvents();

        let btnBack = getNodeChildByName(this.asset,"btn_back");
		btnBack.on(cc.Node.EventType.TOUCH_END, () => {
			this.asset.active = false;
		}, this);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        this.playerCue = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
        let btnMaintain = getNodeChildByName(this.asset, "btnMaintain");
        for(let i = 0; i < 4; i++) {
            this.btnMaintainList[i] = getNodeChildByName(btnMaintain,"btnMaintain"+(i+1));
            this.img_money[i] = getNodeChildByName(this.btnMaintainList[i],"layout/img_money", cc.Sprite);
            this.lb_money0[i] = getNodeChildByName(this.btnMaintainList[i],"layout/lb_money0", cc.Label);
            this.lb_money1[i] = getNodeChildByName(this.btnMaintainList[i],"layout/lb_money1", cc.Label);
            this.btnMaintainList[i].on(cc.Node.EventType.TOUCH_END, () => {
                this.sendDefendCue(i);
            }, this);
        }
        let labelCue = getNodeChildByName(this.asset,"label_cue");
        this.right_dynamics = getNodeChildByName(labelCue,"right_dynamics",cc.Label);
        this.right_addSai = getNodeChildByName(labelCue,"right_addSai",cc.Label);
        this.right_gunsight = getNodeChildByName(labelCue,"right_gunsight",cc.Label);
        this.right_zhanli = getNodeChildByName(labelCue,"right_zhanli",cc.Label);
        this.left_dynamics = getNodeChildByName(labelCue,"left_dynamics",cc.Label);
        this.left_addSai = getNodeChildByName(labelCue,"left_addSai",cc.Label);
        this.left_gunsight = getNodeChildByName(labelCue,"left_gunsight",cc.Label);
        this.left_zhanli = getNodeChildByName(labelCue,"left_zhanli",cc.Label);
        this.lbDefend = getNodeChildByName(labelCue, "lbDefend",cc.Label);
    }

    protected addEvents() {
        addEvent(this,LobbyEvent.Server_DefendCue,this.onDefendCue);
    }

    onDefendCue(data)
    {
        this.updateDefend(data.data);
    }

    //更新球杆维护信息
    //1、维护30次，2、维护3天，3、维护7天，4、维护30天，5、维护365天
    updateCueMaintainInfo(cueId:number)
    {
        let cueInfo = this.playerCue.getMyCueByCueID(cueId);
        // console.log(cueInfo);
        this.updateCueLabelInfo(cueId);
        this.maintainId = cueInfo.id;
        let maintainText = [];
        maintainText.push(`30${getLang("Text_count")}`);
        maintainText.push(`3${getLang("Text_day")}`);
        maintainText.push(`7${getLang("Text_day")}`);
        maintainText.push(`30${getLang("Text_day")}`);
        maintainText.push(`365${getLang("Text_day")}`);
        let price = [];
        price.push(cueInfo.defend_30_times);
        price.push(cueInfo.defend_3_days);
        price.push(cueInfo.defend_7_days);
        price.push(cueInfo.defend_30_days);
        price.push(cueInfo.defend_365_days);
        //维护类型有五种，按钮4个，price=0不显示
        this.removeIndex = price.indexOf("0");
        for(let i = 0; i < price.length; i++) {
            let index = i;
            if(i == this.removeIndex) continue;
            if(i > this.removeIndex) index = i - 1;
            let temp = price[i].split(",");
            this.lb_money0[index].string =  maintainText[i];
            this.lb_money1[index].string = "/"+ temp[1];
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${Number(temp[0])}`,this.img_money[index]);
        }
        
        this.updateDefend(cueInfo);
    }

    updateDefend(data) {
        this.lbDefend.string = "";
        if(data.defendDay > 0) {
            this.lbDefend.string = formatDate(data.defendDay,"yyyy-mm-dd");
        }
        if(data.defendTimes > 0) {
            this.lbDefend.string += ` ${data.defendTimes}`;
        }
    }

    //更新球杆维护文本信息
    updateCueLabelInfo(cueId:number) {
        let cueInfo = this.playerCue.getCueById(cueId);
        let myCue = this.playerCue.getMyCueByCueID(cueId);

        let temp = myCue.damage.split(",");
        this.right_dynamics.string = temp[0];
        this.right_addSai.string = temp[1];
        this.right_gunsight.string = temp[2];
        this.right_zhanli.string = temp[3];

        this.left_dynamics.string = cueInfo.power.toString();
        this.left_addSai.string = cueInfo.gase.toString();
        this.left_gunsight.string = cueInfo.aim.toString();
        this.left_zhanli.string = cueInfo.combat.toString();

    }

	//发送维护球杆
	private sendDefendCue(index)
	{
        let cueIndex = index < this.removeIndex ? index + 1 : index + 2;
		C_Lobby_DefendCue.Send(this.player.id, this.maintainId, cueIndex);
	}

}
