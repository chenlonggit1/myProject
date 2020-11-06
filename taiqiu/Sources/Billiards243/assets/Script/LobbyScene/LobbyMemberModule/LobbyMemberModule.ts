import { LobbyMemberBinder } from "./LobbyMemberBinder";
import { ModuleBasePopup } from "../../PopupModule/ModuleBasePopup";
import { PopupAnimType } from "../../../Framework/Enums/PopupAnimType";


/**
*@description:会员
**/
export class LobbyMemberModule extends ModuleBasePopup 
{
	public static ClassName:string = "LobbyMemberModule";
	public get assets():any[]{return ["LobbyScene/LobbyMember/LobbyMember"]};
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
		this.animType = PopupAnimType.UP;
	}

	protected addEvents()
	{
		super.addEvents();
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new LobbyMemberBinder();
	}
	public showViews():void
	{
		super.showViews();
		// 更新binder
		this.binder.update(null);
        // 弹出动画
        this.popup(this.node, () => {});
	}
	protected hideViews():void
	{
        // 弹下动画
        this.popdown(this.node, () => {
			super.hideViews();
        });
	}
}