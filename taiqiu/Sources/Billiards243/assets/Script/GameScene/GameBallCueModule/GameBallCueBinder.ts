import { FBinder } from "../../../Framework/Core/FBinder";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { FEvent } from "../../../Framework/Events/FEvent";
import { UIEvent } from "../../../Framework/Events/UIEvent";
import { AudioManager } from "../../../Framework/Managers/AudioManager";
import { EventManager } from "../../../Framework/Managers/EventManager";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { getCamera } from "../../../Framework/Utility/dx/getCamera";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { getPointA2BAngle } from "../../../Framework/Utility/dx/getPointA2BAngle";
import { stageHeight } from "../../../Framework/Utility/dx/stageHeight";
import { stageWidth } from "../../../Framework/Utility/dx/stageWidth";
import { PointUtility } from "../../../Framework/Utility/PointUtility";
import { PlayGameID } from "../../Common/PlayGameID";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { C_Game_ShotBall } from "../../Networks/Clients/C_Game_ShotBall";
import { C_Game_UpdateBallArm } from "../../Networks/Clients/C_Game_UpdateBallArm";
import { PlayerCueVO } from "../../VO/PlayerCueVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { TableVO } from "../../VO/TableVO";
import GameBall from "../GameBall";
import { CanvasOffset } from "../../Common/CanvasOffset";
import { StoreManager } from "../../../Framework/Managers/StoreManager";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { CuePropertyVO } from "../../VO/CuePropertyVO";
import { CDragonBones } from "../../../Framework/Components/CDragonBones";
import { ConfigVO } from "../../VO/ConfigVO";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { convertToScreen } from "../../../Framework/Utility/dx/convertToScreen";

/**
 * 桌子球杆操作类
 */
export class GameBallCueBinder extends FBinder
{
    public static ClassName:string = "GameBallArmBinder";
    /**发球角度 */
	private _shootAngle: number = 0;
	public get shootAngle(): number {return this._shootAngle;}
	
	/**玩家自己 */
	private player:PlayerVO = null;
	private room:RoomVO = null;
	/**瞄准辅助线 */
	protected boresightNode:cc.Node = null;
	protected boresight:cc.Graphics = null;
	/**禁用标识 */
	private disableImg:cc.Node = null;
	private disableCircle:cc.Node = null;

	
	protected camera:cc.Camera = null;
	// /**延长线长度 最低20 */
	// private extendLength = 20;
	private _isCanShowCue: boolean = false;
	public get isCanShowCue(): boolean {return this._isCanShowCue;}
	protected table:TableVO = null;
	/**击球点位置 */
	protected contactPoint:cc.Vec2 = cc.v2(0,0);
	private targetPosition:cc.Vec2 = cc.v2(0,0);
	private contactAngle:number = 0;
	private extendGasser:number = 0;
	/**加塞角度 */
	protected gasserAngle:number = 0;
	// private extendPower:number = 0;
	protected fireCueNode:cc.Node = null;
	protected cueAnim:dragonBones.ArmatureDisplay = null;
	protected fireCuePos:cc.Vec3 = null;
	protected fireMaxDistance:number = 80;
	protected syncTimer:JTimer = null;
	protected currentCueLevel:number = 1;
	private isTouchMoved:boolean = false;
	private previousAngle = 0;


