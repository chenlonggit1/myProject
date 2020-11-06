import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { Assets } from "../../../Framework/Core/Assets";
import { LobbySignActItemBinder } from "./LobbySignActItemBinder";
import { SignDayVO } from "../../VO/SignDayVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { SignActivityVO } from "../../VO/SignActivityVO";
import { C_Lobby_SureSign } from "../../Networks/Clients/Sign/C_Lobby_SureSign";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { showPopup } from "../../Common/showPopup";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";

/**
*@description:签到
**/
export class LobbySignActivityBinder extends FBinder 
{
	public static ClassName:string = "LobbySignActivityBinder";
	private awardLayer: cc.Node = null;
	private activeItems: LobbySignActItemBinder[] = [];
	private btn_sign: cc.Node;
	
	protected initViews():void
	{
		super.initViews();
		let btn_close = getNodeChildByName(this.asset, "btn_close");
		let btn_sign = getNodeChildByName(this.asset, "btn_sign");
		this.awardLayer = getNodeChildByName(this.asset, "awardLayer");

		btn_close.on(cc.Node.EventType.TOUCH_END, this.closeView, this);

		btn_sign.on(cc.Node.EventType.TOUCH_END, ()=> {
			C_Lobby_SureSign.Send();
		});

		this.btn_sign = btn_sign;
	}

	protected addEvents(): void {
		addEvent(this,LobbyEvent.Server_Lobby_Sgin_Update, this.updateSignData);
	}

	updateView() {
		let prefab = Assets.GetPrefab("LobbyScene/LobbyOtherActivityLayer/LobbysignActItem");

		// ===== 创建假数据 ===
		let SignActivity:SignActivityVO = GameDataManager.GetDictData(GameDataKey.SignActivityVo, SignActivityVO);
		
		let len = SignActivity.signList.length;
		for(let i = 0; i < len; i++) {
			this.activeItems[i] || (this.activeItems[i] = this.addObject(new LobbySignActItemBinder()));
			let item: cc.Node = StoreManager.NewPrefabNode(prefab);
			this.activeItems[i].bindView(item);
			this.activeItems[i].setData(SignActivity.signList[i]);
			this.awardLayer.children[i] && this.awardLayer.children[i].addChild(item);
		}

		this.setBtnState(SignActivity.isSignIn);

	}


	setBtnState(isGray: boolean) {
		let btn = this.btn_sign.getComponent(cc.Button);
		btn.interactable = isGray;
	}

	private updateSignData () {
		let SignActivity:SignActivityVO = GameDataManager.GetDictData(GameDataKey.SignActivityVo, SignActivityVO);
		if(!SignActivity.isSignIn) {
			this.closeView();
			dispatchFEventWith(LobbyEvent.ActivityUpdate);
		}
	}

	private closeView() {
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_SignActivity);
	}
}