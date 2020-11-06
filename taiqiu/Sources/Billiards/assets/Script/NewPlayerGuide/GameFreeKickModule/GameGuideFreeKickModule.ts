import { FModule } from "../../../Framework/Core/FModule";
import { RoomVO } from "../../VO/RoomVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { GameFreeKickModule } from "../../GameScene/GameFreeKickModule/GameFreeKickModule";
import { GameGuideFreeKickBinder } from "./GameGuideFreeKickBinder";


/**
*@description:任意球摆球模块
**/
export class GameGuideFreeKickModule extends GameFreeKickModule
{
	public static ClassName:string = "GameFreeKickModule";
	public get assets():any[]{return ["GameScene/GameFreeKickModule"]};
	
	public constructor()
	{
		super();
		this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}

	protected createViews():void
	{
		// super.createViews();
		this.binder = new GameGuideFreeKickBinder();
	}
}