	public set shootAngle(value: number) 
	{
		if(value==this._shootAngle)return;
		this._shootAngle = value;
		dispatchFEventWith("onBallCueRotateChange",value);
	}
	public set isCanShowCue(value: boolean) 
	{
		this._isCanShowCue = value;
		if(!this.asset)return;
		this.asset.active = value;
		if(value)
		{
			this.fireCueNode.setPosition(this.fireCuePos);
			this.updateBallCuePosition();
			this.updateBallCueAngle();
		}
	}
    public initViews()
    {
		super.initViews();
		this.camera = getCamera("3D Camera");
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.fireCueNode = getNodeChildByName(this.asset,"Cue");
		this.cueAnim = getNodeChildByName(this.fireCueNode,"CueAnim",dragonBones.ArmatureDisplay);
		this.fireCuePos = this.fireCueNode.position.clone();
		this.isCanShowCue = this.isCanShowCue;
		this.boresightNode = new cc.Node("boresight");
		this.boresight = this.boresightNode.addComponent(cc.Graphics);
		this.boresight.lineWidth = 3;
		this.boresight.strokeColor = cc.Color.WHITE;
		this.boresight.fillColor = cc.color(0,255,0,255);
		dispatchFEvent(new UIEvent(UIEvent.ADD_TO_LAYER,this.boresightNode,{x:-stageWidth()/2,y:-stageHeight()/2},GameLayer.UI));
	}
	protected addEvents()
	{
		super.addEvents();
		addEvent(this,GameEvent.On_Start_FreeKickBall,this.onStartFreeKickBall);
		addEvent(this,GameEvent.On_Stop_FreeKickBall,this.onStopFreeKickBall);
		addEvent(this,GameEvent.On_Player_PutTheBall,this.onPlayerPutTheBall);
		addEvent(this,LobbyEvent.Server_UseCue,this.onUseCue);
		addEvent(this,LobbyEvent.Server_DefendCue,this.onUseCue);
		addEvent(this, GameEvent.Table_Init_Complete, this.onGetTableInfo);
		
	}

	
	protected onGetTableInfo()
	{
		if(!this.isCanOption)return;
		this.updateBallCuePosition();
		if(this.player.id==this.room.optPlayer && this.room.isReconnection)
		{
			this.setPlayBall();
		}
	}
    /**添加界面操作事件 */
	protected addOptionEvents()
	{
		cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_START,this.onBallCueTouchEvent,this);
		cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_MOVE,this.onBallCueTouchEvent,this);
		cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_END,this.onBallCueTouchEvent,this);
		cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onBallCueTouchEvent,this);
		addEvent(this,GameEvent.Player_Power_Option,this.onSelectedShotPower);
		addEvent(this,GameEvent.Player_FineTurning_Option,this.onFineTurningAngle);
		addEvent(this,GameEvent.Update_ContactPoint,this.onUpdateContactPoint);
	}
	/**玩家摆球操作 */
	private onPlayerPutTheBall(evt)
	{
		if(evt.data.dropStatus==2)// 摆球完成后显示球杆
		{
			if(evt.data.playerID>0)
			{
				setTimeout(() => 
				{
					dispatchFEventWith(GameEvent.On_Fixed_BallScreenPos);
					this.isCanShowCue = true;
				}, 0);
			}else
			{
				if(evt.data.simulate)// 机器人模拟摆球
				{
					dispatchFEventWith(GameEvent.On_Fixed_BallScreenPos);
					setTimeout(() =>this.isCanShowCue = true, 1);
					this.isCanShowCue = true;
				}else this.hideBallCue();
			}
		}else this.hideBallCue();// 摆球时需要隐藏球杆
	}
	/**玩家自己开始摆球，隐藏球杆 */
	protected onStartFreeKickBall()
	{
		this.hideBallCue();
	}
	/**玩家自己摆球完成，显示球杆 */
	protected onStopFreeKickBall()
	{
		dispatchFEventWith(GameEvent.On_Fixed_BallScreenPos);
		this.isCanShowCue = true;
		if(this.player.id!=this.room.optPlayer)return;
		this.removeOptionEvents();
		this.addOptionEvents();
	}
    /**移除界面操作事件 */
	protected removeOptionEvents()
	{
		this.stopSyncTimer();
		this.fireCueNode.stopAllActions();
		cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_START,this.onBallCueTouchEvent,this);
		cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_MOVE,this.onBallCueTouchEvent,this);
		cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_END,this.onBallCueTouchEvent,this);
		cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onBallCueTouchEvent,this);
		EventManager.removeEvent(this,GameEvent.Player_Power_Option,this.onSelectedShotPower);
		EventManager.removeEvent(this,GameEvent.Player_FineTurning_Option,this.onFineTurningAngle);
	}
	protected onUpdateContactPoint(evt:FEvent)
	{
		// this.contactPoint = evt.data.position;
		this.gasserAngle = evt.data.angle;
		this.contactAngle = evt.data.pointAngle;
	}
	/**在操作界面微调击球角度 */
	protected onFineTurningAngle(evt:FEvent)
	{
		if(evt.data==null)
		{
			this.fixedBoresightAngle();
			return;
		}
		let tempAngle = ((this.shootAngle+evt.data*0.005)+360)%360;
		this.shootAngle = tempAngle%180-Math.floor(tempAngle/180)*180;
		let angle = cc.v3(0,this.shootAngle,0);
		let ballPos = this.table.ballScreenPoints[this.table.whiteBall.name];
		this.targetPosition = PointUtility.LengthenPoint(ballPos,this.shootAngle,100);
		this.updateBallCueAngle(angle);
		this.drawBoresight();
		this.onSendSyncBallCueInfo();
	}
	/**发球 */
	protected onSelectedShotPower(evt:FEvent)
	{
		if(!this.isCanOption)return;
		let powerScale = evt.data.power;
		let isFire = evt.data.isFire;// 是否施放
		if(!isFire)
		{
			let pos = cc.v3(-powerScale*this.fireMaxDistance,0,0).addSelf(this.fireCuePos);
			this.fireCueNode.setPosition(pos);
			return;
		}
		this.removeOptionEvents();// 不允许连续向服务器发送多次击球事件
		this.hideDisableImg();
		this.contactPoint = cc.v2(this.contactAngle,this.extendGasser);
		if(this.room.gameId==PlayGameID.LuckBall||this.player.id==0)// 幸运一球是个单机游戏// 在测试场景中
		{
			let data = {playerID:this.player.id,angle:this.shootAngle,force:this.table.shootForce,velocity:null,
				powerScale:powerScale,contactPoint:this.contactPoint,gasserAngle:this.gasserAngle,hitPoint:this.hitBallPos,hitAngle:this.hitBallAngle};
			dispatchFEventWith(GameEvent.Player_ShotBall,data);
			return;
		}
		// this.hideBallCue();// 隐藏球杆，直到下一次操作才显示
		C_Game_ShotBall.Send(this.shootAngle,this.table.shootForce,null,powerScale,this.contactPoint,this.gasserAngle,this.hitBallPos,this.hitBallAngle);
	}
	/**设置当前击球的玩家 */
	public setOptionPlayer(playerID:number)
	{
		if(this.table.whiteBall==null)return;
		this.hideDisableImg();
		this.removeOptionEvents();
		this.isCanShowCue = true;
		setTimeout(() => this.updateBallCuePosition(), 1);
		this.boresight.clear();
		this.gasserAngle = 0;
		this.contactPoint = cc.v2(0,0);
		this.contactAngle = 0;
		this.isTouchMoved = false;
		this.hitBallPos = null;
		this.hitBallAngle = 0;
		if(this.player.id==playerID)
		{
            this.addOptionEvents();
			this.updateBallCueAngle();
			this.setPlayBall();
		}
		this.setCue(playerID);
		if(playerID<0)// 机器人
		{
			if(this.table.whiteBall&&this.table.whiteBall.parent)
			{
				JTimer.ClearTimeOut(this);
				JTimer.TimeOut(this,300,Fun(this.startPerformance,this));
			}
		}
	}
	/**机器人开始表演 */
	private startPerformance()
	{
		JTimer.ClearTimeOut(this);
		let pos1 = convertToScreen(this.table.whiteBall);
		let pos2 = convertToScreen(this.table.balls[Math.floor(this.table.balls.length*Math.random())]);
		let angle = getPointA2BAngle(pos1,pos2);//Math.random()*360-180;
		this.updateBallCuePosition();
		this.updateBallCueAngle(cc.v3(0,angle,0),true);
		let t = Math.floor(Math.random()*300)+2200;
		JTimer.TimeOut(this,t,Fun(this.startPerformance,this));
	}
	//设置初始打的球
	protected setPlayBall()
	{
		if(this.room.gameId != PlayGameID.EightBall) return;
		let strikeBalls = this.room.players.length == 0 ? [] : this.room.players[0].strikeBalls;
		let whiteBallPos = this.table.ballScreenPoints[this.table.whiteBall.name].clone();
		let ballName = "";
		let ballList = [];
		for (let i = 0; i < this.table.balls.length; i++) 
		{
			let id = this.table.balls[i].getComponent(GameBall).id;
			if(this.table.pocketBalls.indexOf(id)!=-1) continue; //排除已经进洞的球
			ballList.push(id);
		}
		//在可以击打球中选取一个前方没有障碍的球
		for(let j = 0; j < strikeBalls.length; j++) {
			let count = 0;
			for(let i = 0; i < ballList.length; i++) {
				count++;
				let id = ballList[i];
				let strikeId = strikeBalls[j];
				if(id == strikeId) continue;
				let ballPos = this.table.ballScreenPoints[this.table.balls[i].name].clone();
				if(ballList.indexOf(strikeId) == -1) continue;
				let targetPos = this.table.ballScreenPoints[this.table.balls[ballList.indexOf(strikeId)].name].clone();
				//排除AB两点矩形之外的球
				let xMax,yMax,xMin,yMin = 0;
				if(targetPos.x >= whiteBallPos.x){
					xMax = targetPos.x;
					xMin = whiteBallPos.x;
				}else{
					xMax = whiteBallPos.x;
					xMin = targetPos.x;
				}
				if(targetPos.y >= whiteBallPos.y){
					yMax = targetPos.y;
					yMin = whiteBallPos.y;
				}else{
					yMax = whiteBallPos.y;
					yMin = targetPos.y;
				}
				xMax+=this.table.ballRadius;
				yMax+=this.table.ballRadius;
				xMin-=this.table.ballRadius;
				yMin-=this.table.ballRadius;
				if(ballPos.x>xMax || ballPos.x<xMin || ballPos.y>yMax || ballPos.y<yMin) continue;
				
				//查询其他球距离白球到目标球距离，如果距离小于球半径，说明目标球前方有阻挡
				let val = this.distanceToSegment(ballPos,whiteBallPos,targetPos);
				// let val = cc.Intersection.pointLineDistance(ballPos,whiteBallPos,targetPos,true);
				if(this.table.ballRadius*2 >= val) {
					break;
				}
			}
			if(count == ballList.length) {
				if(ballList.indexOf(strikeBalls[j]) == -1) continue;
				ballName = this.table.balls[ballList.indexOf(strikeBalls[j])].name;
				break;
			};
		}
		//自动瞄准可以击打的球
		if(ballName == "") return;
		this.targetPosition = this.table.ballScreenPoints[ballName].clone();
		this.shootAngle = getPointA2BAngle(whiteBallPos,this.targetPosition);
		let angle = cc.v3(0,this.shootAngle,0);
		this.updateBallCueAngle(angle);
		this.drawBoresight();
		this.onSendSyncBallCueInfo();
	}
	/**
	 * 点到直线的距离
	 */
	private distanceToSegment(o:cc.Vec2, p1:cc.Vec2, p2:cc.Vec2) {
        //平行Y轴
        if( p1.x == p2.x ) return Math.abs(o.x-p1.x);
        //平行X轴
        if( p1.y == p2.y ) return Math.abs(o.y-p1.y);
        let a = p2.y - p1.y;
        let b = p1.x-p2.x;
        let c =  p1.y*(p2.x-p1.x) - p1.x*(p2.y-p1.y);
        let t = a*o.x+b*o.y+c;
        let up = a*o.x+b*o.y+c;
        let down = a*a+b*b;
        let r =  Math.abs(up)/Math.sqrt(down);
        return r;
	}
	//获取球杆
	protected getPlayerCue(playerID):any
	{
		if(playerID == this.player.id)
			return this.getMyUseCue();
		else {
			for (let i = 0; i < this.room.players.length; i++) {
				if(this.room.players[i].id == playerID) {
					return this.room.players[i].cueId;
				}
			}
			return null;
		}
	}
	//获取我使用的球杆
	private getMyUseCue()
	{
		this.setCueProperty();
		let playerCue = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
		for(let i = 0; i < playerCue.myCues.length; i++) {
			if(playerCue.myCues[i].isUse) {
				return playerCue.myCues[i].cueID;
			}
		}
		return null;
	}
	//切换、维护球杆
	private onUseCue()
	{
		this.setCueProperty();
		if(this.room.optPlayer == this.player.id)
			 this.setCue(this.player.id);
	}
	//设置球杆属性
	private setCueProperty()
	{
		if(this.player.id==0)return;
		let cueProperty:CuePropertyVO = GameDataManager.GetDictData(GameDataKey.CueProperty,CuePropertyVO);
		cueProperty.updateCueProperty();
		this.table.boresight = Math.floor(cueProperty.aim*0.5);
		this.table.shootForce = cc.v3(250+cueProperty.power*3,0,0);
		this.extendGasser = cueProperty.gase*0.1;
	}
	//设置击球球杆
	private setCue(playerID:number)
	{
		let cueInfo = this.getPlayerCue(playerID);
		if(cueInfo!=null)
		{
			let playerCue:PlayerCueVO = GameDataManager.GetDictData(GameDataKey.PlayerCue,PlayerCueVO);
			let index = Math.floor(cueInfo/100) * 100 + 1;
			let cueLevel = playerCue.getCueRes(index);
			if(cueLevel<=0)cueLevel = 1;
			if(this.currentCueLevel==cueLevel)return;
			this.currentCueLevel = cueLevel;
			CDragonBones.setDragonBones(this.cueAnim,`DragonBones/Cue/cue${cueLevel}/cue${cueLevel}_ske`,`DragonBones/Cue/cue${cueLevel}/cue${cueLevel}_tex`,
            	`cue${cueLevel}`,`cue${cueLevel}`,0);
		}
	}
	/**击球 */
	public shoot(playerID:number,angle:number,force:cc.Vec3,velocity:cc.Vec3,powerScale:number,contactPoint:cc.Vec2,gasserAngle:number):void
	{
		JTimer.ClearTimeOut(this);
		this.updateBallCuePosition();
		this.fireCueNode.stopAllActions();
		this.asset.stopAllActions();
		if(playerID==this.player.id)
		{
			this.updateBallCueAngle(cc.v3(0,angle,0));
			cc.tween(this.fireCueNode).
				to(0.2,{x:this.fireCuePos.x,y:this.fireCuePos.y},{easing:'quartOut'}).
				call(this.onCueHitBall.bind(this)).start();
		}else
		{
			let pos = cc.v3(-powerScale*this.fireMaxDistance,0,0).addSelf(this.fireCuePos);
			let tw1 = cc.tween().to(0.15,{x:pos.x,y:pos.y},{easing:'sineIn'});
			let tw2 = cc.tween().to(0.15,{x:this.fireCuePos.x,y:this.fireCuePos.y},{easing:'quartOut'});
			if(playerID<0)// playerid小于0说明是机器人
			{
				cc.tween(this.asset).to(0.1,{angle:angle}).call(()=>
				{
					cc.tween(this.fireCueNode).sequence(tw1,tw2).call(this.onCueHitBall.bind(this)).start();
				}).start();
			}else 
			{
				this.updateBallCueAngle(cc.v3(0,angle,0));
				cc.tween(this.fireCueNode).sequence(tw1,tw2).call(this.onCueHitBall.bind(this)).start();
			}
		}
	}
	/**击球动画球杆击中了球时播放击球音效和隐藏球杆 */
	protected onCueHitBall()
	{
		AudioManager.PlayEffect("CueHit");
		this.hideBallCue();
	}
	/**拖动球杆，瞄准不同的击球方向*/
    protected onBallCueTouchEvent(evt:cc.Event.EventTouch)
	{
		if(evt.type==cc.Node.EventType.TOUCH_START)
		{
			this.isTouchMoved = false;
			let ballScreenPos = this.table.ballScreenPoints[this.table.whiteBall.name].clone();
			this.previousAngle = getPointA2BAngle(ballScreenPos,evt.getLocation());
		}
		else if(evt.type==cc.Node.EventType.TOUCH_MOVE)
		{
			let p1 = evt.getLocation().sub(evt.getStartLocation());
			if(Math.abs(p1.y)>5)this.isTouchMoved = true;
			if(this.isTouchMoved)
			{
				let ballScreenPos = this.table.ballScreenPoints[this.table.whiteBall.name].clone();
				let tempAngle = getPointA2BAngle(ballScreenPos,evt.getLocation());
				let offsetAngle = tempAngle-this.previousAngle;
				let t = ((this.shootAngle+offsetAngle)+360)%360;
				this.shootAngle = t%180-Math.floor(t/180)*180;
				let angle = cc.v3(0,this.shootAngle,0);
				this.targetPosition = PointUtility.LengthenPoint(ballScreenPos,this.shootAngle,100);
				this.updateBallCueAngle(angle);
				this.drawBoresight();
				this.startSyncTimer();
				this.previousAngle = tempAngle;
			}
		}else
		{
			this.stopSyncTimer();
			if(!this.isCanShowCue)return;
			// this.fixedBoresightAngle();
			if(!this.isTouchMoved)
			{
				this.calculateBallCueRotation(evt.getLocation().clone().sub(CanvasOffset.Offset));
				this.drawBoresight();
			}
			this.isTouchMoved = false;
			this.onSendSyncBallCueInfo();
		}
	}
	/**修正在极限角度切球时的问题 */
	protected fixedBoresightAngle(offset?:number)
	{
		while(Math.abs(this.glotAngle)>=86)
		{
			// console.log("修正瞄准角度>>>>>>>",this.hitBallAngle);
			if(!offset)offset = Math.random()>0.5?0.1:-0.1;
			let angle = this.shootAngle+offset;
			let ballPos = this.table.ballScreenPoints[this.table.whiteBall.name];
			this.targetPosition = PointUtility.LengthenPoint(ballPos,angle,100);
			this.updateBallCueAngle(cc.v3(0,angle,0));
			this.drawBoresight();
		}
	}
	/**计算球杆旋转角度 */
	protected calculateBallCueRotation(pos:cc.Vec2)
	{
		this.targetPosition = pos;
		let ballScreenPos = this.table.ballScreenPoints[this.table.whiteBall.name].clone();
		this.shootAngle = getPointA2BAngle(ballScreenPos,pos);
        this.updateBallCueAngle();
		this.updateBallCuePosition();
	}
	/**启动向服务器发送同步瞄球的消息的定时器，500ms发送一次 */
	protected startSyncTimer()
	{
		if(this.room.gameId==PlayGameID.LuckBall)return;// 幸运一球是个单机游戏
		if(this.syncTimer==null)
		{
			this.syncTimer = this.addObject(JTimer.GetTimer(500));
			this.syncTimer.addTimerCallback(this,this.onSendSyncBallCueInfo);
		}
		if(this.syncTimer.running)return;
		this.syncTimer.start();
	}	
	/**发送球杆操作的消息 */
	protected onSendSyncBallCueInfo()
	{
		if(this.room.gameId==PlayGameID.LuckBall)return;// 幸运一球是个单机游戏
		C_Game_UpdateBallArm.Send(cc.v3(0,this.asset.angle,0),this.asset.position);
	}
	/**停止球杆操作定时器 */
	protected stopSyncTimer()
	{
		if(this.syncTimer==null)return;
		this.syncTimer.stop();
	}
	/**更新球杆位置 */
	public updateBallCuePosition(ballPos?:cc.Vec2)
	{
		if(!this.table.whiteBall||!this.isCanShowCue)return;
		if(ballPos==null)
		{
			ballPos = this.table.ballScreenPoints[this.table.whiteBall.name].clone();
			ballPos.addSelf(cc.v2(-stageWidth()*0.5,-stageHeight()*0.5));
		}
		this.asset.setPosition(ballPos);
	}
	/**更新球杆角度 */
	public updateBallCueAngle(angle?:cc.Vec3,isRotEffect:boolean=false)
	{
		if(!this.table.whiteBall||!this.isCanShowCue)return;
		if(angle==null)angle = cc.v3(0,this.shootAngle,0);
		else this.shootAngle = angle.y;
		this.asset.stopAllActions();
		if(isRotEffect)cc.tween(this.asset).to(0.2,{angle:angle.y}).start();
		else this.asset.angle = angle.y;
	}
    /**隐藏球杆 */
    public hideBallCue()
    {
		this.isCanShowCue = false;// 隐藏球杆，直到下一次操作才显示
		if(!GameDataManager.GetDictData(GameDataKey.Config,ConfigVO).isDebugBoresig)
		{
			if(this.boresight)
				this.boresight.clear();
		}
		this.removeOptionEvents();
	}
	/**画边界辅助线 */
	protected drawAssistLine()
	{
		let ballRadius = this.table.ballRadius;//-0.4;
		//白球位置
		let whiteSceenPos = this.table.ballScreenPoints[this.table.whiteBall.name].clone();
		//白球临边长度
		let whiteLength =  this.table.anchorScreenPoints[1].x - whiteSceenPos.x;
		let result = whiteLength / Math.cos(cc.misc.degreesToRadians(this.shootAngle));
		let duibianLength = result * Math.sin(cc.misc.degreesToRadians(this.shootAngle));
		
		let calculate = ()=>
		{
			result = whiteLength / Math.cos(cc.misc.degreesToRadians(90-this.shootAngle));
			if(this.shootAngle < 0) 
			{
				let angle = this.shootAngle + 90
				result = whiteLength / Math.cos(cc.misc.degreesToRadians(angle));
			}
		}
		let upLength = this.table.anchorScreenPoints[3].y - whiteSceenPos.y;
		let downLength = (this.table.anchorScreenPoints[3].y - this.table.anchorScreenPoints[0].y) - (this.table.anchorScreenPoints[3].y - whiteSceenPos.y);
		if(Math.abs(this.shootAngle) > 90)
		{
			whiteLength =  (this.table.anchorScreenPoints[1].x - this.table.anchorScreenPoints[0].x) - (this.table.anchorScreenPoints[1].x - whiteSceenPos.x);
			let angle = 180 - this.shootAngle;
			result = whiteLength / Math.cos(cc.misc.degreesToRadians(angle));
			duibianLength = result * Math.sin(cc.misc.degreesToRadians(this.shootAngle));
			
			if (this.shootAngle >= 0 && Math.abs(duibianLength)  > upLength)
			{
				whiteLength = upLength;
				calculate()
			}else if(this.shootAngle < 0 && Math.abs(duibianLength)  > downLength)
			{
				whiteLength = downLength;
				calculate()
			}
		}
		else if (this.shootAngle >= 0 && Math.abs(duibianLength)  > upLength)
		{
			whiteLength = upLength;
			calculate()
		}else if(this.shootAngle < 0 && Math.abs(duibianLength)  > downLength)
		{
			whiteLength = downLength;
			calculate()
		}
		this.drawLine(PointUtility.LengthenPoint(whiteSceenPos,this.shootAngle,ballRadius),this.shootAngle,result-ballRadius,false,0,true,ballRadius);
	}
	/**画四条边界线 */
	protected drawBorderLine(){
		for (let i = 0; i < 4; i++){
			let index = i + 1 == 4 ? 0 : i + 1;
			let ABAngle = getPointA2BAngle(this.table.anchorScreenPoints[i],this.table.anchorScreenPoints[index]);
			let offsetPos = this.table.anchorScreenPoints[index].sub(this.table.anchorScreenPoints[i]);
			let c = Math.sqrt(offsetPos.x*offsetPos.x+offsetPos.y*offsetPos.y);
			this.drawLine(this.table.anchorScreenPoints[i],ABAngle,c,false,0,false,0);
		}
	}
	/**当前瞄准线的瞄准角度 */
	private hitBallAngle:number = 0;
	private hitBallPos:cc.Vec2 = null;
	private glotAngle:number = 0;

	/**画瞄准线 */
	protected drawBoresight()
	{
		this.hideDisableImg();
		let ballRadius = this.table.ballRadius;//-0.4;
		this.boresight.clear();
		let whiteBallPos = this.table.ballScreenPoints[this.table.whiteBall.name];
		let isDraw = false;
		let shortLineLength = 0;
		this.hitBallPos = null;
		this.hitBallAngle = 0;
		this.glotAngle = 0;
		let strikeBalls = this.room.players.length == 0 ? [] : this.room.players[0].strikeBalls;
		for (let i = 0; i < this.table.balls.length; i++) 
		{
			let id = this.table.balls[i].getComponent(GameBall).id;
			if(this.table.pocketBalls.indexOf(id)!=-1) continue; //排除已经进洞的球
			let ballPos = this.table.ballScreenPoints[this.table.balls[i].name];
			let offsetPos = ballPos.sub(whiteBallPos);
			// AB两点的角度和距离
			let ABAngle = getPointA2BAngle(whiteBallPos,ballPos);
			let c = Math.sqrt(offsetPos.x*offsetPos.x+offsetPos.y*offsetPos.y);
			let A = ABAngle-this.shootAngle;
			A = (A+360)%360;
			// if(A<90)ballRadius-=0.2;
			if(A>=70&&A<=290) continue;// 大于80度的夹角
			let angleA = cc.misc.degreesToRadians(A);
			let a = Math.tan(angleA)*c;
			let b = c/Math.cos(angleA);
			// if(Math.abs(a)>this.ballR*2) continue;// 垂直相交线不在两个球的直径内
			b = PointUtility.getInsertPointBetweenCircleAndLine(whiteBallPos.x,whiteBallPos.y,this.targetPosition.x,this.targetPosition.y,ballPos.x,ballPos.y,ballRadius*2,whiteBallPos)
			if (shortLineLength > 0 && b >= shortLineLength || b == 0) continue;
			shortLineLength = b;
			let posB = PointUtility.LengthenPoint(whiteBallPos,this.shootAngle,b);
			this.boresight.clear();
			this.boresight.circle(posB.x,posB.y,ballRadius);
			this.hideDisableImg();
			if(strikeBalls.length > 0 && strikeBalls.indexOf(id)==-1 && this.room.gameId == PlayGameID.EightBall)
				this.setDisableImg(ballPos,posB);
			let originPos = PointUtility.LengthenPoint(whiteBallPos,this.shootAngle,ballRadius);
			let targetPos = PointUtility.LengthenPoint(originPos,this.shootAngle,b-ballRadius);
			// console.log(b,i)
			if (b > ballRadius*2)
				this.drawLine(originPos,this.shootAngle,b-ballRadius*2,false,0,false,0);
			let angle = getPointA2BAngle(targetPos,ballPos);
			this.hitBallPos = targetPos.clone();
			this.hitBallAngle = angle;
			let curRangle = angle - this.shootAngle;
			if (Math.abs(curRangle) > 270) curRangle = Math.abs(Math.abs(curRangle) - 360);
			this.glotAngle = curRangle;
			let curLength = this.table.boresight - Math.abs(curRangle) / 2;
			if(curLength > this.table.boresight - 10) 
				curLength = this.table.boresight - 10;
			if(curLength < 0) curLength = 0;
			let distance = PointUtility.Distance(targetPos,ballPos);
			let extendPos = PointUtility.LengthenPoint(targetPos,angle,distance+ballRadius+2);
			this.drawLine(extendPos,angle,curLength,false,0,false,0);
			let originPos1 = PointUtility.LengthenPoint(whiteBallPos,this.shootAngle,b);
			let angle1 = this.shootAngle > angle ? angle + 90 : angle - 90;
			if (this.shootAngle < -90 && angle > 90)angle1 = angle + 90;
			else if(this.shootAngle > 90 && angle < -90)angle1 = angle - 90;
			let targetPos2 = PointUtility.LengthenPoint(originPos1,angle1,ballRadius);
			this.drawLine(targetPos2,angle1,this.table.boresight - curLength,false,0,false,0);
			if(b>0) isDraw = true;
		}
		if(!isDraw)
			this.drawAssistLine();
		this.boresight.stroke();
	}
	/**封装画线api */
	protected drawLine(startPos:cc.Vec2,angle:number,length:number,showStartCircle?:boolean,startCircleR?:number,showEndCircle?:boolean,endCircleR?:number)
	{
		angle = cc.misc.degreesToRadians(angle);
		if(!startCircleR)startCircleR = 0;
		if(!endCircleR)endCircleR = 0;
		let velocity = cc.v2(Math.cos(angle),Math.sin(angle));
		let fromPos = velocity.mul(startCircleR).addSelf(startPos);
		if(showStartCircle)this.boresight.circle(startPos.x,startPos.y,startCircleR);
		this.boresight.moveTo(fromPos.x,fromPos.y);
		length = length-endCircleR;
		let targetPos = velocity.mul(length).addSelf(startPos);
		this.boresight.lineTo(targetPos.x,targetPos.y);
		let hitPos = velocity.mul(length+endCircleR).addSelf(startPos);
		if(showEndCircle)this.boresight.circle(hitPos.x,hitPos.y,endCircleR);
		return hitPos;
	}
	//设置禁用标识
	private setDisableImg(ballPos,posB)
	{
		if(!this.disableImg) {
			let ballSp:cc.Sprite = StoreManager.NewNode(cc.Sprite);
			this.boresightNode.addChild(ballSp.node);
			this.disableImg = ballSp.node;
			this.disableImg.setScale(0.92);
			ResourceManager.LoadSpriteFrame("Game/EightBall/EightBall?:disableSmall",ballSp);
			let circleSp:cc.Sprite = StoreManager.NewNode(cc.Sprite);
			this.boresightNode.addChild(circleSp.node);
			this.disableCircle = circleSp.node;
			this.disableCircle.setScale(0.92);
			ResourceManager.LoadSpriteFrame("Game/EightBall/EightBall?:img_HongQuan",circleSp);
		}
		this.disableImg.active = true;
		this.disableCircle.active = true;
		this.disableImg.setPosition(ballPos);
		this.disableCircle.setPosition(posB);
	}
	//隐藏禁用标识
	private hideDisableImg()
	{
		if(this.disableImg) {
			this.disableImg.active = false;
			this.disableCircle.active = false;
		}
	}
	/**接收到结算的消息 */
	public onGameSettle()
	{
		this.boresight&&this.boresight.clear();
		this.hideDisableImg();
	}
    /**玩家当前是否可击球 */
	protected get isCanOption(): boolean {return this.player.id==this.room.optPlayer;}

	public dispose()
	{
		this.asset.stopAllActions();
		this.fireCueNode&&this.fireCueNode.stopAllActions();
		JTimer.ClearTimeOut(this);
		super.dispose();
	}
}