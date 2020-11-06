import { FModule } from "../../../Framework/Core/FModule";
import { LobbyOtherActivityEnterBinder } from "../LobbyOtherActivityEnter/LobbyOtherActivityEnterBinder";
import { LobbyPlayActivityBinder } from "./LobbyPlayActivityBinder";


/**
*@description:大厅左边活动栏模块
**/
export class LobbyPlayActivityModule extends FModule 
{
	public static ClassName:string = "LobbyPlayActivityModule";
	public get assets():any[]{return ["LobbyScene/PlayActivity/LobbyPlayActivity"]};
	private otherBinder: LobbyOtherActivityEnterBinder;
	
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
		this.binder = new LobbyPlayActivityBinder();
		this.node.zIndex = 3;
	}

	bindViews() {
		super.bindViews();
		this.otherBinder = new LobbyOtherActivityEnterBinder();
		this.otherBinder.bindView(this.node);
	}
	
	// protected bindViews():void
	// {
	// 	let view = getNodeChildByName(this.node,{BindNode});
	// 	if(this.binder&&view)
    //         this.binder.bindView(view);
	// }

	protected showViews():void
	{
		super.showViews();
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}