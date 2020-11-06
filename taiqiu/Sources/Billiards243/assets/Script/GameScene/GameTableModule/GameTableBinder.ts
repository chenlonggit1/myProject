import { Vec3 } from "@cocos/cannon";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { Physics3DUtility } from "../../../Framework/Utility/Physics3DUtility";
import { BaseGameTableBinder } from "../../Base/GameTable/BaseGameTableBinder";
import { PlayGameID } from "../../Common/PlayGameID";
import { GameEvent } from "../../GameEvent";
import { C_Game_OptionComplete } from "../../Networks/Clients/C_Game_OptionComplete";
import GameBall from "../GameBall";

/**
*@description:台球球桌模块
**/
export class GameTableBinder extends BaseGameTableBinder {
	public static ClassName: string = "GameTableBinder";
	// 当前操作时间内白球碰撞到的其他球，用于做空杆判定
	private whiteBallHits: any[] = [];
	/**用于记录球是否碰库了 */
	private isHitKu: boolean = false;
	private isReconnection: boolean = false;

	protected initViews(): void {
		super.initViews();
		JTimer.ClearTimeOut(this);
		this.isReconnection = this.room.isReconnection;
	}
	protected createBalls()
	{
		// if(this.player.id==0)
		// {
		// 	cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		// 	this.table.ballParent = StoreManager.NewPrefabNode("GameScene/GameBalls1");
		// 	return;
		// }
		if(this.room.gameId==PlayGameID.RedBall)
		{
			this.room.isAllotBall = true;
			this.table.ballParent = StoreManager.NewPrefabNode("GameScene/GameRedBalls");
		}else this.table.ballParent = StoreManager.NewPrefabNode("GameScene/GameBalls");
	}
	protected onKeyDown(evt)
    {
        if (evt.keyCode == cc.macro.KEY.b)
		{
            this.resetWhiteBall();
        }
    }
	/**延时启动物理引擎，让物理引擎进入到休眠状态 */
	protected delayStartPhysic() {
		if(this.room.gan!=0 || this.room.isReconnection)
			this.syncServerData();
		super.delayStartPhysic();
	}

