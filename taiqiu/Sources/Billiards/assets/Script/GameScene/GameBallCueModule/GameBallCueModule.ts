import { FModule } from "../../../Framework/Core/FModule";
import { PointUtility } from "../../../Framework/Utility/PointUtility";
import { GameBallCueBinder } from "./GameBallCueBinder";

/**
*@description:游戏中球杆模块
**/ 
export class GameBallCueModule extends FModule 
{
	public static ClassName:string = "GameBallCueModule";
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
		this.binder = new GameBallCueBinder();
	}
    public onPlayerOption(playerID:number)
	{
		if(this.binder==null)return;
		(this.binder as GameBallCueBinder).setOptionPlayer(playerID);
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
		(this.binder as GameBallCueBinder).shoot(playerID,angle,force,velocity,powerScale,contactPoint,gasserAngle);
		
	}
	public onUpdateBallCue(data:any)
	{
		if(this.binder==null)return;
		if(data.position)
		{
			let position = PointUtility.Object2Point(cc.v3(),data.position);
			(this.binder as GameBallCueBinder).updateBallCuePosition(position);
		}
		if(data.angle)
		{
			let angle = PointUtility.Object2Point(cc.v3(),data.angle);
			(this.binder as GameBallCueBinder).updateBallCueAngle(angle,true);
		}
		
	}
	public onGameSettle(data)
	{
        if(this.binder==null)return;
		(this.binder as GameBallCueBinder).onGameSettle();
	}
}