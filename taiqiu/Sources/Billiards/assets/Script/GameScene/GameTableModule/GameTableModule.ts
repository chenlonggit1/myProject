import { FModule } from "../../../Framework/Core/FModule";
import { GamePocketBinder } from "./GamePocketBinder";
import { GameShootBallBinder } from "./GameShootBallBinder";
import { GameTableBinder } from "./GameTableBinder";


/**
*@description:台球球桌模块a
**/
export class GameTableModule extends FModule 
{
	public static ClassName:string = "GameTableModule";
	public get assets():any[]{return ["GameScene/GameTableModule","GameScene/GameBalls","GameScene/GameRedBalls","GameScene/GameBalls1"]};
	protected pocketBinder:GamePocketBinder = null;
	protected shootBinder:GameShootBallBinder = null;
	public constructor()
	{
		super();
		this.isNeedPreload = true;// 默认不需要预加载资源，只有使用了Mediator管理模块时才起作用
		this.isReleaseAsset = false;// true:销毁模块时释放资源   false:销毁模块时不释放资源
		this.delayReleaseAssetTime = 0;// 销毁模块时延时释放资源，单位ms
	}
	protected createViews():void
	{
		super.createViews();
		this.binder = new GameTableBinder();
		this.pocketBinder = this.addObject(new GamePocketBinder());
		this.shootBinder = this.addObject(new GameShootBallBinder());
	}
	protected bindViews()
	{
		super.bindViews();
		this.pocketBinder.bindView(this.node);
		this.shootBinder.bindView(this.node);
	}
	/**开始新一局 */
	public onStartNewRound()
	{
		this.binder.bindView(this.node);
	}
	
	public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as GameTableBinder).setOptionPlayer(playerID);
		this.shootBinder.setOptionPlayer(playerID);
	}
	public onPlayerShotBall(data:any)
	{
		if(this.binder==null)return;
		let angle = data.angle;
		let playerID = data.playerID;
		let powerScale = data.powerScale;
		let gasserAngle = data.gasserAngle;
		let force = data.force;
		let velocity = data.velocity;
		let contactPoint = data.contactPoint;	
		(this.binder as GameTableBinder).shoot(playerID,angle,force,velocity,powerScale,contactPoint,gasserAngle);		
		this.shootBinder.shoot(playerID,angle,force,velocity,powerScale,contactPoint,gasserAngle);
		
	}
}