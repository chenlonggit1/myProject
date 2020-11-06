import { FModule } from "../../../Framework/Core/FModule";
import { LobbySignActivityBinder } from "./LobbySignActivityBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { SignDayVO } from "../../VO/SignDayVO";
import { showPopup } from "../../Common/showPopup";
import { PopupType } from "../../PopupType";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";


/**
*@description:签到
**/
export class LobbySignActivityModule extends ModuleBasePopup
 
{
	public static ClassName:string = "LobbySignActivityModule";
	public get assets():any[]{return ["LobbyScene/LobbyOtherActivityLayer/LobbySignActivityLayer", "LobbyScene/LobbyOtherActivityLayer/LobbysignActItem"]};
	protected binder: LobbySignActivityBinder;

	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected createViews():void
	{
		super.createViews();
		this.binder = new LobbySignActivityBinder();
	}

	addEvents() {
		super.addEvents();
		addEvent(this,LobbyEvent.Server_Lobby_Sgin_Update, this.updateSignData);
	}
	

	protected showViews():void
	{
		// let Sign:PlayerVO = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO)
		
		this.binder.updateView();
		super.showViews();
		this.popup(this.node, ()=> {

		})
	}
	protected hideViews():void
	{
		
		 this.popdown(this.node, () => {
			super.hideViews();
        });
	}

	private updateSignData(data: any) {
		let day:SignDayVO = data.data;
		this.binder && this.binder.updateView();
		// TODO
		let list = []
		
		if(day.count) { 
			let item = {id:day.type, num:day.count};
			list.push(item);
		}
		
		for(let i = 0; i < day.awards.length; i++) {
			if(!day.awards[i] || !day.awards[i].num) {
				continue;
			}
			let item = {id:day.awards[i].id, num:day.awards[i].num};
			list.push(item);
		}

		showPopup(PopupType.GET_REWARD, {list: list,onConfirm: ()=>{
			let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
			if(!player.isOpenNotice)
				dispatchFEventWith(LobbyEvent.Open_LobbyActivity);
		}}, false);
	}
}