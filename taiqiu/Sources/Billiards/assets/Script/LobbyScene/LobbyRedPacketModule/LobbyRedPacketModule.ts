import { LobbyRedPacketBinder } from "./LobbyRedPacketBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { FEvent } from "../../../Framework/Events/FEvent";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { RedPacketVO } from "../../VO/RedPacketVO";
import { C_Lobby_RedPackets } from "../../Networks/Clients/RedPacket/C_Lobby_GetRedPackets";
import { LobbyEvent } from "../../Common/LobbyEvent";


/**
*@description:红包墙
**/
export class LobbyRedPacketModule extends ModuleBasePopup 
{
	public static ClassName:string = "LobbyRedPacketModule";
	public get assets():any[]{return ["LobbyScene/LobbyRedPacket/LobbyRedPacket"]};
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,LobbyEvent.Server_GetRedPacket,this.updateRedPacket);
		addEvent(this,LobbyEvent.Server_AddRedPacket,this.updateRedPacket);
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new LobbyRedPacketBinder();

		// 本地没有数据，去请求服务器
        setTimeout(() => {
			let redpacket:RedPacketVO = GameDataManager.GetDictData(GameDataKey.RedPacket,RedPacketVO);
			if (redpacket.redpackets.length <= 0) C_Lobby_RedPackets.Send(); 
			else this.updateRedPacket(new FEvent(LobbyEvent.Server_GetRedPacket,redpacket.redpackets));
        }, 0)
	}
	protected updateRedPacket(evt: FEvent)
	{
		this.binder.update({adds: evt.data, animEnd: !this.popupTween});
	}
	public showViews():void
	{
		super.showViews();
		// 弹出动画
        this.popup(this.node, () => {
			// 动画播放完毕去显示
			this.updateRedPacket(new FEvent(LobbyEvent.Server_GetRedPacket,null));
		});
	}
	protected hideViews():void
	{
        // 弹下动画
        this.popdown(this.node, () => {
			super.hideViews();
        });
	}
}