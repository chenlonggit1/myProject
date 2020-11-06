import { FBinder } from "../../../Framework/Core/FBinder";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { TableVO } from "../../VO/TableVO";

/**
*@description:用于校正游戏球运动模块
**/
export class GameReviseBinder extends FBinder 
{
	public static ClassName:string = "GameReviseBinder";
	protected table:TableVO = null;
	/**、是否第一次碰撞 */
	private isFirstHit:boolean = false;
	/**瞄准线碰撞位置 */
	private hitPos:cc.Vec2 = null;
	/**瞄准线碰撞角度 */
	private hitAngle:number = 0;
	protected initViews():void
	{
		super.initViews();
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
	}
	protected addEvents()
	{
		super.addEvents();
		addEvent(this,GameEvent.Table_Init_Complete,this.onAddBallEvent);
	}
	protected onAddBallEvent()
	{
		if (this.table.whiteBall == null) return;
		let whiteBallCollider = this.table.whiteBall.getComponent(cc.SphereCollider3D);
		whiteBallCollider.on("collision-enter",this.onWhiteBallCollision,this);
	}
	protected removeEvents()
	{
		let whiteBallCollider = this.table.whiteBall.getComponent(cc.SphereCollider3D);
		whiteBallCollider.off("collision-enter",this.onWhiteBallCollision,this);
		super.removeEvents();
	}
	
	
	/**击球 */
	public shoot(playerID:number,angle:number,force:cc.Vec3,velocity:cc.Vec3,powerScale:number,contactPoint:cc.Vec2,gasserAngle:number,hitPos:cc.Vec2,hitAngle:number):void
	{
		this.isFirstHit = true;

		this.hitPos = hitPos;
		this.hitAngle = hitAngle;
		// 瞄的不是球，加塞 都不做修正
		if(this.hitPos==null||gasserAngle!=0||contactPoint.x!=0)
		{
			this.isFirstHit = false;
		}
	}
	/**监听白球碰撞事件 */
	protected onWhiteBallCollision(evt)
	{
		if(this.hitPos==null)return;
		let other:cc.Node = evt.otherCollider.node;
		let self:cc.Node = evt.selfCollider.node;
		// 碰撞到桌面或者桌子盖子
		if(other.group=="Tables"&&(other.name=="BottomBox"||other.name=="CapBox"))return;
		if(this.isFirstHit==false)return;
		this.isFirstHit = false;
		if(other.group!="Balls")return;
		let wVelocity = cc.v3();
		let oVelocity = cc.v3();
		let velocity = cc.v3();
		self.getComponent(cc.RigidBody3D).getLinearVelocity(wVelocity);
		let rigi = other.getComponent(cc.RigidBody3D);
		rigi.getLinearVelocity(oVelocity);
		let maxValue = Math.max(Math.abs(wVelocity.x),Math.abs(wVelocity.y),Math.abs(wVelocity.z),
						Math.abs(oVelocity.x),Math.abs(oVelocity.y),Math.abs(oVelocity.z));
		cc.Vec3.rotateY(velocity, cc.v3(maxValue,0,0), cc.v3(), cc.misc.degreesToRadians(this.hitAngle));
		rigi.sleep();
		rigi.setLinearVelocity(velocity);
	}
	public dispose()
	{
        JTimer.ClearTimeOut(this);
		super.dispose();
	}
}