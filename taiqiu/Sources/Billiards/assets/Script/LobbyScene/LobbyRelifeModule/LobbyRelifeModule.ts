import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { C_Lobby_relifeNum } from "../../Networks/Clients/C_Lobby_relifeNum";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { RelifVO } from "../../VO/RelifVO";
import { LobbyRelifeBinder } from "./LobbyRelifeBinder";


/**
*@description:每日复活
**/
export class LobbyRelifeModule extends ModuleBasePopup 
{
	public static ClassName:string = "LobbyRelifeModule";
	public get assets():any[]{return ["LobbyScene/LobbyOtherActivityLayer/LobbyReLife"]};
	protected binder: LobbyRelifeBinder;
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = true;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new LobbyRelifeBinder();
	}
	
	protected showViews():void
	{
		super.showViews();
		let relifeData: RelifVO = GameDataManager.GetDictData(GameDataKey.RelifeGift);
		if(relifeData && relifeData.isActive) {
			C_Lobby_relifeNum.Send();
		}
		this.popup(this.node, null);
		this.binder.updateView(); 
	}
	protected hideViews():void
	{
		this.popdown(this.node, ()=> {
			super.hideViews();
		})
	}
}