	protected addEvents() {
		super.addEvents();
		if (this.table.whiteBall == null) return;
		let whiteBallCollider = this.table.whiteBall.getComponent(cc.SphereCollider3D);
		whiteBallCollider.on("collision-enter", this.onWhiteBallCollision, this);
	}
	protected removeEvents() {
		if (this.table.whiteBall == null) return;
		let whiteBallCollider = this.table.whiteBall.getComponent(cc.SphereCollider3D);
		whiteBallCollider.off("collision-enter", this.onWhiteBallCollision, this);
		super.removeEvents();
	}
	/**同步服务器数据 */
	protected syncServerData() {
		if (this.isReconnection) {
			let serverBalls = {};
			for (let j = 0; j < this.room.balls.length; j++) {
				let b = this.room.balls[j];
				serverBalls[b.id] = b;
				let ballPos = b.body;
				if(ballPos.x == 0 && ballPos.y == 0 && ballPos.z == 0) return;
			}
			let bs = [this.table.whiteBall].concat(this.table.balls);
			for (let i = 0; i < bs.length; i++) {
				let ball: cc.Node = bs[i];
				let id = ball.getComponent(GameBall).id;
				let rigi: cc.RigidBody3D = ball.getComponent(cc.RigidBody3D);
				let collider: cc.Collider3D = ball.getComponent(cc.Collider3D);
				if (serverBalls[id] != null) {
					let spos = serverBalls[id].position;
					let sQuat = serverBalls[id].angle;
					let sbody = serverBalls[id].body;
					let pos = cc.v3(spos.x, spos.z, spos.y);// 因为服务器中会把y和z对换，所以需要把z和y再换回来
					let q = cc.quat(sQuat.x, sQuat.y, sQuat.z, sQuat.w);
					ball.setPosition(pos);
					ball.setRotation(q);
					let bodyPos = collider.shape['sharedBody'].body.position;
					let bodyRot = collider.shape['sharedBody'].body.quaternion;
					bodyPos.x = sbody.x;
					bodyPos.y = sbody.y;
					bodyPos.z = sbody.z;
					bodyRot.x = sQuat.x;
					bodyRot.y = sQuat.y;
					bodyRot.z = sQuat.z;
					bodyRot.w = sQuat.w;
					Physics3DUtility.refreshMass(collider.shape['sharedBody'].body);
					// console.log(ball.name,"-接收到服务器球信息->",pos.toString(),sbody.x,sbody.y,sbody.z);
				} else {
					ball.removeFromParent();
					let index = this.table.balls.indexOf(ball);
					if (index != -1) {
						this.table.balls.splice(index, 1);
						i--;
					}
				}
				rigi.sleep();
			}
			this.table.lastWhiteBallPos = this.table.whiteBall.position.clone();
			if (!Physics3DUtility.IsSleeping()) {
				Physics3DUtility.IsEnableSendSleep = false;
				Physics3DUtility.StartUpdateFrame();
			} else Physics3DUtility.StopUpdateFrame();
		}
	}
	/**断线重连物理休眠后，修正击球 */
	private fixedShootBall() {
		if (this.room.proto == null) return;
		dispatchFEventWith(GameEvent.Player_ShotBall, this.room.proto);
	}
	/**开始新一轮操作 */
	public setOptionPlayer(playerID: number) 
	{

	}
	/**击球 */
	public shoot(playerID: number, angle: number, force: cc.Vec3, velocity: cc.Vec3, powerScale: number, contactPoint: cc.Vec2, gasserAngle: number): void {
		this.isHitKu = false;
		this.whiteBallHits.length = 0;
	}
	/**物理休眠后的回调 */
	protected onPhysicSleep() {
		if (this.isReconnection) {
			if(this.room.gan == 0) this.sendOptionComplete();
			else this.syncServerData();
			this.isReconnection = false;
			this.fixedShootBall();
			Physics3DUtility.IsEnableSendSleep = true;
			return;
		}
		if (Physics3DUtility.IsEnableSendSleep) {
			if (!this.table.whiteBall.parent) {
				JTimer.ClearTimeOut(this);
				if (this.whiteBallHits.length == 0) JTimer.TimeOut(this, 1000, Fun(this.resetWhiteBall, this));
				else this.resetWhiteBall();
			} else this.sendOptionComplete();
		}
		Physics3DUtility.IsEnableSendSleep = true;
	}
	/**白球进洞后重置白球 */
	protected resetWhiteBall() {
		if (this.table.whiteBall == null) return;

		if(!this.table.whiteBall.parent)
			this.table.ballParent.addChild(this.table.whiteBall);
		let rigi: cc.RigidBody3D = this.table.whiteBall.getComponent(cc.RigidBody3D);
		let collider: cc.Collider3D = this.table.whiteBall.getComponent(cc.Collider3D);
		this.table.whiteBall.setPosition(this.table.lastWhiteBallPos);
		Physics3DUtility.SetNodeWorld(this.table.whiteBall, this.table.lastWhiteBallPos);
		Physics3DUtility.refreshMass(collider.shape['sharedBody'].body);
		rigi.sleep();
		Physics3DUtility.IsEnableSendSleep = false;
		Physics3DUtility.StartUpdateFrame();
		JTimer.ClearTimeOut(this);
		JTimer.TimeOut(this, 500, Fun(this.delaySendOptionComplete, this));
		this.updateBallScreenPoints();
	}
	/**当白球进洞了以后，重新打摆球了需要延时到物理系统休眠以后才能发送操作完成的消息 */
	protected delaySendOptionComplete() {
		JTimer.ClearTimeOut(this);
		if (Physics3DUtility.IsSleeping()) {
			Physics3DUtility.IsEnableSendSleep = true;
			this.sendOptionComplete();
		} else {
			Physics3DUtility.IsEnableSendSleep = false;
			JTimer.TimeOut(this, 100, Fun(this.delaySendOptionComplete, this));
		}
	}
	/**当前操作完成，物理已经休眠 */
	protected sendOptionComplete() 
	{
		JTimer.ClearTimeOut(this);
		let ballDatas = [];
		const p3dm = cc.director.getPhysics3DManager();
		p3dm.traverse((body) => {
			if (body.node.group == "Balls") {
				let bodyPos = body.body.position;
				let bodyRot = body.body.quaternion;
				let pos = cc.v3(bodyPos.x, bodyPos.y, bodyPos.z);
				let rot = cc.quat(bodyRot.x, bodyRot.y, bodyRot.z, bodyRot.w);
				// console.log(body.node.name,"=向服务器发送球信息==>",body.node.position.toString(),pos.toString());
				ballDatas.push({ id: body.node.getComponent(GameBall).id, position: body.node.position, body: pos, angle: rot });
				Physics3DUtility.refreshMass(body.body);

			}
		});
		C_Game_OptionComplete.Send(ballDatas, this.whiteBallHits.concat(), this.isHitKu);
	}
	/**用于记录白球撞到了其他球，做犯规处理 */
	protected onWhiteBallCollision(evt) {
		let other: cc.Node = evt.otherCollider.node;
		if (other.group == "Tables" && other.name.startsWith("BorderBox")) this.isHitKu = true;// 碰撞到桌子边了
		if (other.group != "Balls") return;

		let ballID = other.getComponent(GameBall).id;
		if (this.whiteBallHits.indexOf(ballID) == -1) {
			this.whiteBallHits.push(ballID);
		}
	}
}