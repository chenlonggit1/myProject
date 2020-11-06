import { GameBallCueModule } from "../../GameScene/GameBallCueModule/GameBallCueModule";
import { GameTrainBallCueBinder } from "./GameTrainBallCueBinder";


/**
*@description:训练球杆模块
**/
export class GameTrainBallCueModule extends GameBallCueModule 
{
	public static ClassName:string = "GameTrainBallCueModule";
	public get assets():any[]{return ["GameScene/GameBallCue"]};
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
		this.binder = new GameTrainBallCueBinder();
	}
	
	protected showViews():void
	{
		super.showViews();
	}
	protected hideViews():void
	{
		super.hideViews();
	}
}