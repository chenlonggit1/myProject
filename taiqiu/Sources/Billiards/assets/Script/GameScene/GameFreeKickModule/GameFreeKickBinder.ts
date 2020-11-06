import { FBinder } from "../../../Framework/Core/FBinder";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { FEvent } from "../../../Framework/Events/FEvent";
import { UIEvent } from "../../../Framework/Events/UIEvent";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { convertToScreen } from "../../../Framework/Utility/dx/convertToScreen";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { getCamera } from "../../../Framework/Utility/dx/getCamera";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { stageHeight } from "../../../Framework/Utility/dx/stageHeight";
import { stageWidth } from "../../../Framework/Utility/dx/stageWidth";
import { Physics3DUtility } from "../../../Framework/Utility/Physics3DUtility";
import { PointUtility } from "../../../Framework/Utility/PointUtility";
import { CanvasOffset } from "../../Common/CanvasOffset";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { C_Game_PutTheBall } from "../../Networks/Clients/C_Game_PutTheBall";
import { C_Game_SyncPutBall } from "../../Networks/Clients/C_Game_SyncPutBall";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { TableVO } from "../../VO/TableVO";
import GameBall from "../GameBall";

/**
*@description:任意球摆球模块
**/
export class GameFreeKickBinder extends FBinder {
	public static ClassName: string = "GameFreeKickBinder";
	private freeKickMask: cc.Graphics = null;
	
	protected isCanDrop: boolean = true;
	private player: PlayerVO = null;
	private room: RoomVO = null;
	protected camera: cc.Camera = null;
	protected ballScreenPoints = {};
	protected anchorScreenPoints: any[] = [];
	protected boundRect: cc.Rect = cc.rect();
	protected transverse: cc.Rect = cc.rect();
	protected table: TableVO = null;
	//摆球箭头动画
	protected freeKickNode:cc.Node = null;
	protected freeKickList:cc.Node[] = [];
	//摆球屏幕动画
	protected fullScene:cc.Node = null;
	protected halfScene:cc.Node = null;
	protected sceneTween:cc.Tween = null;
	//摆球框、禁用框
	private freeKickBall:cc.Node = null;
	private disableBig:cc.Node = null;
	//摆球结束
	private putBallEnd:boolean = false;

