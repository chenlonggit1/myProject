import { FModule } from "../../../Framework/Core/FModule";
import { GameBallGuideBinder } from "./GameBallGuideBinder";


/**
*@description:提示玩家击球的光圈
**/
export class GameBallGuideModule extends FModule 
{
	public static ClassName:string = "GameBallGuideModule";
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
		this.binder = new GameBallGuideBinder();
	}
	public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as GameBallGuideBinder).setOptionPlayer(playerID);
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
		(this.binder as GameBallGuideBinder).shoot(playerID,angle,force,velocity,powerScale,contactPoint,gasserAngle);
		
	}
	public onGameSettle(data)
	{
        if(this.binder==null)return;
		(this.binder as GameBallGuideBinder).onGameSettle();
	}
}