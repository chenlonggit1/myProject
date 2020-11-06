import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { SignDayVO } from "../../VO/SignDayVO";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { LanguageManager } from "../../../Framework/Managers/LanguageManager";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { ResourceReleaseManager } from "../../../Framework/Managers/ResourceReleaseManager";

/**
*@description:签到item
**/
export class LobbySignActItemBinder extends FBinder 
{
	public static ClassName:string = "LobbySignActItemBinder";
	private smallBg: cc.Node;
	private BigBg: cc.Node;
	private gold: cc.Node;
	private dim: cc.Node
	private t_num: cc.Label;
	private t_day: cc.Label;
	private t_day_other: cc.Label;
	private getFlag: cc.Node;
	private data: SignDayVO;
	private spr_flag: cc.Sprite;
	

	protected initViews():void
	{
		super.initViews();

		this.smallBg = getNodeChildByName(this.asset, "smallD");
		this.BigBg = getNodeChildByName(this.asset, "BigK");
		this.getFlag = getNodeChildByName(this.asset, "got")
		this.gold = getNodeChildByName(this.asset, "gold");
		this.dim = getNodeChildByName(this.asset, "dim");
		this.t_num = getNodeChildByName(this.asset, "t_num", cc.Label);
		this.t_day = getNodeChildByName(this.asset, "t_day", cc.Label);
		this.spr_flag = getNodeChildByName(this.asset, "flag", cc.Sprite);
		// this.t_day_other = getNodeChildByName(this.asset, "t_day/other", cc.Label);
	}

	setData(data: SignDayVO) {
		if(data.day > 8) {
			this.smallBg.active = false;
			this.BigBg.active = true;
		}
		if(!data.state) {
			this.getFlag.active = false;
			
		}else {
			this.getFlag.active = true;
			this.smallBg.getComponent(cc.Sprite).setMaterial(0, cc.Material.getBuiltinMaterial('2d-gray-sprite'));
			this.BigBg.getComponent(cc.Sprite).setMaterial(0, cc.Material.getBuiltinMaterial('2d-gray-sprite'));
		}
		this.gold.active = true;
		let id = 0;
		let iconurl = `Lobby/LobbyIcon/LobbyIcon?:icon${data.type}`
		if(data.awards.length) {
			id = data.awards[0].id;
			iconurl =  `Lobby/LobbyIcon/LobbyIcon?:icon${id}`
		} 
		let num = data.count || data.awards[0].num;
		ResourceManager.LoadSpriteFrame(iconurl, this.gold.getComponent(cc.Sprite))
		this.t_day.string =  data.day+"";
		this.t_num.string = num + ""

		let allCue: PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue);
		console.log("=========== 球杆有数据 =", !!allCue);
		let cueID = String(id);
		cueID = cueID.substr(1);
		let cue = allCue.getCue(cueID);
		this.spr_flag.node.active = !!cue;
		if(cue) {
			ResourceManager.LoadSpriteFrame("Lobby/LobbyIcon/LobbyIcon?:" + cue.quality, this.spr_flag)
		}
	}

	private setLuange(lbl1: cc.Label, otherLbl: cc.Label, content:string, replaStr:string) {
		if(LanguageManager.CurrentIndex == 0) {
			lbl1.string = content.replace("*", replaStr);
			otherLbl.node.active = false;
		} else {
			lbl1.string = content;
			otherLbl.string = " " + replaStr;
			otherLbl.node.active = true;
		}
	}


}