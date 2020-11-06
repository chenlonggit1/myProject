import { GameLuckInfoBinder } from "./GameLuckInfoBinder";
import { FModule } from "../../../Framework/Core/FModule";


/**
*@description: 桌面的基本信息
**/
export class GameLuckInfoModule extends FModule 
{
	public static ClassName:string = "GameLuckInfoModule";
	public get assets():any[]{return ["GameLuckBallScene/GameLuckInfo"]};

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
		this.binder = new GameLuckInfoBinder();
	}


	
	
}