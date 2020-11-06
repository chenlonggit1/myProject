import { FModule } from "../../../Framework/Core/FModule";
import { GameSetBinder } from "./GameSetBinder";
/**
*@description:游戏设置模块
**/
export class GameSetModule extends FModule{
	public static ClassName:string = "GameSetModule";
	public get assets():any[]{return ["GameSetModule/GameSetModule"]};

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
		this.binder = new GameSetBinder();
	}
}