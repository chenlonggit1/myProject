import { FModule } from "../../../Framework/Core/FModule";
import { GameLuckBallTableBinder } from "../../GameLuckBallScene/GameTableModule/GameLuckBallTableBinder";
import { GamePocketBinder } from "../../GameScene/GameTableModule/GamePocketBinder";
import { GameShootBallBinder } from "../../GameScene/GameTableModule/GameShootBallBinder";
import { GameTableModule } from "../../GameScene/GameTableModule/GameTableModule";
import { GameTrainPockerBinder } from "./GameTrainPockerBinder";
import { GameTrainTableBinder } from "./GameTrainTableBinder";



/**
*@description:新手引导训练桌子
**/
export class GameTrainTableModule extends GameTableModule 
{
	public static ClassName:string = "GameTrainTableModule"; 
	public get assets():any[]{return ["GameScene/GameTableModule","GameScene/GameRedBalls","GameTrainScene/GameBalls"]};
	// protected binder: GameTrainTableBinder;
	// protected shootBinder:GameShootBallBinder = null;
	// public constructor()
	// {
	// 	super();
	// 	this.isNeedPreload = false;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
	// 	this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
	// 	this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	// }
	protected createViews():void
	{
		super.createViews();
		this.binder = new GameTrainTableBinder();
		this.pocketBinder = this.addObject(new GamePocketBinder());
		this.shootBinder = this.addObject(new GameShootBallBinder());
	}
	
	// protected showViews():void
	// {
	// 	super.showViews();
	// }
	// protected hideViews():void
	// {
	// 	super.hideViews();
	// }

	// protected bindViews () {
	// 	super.bindViews();
	// 	this.pockerBinder.bindView(this.node);
	// 	this.shootBinder.bindView(this.node);
	// }

	// public onPlayerOption(playerID:number)
	// {
	// 	if(this.binder==null)return;
	// 	this.shootBinder.setOptionPlayer(playerID);
	// }
	// public onPlayerShotBall(data:any)
	// {
	// 	if(this.binder==null)return;
	// 	let angle = data.angle;
	// 	let playerID = data.playerID;
	// 	let powerScale = data.powerScale;
	// 	let gasserAngle = data.gasserAngle;
	// 	let force = data.force;
	// 	let velocity = data.velocity;
	// 	let contactPoint = data.contactPoint;	
	// 	this.shootBinder.shoot(playerID,angle,force,velocity,powerScale,contactPoint,gasserAngle);
	// 	// (this.binder as GameLuckBallTableBinder).onPlayerStopBall()
	// }
		
}