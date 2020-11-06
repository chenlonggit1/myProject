import { FModule } from "../../../Framework/Core/FModule";
import { GameReviseBinder } from "./GameReviseBinder";
import { PointUtility } from "../../../Framework/Utility/PointUtility";


/**
*@description:用于校正游戏球运动模块
**/
export class GameReviseModule extends FModule 
{
	public static ClassName:string = "GameReviseModule";
	public get assets():any[]{return []};
	
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
		this.binder = new GameReviseBinder();
	}
	/**玩家击球 */
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
		let hitPos = data.hitPoint;
		let hitAngle = data.hitAngle;

		(this.binder as GameReviseBinder).shoot(playerID,angle,force,velocity,powerScale,contactPoint,gasserAngle,hitPos,hitAngle);	
	}
}