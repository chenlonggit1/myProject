import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { LanguageManager } from "../../../Framework/Managers/LanguageManager";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { C_Lobby_CheckName } from "../../Networks/Clients/C_Lobby_CheckName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { ERRINFO } from "../../Networks/ERRDefine";
import { GetErrInfo } from "../GetErrInfo";

/**
*@description:实名认证
**/
export class LobbyCheckNameBinder extends FBinder 
{
	public static ClassName:string = "LobbyCheckNameBinder";
	private btn_close: cc.Button;
	private btn_sure: cc.Button;

	private edit_xing: cc.EditBox;
	private edit_ming: cc.EditBox;
	private edit_shenFen: cc.EditBox;
	private dot: string = '·'; 
	private awards: cc.Node[] = [];


	
	protected initViews():void
	{
		super.initViews();
		this.btn_close = getNodeChildByName(this.asset, "close", cc.Button);
		this.btn_sure = getNodeChildByName(this.asset, "sure", cc.Button);

		this.edit_xing = getNodeChildByName(this.asset, "t_name/xing", cc.EditBox);
		this.edit_ming = getNodeChildByName(this.asset, "t_name/ming", cc.EditBox);
		this.edit_shenFen = getNodeChildByName(this.asset, "t_zhengjian/ming", cc.EditBox);

		let gift:cc.Node = getNodeChildByName(this.asset, "t_gitf");
		this.awards = gift.children;

		this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
		this.btn_sure.node.on(cc.Node.EventType.TOUCH_END, this.onSure, this);

	}

	addEvents () {
		addEvent(this, LobbyEvent.ActivityUpdate, this.onActivityUpdate) 
	}

	updateView() {
		let award = this.awards[0];
		if(award) {
			let t_num = award.children[1].getComponent(cc.Label);
			t_num.string = 100+""
		}
	}

	onSure() {
		let nameStr = "";
		let shenFen = this.edit_shenFen.string;
		let xingStr = this.edit_xing.string;
		let mingStr = this.edit_ming.string;
		if(xingStr && mingStr) { // 维语名字
			nameStr = mingStr + this.dot + xingStr;
		} else {
			if( !xingStr) {
				cc.error("======名字不完整");
				showPopup(PopupType.TOAST, {msg: GetErrInfo(2001)})
				return;
			}
			nameStr = xingStr;
		}
		
		if(shenFen.length < 1) {
			showPopup(PopupType.TOAST, {msg: GetErrInfo(2002)})
			cc.error("======身份证号不完整");
			return;
		}
		C_Lobby_CheckName.Send(shenFen, nameStr);
	}

	onClose() {
		this.edit_ming.string = "";
		this.edit_shenFen.string = "";
		this.edit_xing.string = "";
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.CheckNameModule);
	}

	onActivityUpdate() {
		let player: PlayerVO = GameDataManager.GetDictData(GameDataKey.Player);
		if(player.isShiming) {
			this.onClose();
		}
	}
}