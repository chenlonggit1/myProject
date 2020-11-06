import { FModule } from "../../../Framework/Core/FModule";
import { LobbyTaskBinder } from "./LobbyTaskBinder";


/**
*@description:大厅任务信息模块
**/
export class LobbyTaskModule extends FModule 
{
	public static ClassName:string = "LobbyTaskModule";
	public get assets():any[]{return ["LobbyScene/LobbyTask/LobbyTask","LobbyScene/LobbyTask/LobbyTaskItem",
		"LobbyScene/LobbyTask/TaskGiftItem"]};
	
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
		this.binder = new LobbyTaskBinder();
	}

	protected showViews():void
	{
		super.showViews();
		(this.binder as LobbyTaskBinder).setTaskTitle(0);
		(this.binder as LobbyTaskBinder).getTask(1);
		(this.binder as LobbyTaskBinder).setRedPoint();
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}