	protected initViews(): void 
	{
		
		super.initViews();
		if(this.freeKickMask==null)
			this.freeKickMask = StoreManager.NewNode(cc.Graphics);
		this.camera = getCamera("3D Camera");
		this.table = GameDataManager.GetDictData(GameDataKey.Table, TableVO);
		this.room = GameDataManager.GetDictData(GameDataKey.Room, RoomVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player, PlayerVO);
		
		this.freeKickNode = getNodeChildByName(this.asset, "freeKickNode");
		for(let i = 0; i < 3; i++)
		{
			this.freeKickList[i] = getNodeChildByName(this.freeKickNode,`freeKick${i+1}`);
		}
		this.freeKickNode.active = false;
		this.fullScene = getNodeChildByName(this.asset, "fullScene");
		this.halfScene = getNodeChildByName(this.asset, "halfScene");
		this.freeKickBall = getNodeChildByName(this.asset,"baiQiuGuang");
		this.disableBig = getNodeChildByName(this.asset,"disableBig");
		this.freeKickBall.active = false;
		this.disableBig.active = false;

		Physics3DUtility.SetSleepCallback(Fun(this.onPhysicSleep,this,false));
		this.onGetTableInfo();
		if(this.room.robotPutBall){
			this.room.robotPutBall = false
			
			this.onPlayerPutTheBall(new FEvent(GameEvent.On_Player_PutTheBall,this.room.robotData))
		}
	}
	protected addEvents() 
	{
		super.addEvents();
		addEvent(this, GameEvent.Player_Power_Option, this.onSelectedShotPower);
		addEvent(this, GameEvent.Table_Init_Complete, this.onGetTableInfo);
		addEvent(this,GameEvent.On_Player_PutTheBall,this.onPlayerPutTheBall);
		if(this.player.id==0)// 在测试场景使用快捷键
        {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
	}
	protected onGetTableInfo() 
	{
		if (this.table.whiteBall == null) return;
		this.table.lastWhiteBallPos = this.table.whiteBall.position.clone();
		let startPos: cc.Vec2 = null;
		let endPos: cc.Vec2 = null;
		let half: cc.Vec2 = null;
		for (let i = 0; i < this.table.anchors.length; i++) 
		{
			let anchorPos = this.table.anchors[i].convertToWorldSpaceAR(cc.v3());
			let anchorScreenPos: any = this.camera.getWorldToScreenPoint(anchorPos);
			anchorScreenPos = cc.v2(anchorScreenPos.x, anchorScreenPos.y).sub(CanvasOffset.Offset);
			this.anchorScreenPoints[i] = anchorScreenPos;
			if (i == 0) startPos = anchorScreenPos;
			else if (i == 2) endPos = anchorScreenPos;
			else if (i == 4) half = anchorScreenPos;
		}
		this.transverse.x = startPos.x;
		this.transverse.y = startPos.y;
		this.transverse.width = half.x - startPos.x;
		this.transverse.height = half.y - startPos.y;
		this.boundRect.x = startPos.x;
		this.boundRect.y = startPos.y;
		this.boundRect.width = endPos.x - startPos.x;
		this.boundRect.height = endPos.y - startPos.y;
		this.updateFreeKickMaskPos();
		if(this.room.reconnectBall) {
			JTimer.TimeOut(this,20,Fun(() =>this.onReConnectBall(), this));
		}
	}
	protected onKeyDown(evt)
    {
        if (evt.keyCode == cc.macro.KEY.p)
		{
            this.startPerformance(cc.v3(19.71, 5.77, 12.79),-466);
		}else if(evt.keyCode == cc.macro.KEY.o)
		{
			console.log(this.table.whiteBall.position.toString());
			
		}
    }
	public setOptionPlayer(playerID: number) 
	{
		this.putBallEnd = false;
		if(this.room.reconnectBall) return;
		if(this.table.whiteBall)
		{
			if(!this.table.whiteBall.parent)// 白球进洞后需要重新归位
			{
				this.table.ballParent.addChild(this.table.whiteBall);
				this.updateWhiteBallPos(this.table.lastWhiteBallPos,true);
				this.onResetWhiteBall();
				this.hideFreeKick();
			}else 
			{
				if(this.table.isBallDragging)// 玩家在摆球，操作时间到了，还未放下球
				{
					this.table.isBallDragging = false;
					this.updateWhiteBallPos(this.table.lastWhiteBallPos,true);
					this.onResetWhiteBall();
					this.hideFreeKick();
				}
				this.table.lastWhiteBallPos = this.table.whiteBall.position.clone();
			}
		}
		if(this.player.id==playerID&&this.room.gan==0)// 如果是第一杆，刚好是玩家操作
		{
			JTimer.TimeOut(this,10,Fun(() =>this.setFreeKickBall(playerID, true), this));
			return;
		}
		this.setFreeKickBall(-1, false);
	}
	/**白球重新放回原位 */
	private onResetWhiteBall()
	{
		C_Game_PutTheBall.Send(this.table.lastWhiteBallPos,4);
	}

	//重连摆球
	private onReConnectBall()
	{
		this.setFreeKickBall(this.player.id,true);
	}

	public setFreeKickBall(playerID: number, isShow: boolean = true): void 
	{
		if (!this.freeKickMask||!this.table.whiteBall) return;
		this.stopSceneAnim();
		this.stopArrowsAnim();
		this.freeKickMask.clear();
		if (this.freeKickMask) 
		{
			this.freeKickMask.node.off(cc.Node.EventType.TOUCH_START, this.onFreeKickBallTouchEvent, this);
			this.freeKickMask.node.off(cc.Node.EventType.TOUCH_END, this.onFreeKickBallTouchEvent, this);
			this.freeKickMask.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onFreeKickBallTouchEvent, this);
			this.freeKickMask.node.off(cc.Node.EventType.TOUCH_MOVE, this.onFreeKickBallTouchEvent, this);
			if (!isShow) this.freeKickMask.node.removeFromParent();
		}
		if (isShow) 
		{
			if (!this.isCanOption) return;
			if (this.freeKickMask) 
			{
				if(!this.freeKickMask.node.parent)
					dispatchFEvent(new UIEvent(UIEvent.ADD_TO_LAYER, this.freeKickMask.node, null, GameLayer.UI));
				this.freeKickMask.node.on(cc.Node.EventType.TOUCH_START, this.onFreeKickBallTouchEvent, this);
				this.freeKickMask.node.on(cc.Node.EventType.TOUCH_END, this.onFreeKickBallTouchEvent, this);
				this.freeKickMask.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onFreeKickBallTouchEvent, this);
			}
			this.drawFreeKickBall(cc.color(255,255,0,0),25);
			this.playArrowsAnim();
			if(!this.sceneTween) this.playSceneAnim(this.room.gan > 0);
			this.updateFreeKickMaskPos();
			this.updateBallScreenPoints();
		}
	}

	protected updateFreeKickMaskPos()
	{
		if(!this.freeKickMask||!this.freeKickMask.node.parent)return;
		let ballWorldPos = this.table.whiteBall.convertToWorldSpaceAR(cc.v3());
		let ballScreenPos = this.camera.getWorldToScreenPoint(ballWorldPos);
		let pos = this.freeKickMask.node.parent.convertToNodeSpaceAR(ballScreenPos);
		this.freeKickMask.node.setPosition(pos);
	}
	protected onFreeKickBallTouchEvent(evt) 
	{
		if (evt.type == cc.Node.EventType.TOUCH_START) 
		{
			this.table.isBallDragging = true;
			this.isCanDrop = true;
			this.showFreeKick(true);
			this.stopArrowsAnim();
			this.freeKickMask.node.off(cc.Node.EventType.TOUCH_MOVE, this.onFreeKickBallTouchEvent, this);
			this.freeKickMask.node.on(cc.Node.EventType.TOUCH_MOVE, this.onFreeKickBallTouchEvent, this);
			dispatchFEventWith(GameEvent.On_Start_FreeKickBall);
			C_Game_PutTheBall.Send(this.table.whiteBall.position,0);
		} else if (evt.type == cc.Node.EventType.TOUCH_MOVE) 
		{
			this.table.isBallDragging = true;
			let pos = evt.getLocation();
			let ballWorldPos = this.camera.getScreenToWorldPoint(cc.v3(pos.x, pos.y, 0));
			ballWorldPos = this.table.whiteBall.parent.convertToNodeSpaceAR(ballWorldPos);
			pos = this.freeKickMask.node.parent.convertToNodeSpaceAR(pos);
			ballWorldPos.y = this.table.whiteBall.position.y;
			//白球位置
			let whiteWorldPos = this.table.whiteBall.convertToWorldSpaceAR(cc.v3());
			let whiteSceenPos: any = this.camera.getWorldToScreenPoint(whiteWorldPos);
			whiteSceenPos = cc.v2(whiteSceenPos.x, whiteSceenPos.y).sub(CanvasOffset.Offset);
			//取球时时位置
			let temwhiteWorldPos = this.table.whiteBall.parent.convertToWorldSpaceAR(ballWorldPos);
			let temwhiteSceenPos: any = this.camera.getWorldToScreenPoint(temwhiteWorldPos);
			temwhiteSceenPos = cc.v2(temwhiteSceenPos.x, temwhiteSceenPos.y).sub(CanvasOffset.Offset);
			this.isCanDrop = true;
			if (this.room.gan == 0) 
			{//第一杆摆球
				if(!this.sceneTween) this.playSceneAnim(false);
				if (this.transverse.contains(temwhiteSceenPos)) {
					this.freeKickMask.node.setPosition(pos);
					this.updateWhiteBallPos(ballWorldPos,false);					
				} else this.isCanDrop = false;
			} else 
			{
				if(!this.sceneTween) this.playSceneAnim(true);
				if (this.boundRect.contains(temwhiteSceenPos)) {
					this.freeKickMask.node.setPosition(pos);
					this.updateWhiteBallPos(ballWorldPos,false);					
				} else {
					this.isCanDrop = false;
				}
			}
			C_Game_PutTheBall.Send(this.table.whiteBall.position,1);
			for (let i = 0; i < this.table.balls.length; i++) 
			{
				let ball = this.table.balls[i];
				if (!this.ballScreenPoints[ball.name]) continue;
				let distance = PointUtility.Distance(evt.getLocation().sub(CanvasOffset.Offset), this.ballScreenPoints[ball.name]);
				if (distance <= 35) 
				{
					this.isCanDrop = false;
					break;
				}
			}
			this.stopArrowsAnim();
			this.hideFreeKick();
			this.showFreeKick(this.isCanDrop);
			// if (this.isCanDrop) this.drawFreeKickBall(cc.color(255, 255, 255, 120), 60);
			// else this.drawFreeKickBall(cc.color(255, 0, 0, 120), 60);
		} else {

			this.table.isBallDragging = false;
			this.freeKickMask.node.off(cc.Node.EventType.TOUCH_MOVE, this.onFreeKickBallTouchEvent, this);
			this.freeKickMask.node.setContentSize(25, 25);
			this.freeKickMask.clear();
			//////////////
			this.drawFreeKickBall(cc.color(255,255,0,0),25);
			if (!this.isCanDrop) 
			{
				this.updateWhiteBallPos(this.table.lastWhiteBallPos,true);
				this.onResetWhiteBall();// 白球摆球放下的位置存在其他球，需要归位
				this.updateFreeKickMaskPos();
			}else 
			{
				///// 放下球时把球的最后位置设置成
				this.table.lastWhiteBallPos=this.table.whiteBall.position.clone();
				this.updateWhiteBallPos(this.table.whiteBall.position,true);
			}
			this.stopSceneAnim();
			this.hideFreeKick();
			this.playArrowsAnim();
			dispatchFEventWith(GameEvent.On_Stop_FreeKickBall);
			C_Game_PutTheBall.Send(this.table.whiteBall.position,2);
		}
	}
	private onPlayerPutTheBall(evt:FEvent)
	{
		// 0:开始摆球(拿起白球)\n    1：摆球中(拖动白球)\n    2:结束摆球(放下白球)  4：白球进洞后归位，服务端机器人使用(客户端不做同步)
		if(evt.data.dropStatus==4)return;// 客户端告诉服务端白球归位专用状态，无需同步
		if(evt.data.simulate)return;// 使用模拟
		let pos = PointUtility.Object2Point(cc.v3(),evt.data.position);
		
		if(evt.data.dropStatus==0)this.table.isBallDragging = true;
		else if(evt.data.dropStatus==2)// 
		{
			this.table.isBallDragging = false;
			this.table.lastWhiteBallPos = pos.clone();
			if(evt.data.playerID<0)// 机器人摆球
			{
				this.startPerformance(pos,evt.data.playerID);
				return;
			}
		}else if(this.table.isBallDragging==false)return;
		// trace("同步球的位置=====》",this.table.lastWhiteBallPos.toString(),this.table.whiteBall.position.toString(),evt.data.dropStatus);
		this.updateWhiteBallPos(pos,evt.data.dropStatus==2);

		this.putBallEnd = evt.data.dropStatus==2;
	}
	/**机器人开始表演 */
	public startPerformance(pos:cc.Vec3,playerID)
	{
		if(pos==null)return;
		this.table.whiteBall.stopAllActions();
		let tween:any = cc.tween(this.table.whiteBall).delay(0.5).to(1,{x:pos.x,z:pos.z});
		tween.call(()=>
		{
			// simulate
			this.updateWhiteBallPos(pos,true);
			dispatchFEventWith(GameEvent.On_Player_PutTheBall,{simulate:true,playerID:playerID,dropStatus:2});
		}).start();
		let fun = tween._actions[1].update.bind(tween._actions[1]);
		tween._actions[1].update = (dt)=>
		{
			fun(dt);
			this.table.whiteBall.getComponent(GameBall).update();
		};
	}
	
	protected updateWhiteBallPos(pos:cc.Vec3,isEnableRigi:boolean)
	{
		this.rigidBodyEnable = false;
		this.table.whiteBall.setPosition(pos);
		Physics3DUtility.SetNodeWorld(this.table.whiteBall,pos);
		if(isEnableRigi)this.rigidBodyEnable = true;
		Physics3DUtility.IsEnableSendSleep = false;
		Physics3DUtility.StartUpdateFrame();
		if(Physics3DUtility.IsSleeping())
		{
			Physics3DUtility.IsEnableSendSleep = true;
			Physics3DUtility.StopUpdateFrame();
		}
	}
	/**物理休眠了 */
	protected onPhysicSleep()
	{
		if(this.putBallEnd) {
			this.putBallEnd = false;
			let collider: cc.Collider3D = this.table.whiteBall.getComponent(cc.Collider3D);
			let bodyPos = collider.shape['sharedBody'].body.position;
			let bodyRot = collider.shape['sharedBody'].body.quaternion;
			let colliderPos = cc.v3(bodyPos.x, bodyPos.y, bodyPos.z);
			let colliderRot = cc.quat(bodyRot.x, bodyRot.y, bodyRot.z, bodyRot.w);
			C_Game_SyncPutBall.Send(this.table.whiteBall.position,2,colliderRot,colliderPos);
		}
		setTimeout(() => {
			Physics3DUtility.IsEnableSendSleep = true;
		}, 0);
	}
	/**击球 */
	public shoot(playerID: number, angle: number, force: cc.Vec3, velocity: cc.Vec3, powerScale: number): void 
	{
		JTimer.ClearTimeOut(this);
		this.setFreeKickBall(-1, false);
	}

	/**画任意球 */
	protected drawFreeKickBall(color: cc.Color, size: number) 
	{
		this.freeKickMask.clear();
		this.freeKickMask.fillColor = color;//cc.color(255,255,255,120);
		this.freeKickMask.circle(0, 0, size);
		this.freeKickMask.fill();
		this.freeKickMask.node.setContentSize(60, 60);
	}
	/**播放箭头动画 */
	protected playArrowsAnim()
	{
		this.freeKickNode.active = true;
		this.freeKickNode.getComponent(cc.Animation).play();
		//更新箭头坐标
		let anchorPos = this.table.whiteBall.convertToWorldSpaceAR(cc.v3());
		let anchorScreenPos: any = this.camera.getWorldToScreenPoint(anchorPos);
		anchorScreenPos = cc.v2(anchorScreenPos.x, anchorScreenPos.y).sub(CanvasOffset.Offset);
		let freeKickPos = this.freeKickNode.convertToWorldSpaceAR(cc.v2(0, 0)).sub(CanvasOffset.Offset);
		this.freeKickNode.setPosition(anchorScreenPos.x - freeKickPos.x,anchorScreenPos.y - freeKickPos.y);
	}
	/**停止箭头动画 */
	protected stopArrowsAnim()
	{
		this.freeKickNode.getComponent(cc.Animation).stop();
		this.freeKickNode.active = false;
		this.freeKickNode.setPosition(0,0);
	}
	/**播放屏幕动画 */
	protected playSceneAnim(isFullScene)
	{
		let aniNode = null;
		if(isFullScene) {
			this.fullScene.active = true;
			aniNode = this.fullScene;
		}
		else {
			this.halfScene.active = true;
			aniNode = this.halfScene;
		}
		aniNode.opacity = 50;
		this.sceneTween = cc.tween(aniNode)
                .to(0.5, { opacity: 100 })
				.to(0.5, { opacity: 50 })
                .union()
                .repeatForever()
                .start();
	}
	/**停止屏幕动画 */
	protected stopSceneAnim()
	{
		if(this.sceneTween) {
            this.sceneTween.stop();
            this.sceneTween = null;
        }
		this.fullScene.active = false;
		this.halfScene.active = false;
	}
	/**显示摆球框 */
	protected showFreeKick(isCanDrop)
	{
		let node = null;
		if(isCanDrop) {
			this.freeKickBall.active = true;
			node = this.freeKickBall;
		}
		else {
			this.disableBig.active = true;
			node = this.disableBig;
		}
		//更新摆球框坐标
		let anchorPos = this.table.whiteBall.convertToWorldSpaceAR(cc.v3());
		let anchorScreenPos: any = this.camera.getWorldToScreenPoint(anchorPos);
		anchorScreenPos = cc.v2(anchorScreenPos.x, anchorScreenPos.y).sub(CanvasOffset.Offset);
		let freeKickPos = node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(CanvasOffset.Offset);
		node.setPosition(anchorScreenPos.x - freeKickPos.x,anchorScreenPos.y - freeKickPos.y);
	}
	/**隐藏摆球框 */
	protected hideFreeKick()
	{
		this.freeKickBall.active = false;
		this.disableBig.active = false;
		this.freeKickBall.setPosition(0,0);
		this.disableBig.setPosition(0,0);
	}
	/**更新所有的球在屏幕上的坐标 */
	protected updateBallScreenPoints() 
	{
		let vbs = this.table.balls;
		for (let i = 0; i < vbs.length; i++) {
			let ballWorldPos = vbs[i].convertToWorldSpaceAR(cc.v3());

			let ballScreenPos: any = this.camera.getWorldToScreenPoint(ballWorldPos);
			ballScreenPos = cc.v2(ballScreenPos.x, ballScreenPos.y).sub(CanvasOffset.Offset);
			this.ballScreenPoints[vbs[i].name] = ballScreenPos;
		}
	}
	protected set rigidBodyEnable(value: boolean) 
	{
		if(this.table.whiteBall==null)return;
		let rigi = this.table.whiteBall.getComponent(cc.RigidBody3D);
		let collider = this.table.whiteBall.getComponent(cc.SphereCollider3D);
		if(rigi.enabled==value)return;
		rigi.enabled = value;
		collider.enabled = value;
	}
	protected onSelectedShotPower(evt) {
		// 击球隐藏自由球的功能
		this.setFreeKickBall(-1, false);
	}
	/**玩家当前是否可击球 */
	protected get isCanOption(): boolean { return this.player.id == this.room.optPlayer }
}