import { FModule } from "../../../Framework/Core/FModule";
import { GamePocketCollectBinder } from "./GamePocketCollectBinder";


/**
*@description:入袋桌球收集模块
**/
export class GamePocketCollectModule extends FModule 
{
	public static ClassName:string = "GamePocketCollectModule";
	public get assets():any[]
	{
		let arr = ["GameScene/GamePocketCollectModule","GameScene/BallItem"];
		for (let i = 0; i < 17; i++) 
			arr.push("GameScene/BallMeshs/Mesh"+i);
		return arr;
	};
	
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
		this.binder = new GamePocketCollectBinder();
	}
	/**开始新一局 */
	public onStartNewRound()
	{
		this.binder.bindView(this.node);
	}
}