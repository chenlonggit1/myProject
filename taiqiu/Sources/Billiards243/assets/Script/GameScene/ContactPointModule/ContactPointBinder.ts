import { FBinder } from "../../../Framework/Core/FBinder";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { getPointA2BAngle } from "../../../Framework/Utility/dx/getPointA2BAngle";
import { GameEvent } from "../../GameEvent";
import { ModuleNames } from "../../ModuleNames";

/**
*@description:击球点
**/
export class ContactPointBinder extends FBinder {
	public static ClassName: string = "ContactPointBinder";

	private pointMask: cc.Node =null;
	private pointNode: cc.Node = null;
	private angleNode: cc.Node = null;
	private angleLabel:cc.Label = null;
	private raduis: number = 188; // 白球半径
	private bChoosePoint: boolean = true;
	private pointPos: cc.Vec2 = cc.v2(0, 0);
	private pointAngle:number = 0;
	protected initViews(): void 
	{
		super.initViews();
		this.pointMask = getNodeChildByName(this.asset,"ballMask");
		this.pointNode = getNodeChildByName(this.asset, 'ballMask/ball/point');
		this.angleNode = getNodeChildByName(this.asset, 'angle/line');
		this.angleLabel = getNodeChildByName(this.asset, 'angle/label',cc.Label);
		this.asset.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
		this.pointNode.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchPoint.bind(this), this);
		this.pointNode.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchPoint.bind(this), this);
		this.pointNode.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this), this);
		this.angleNode.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchAngle.bind(this), this);
		this.angleNode.parent.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveAngle.bind(this), this);
		this.angleNode.parent.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this), this);
		this.updateChooseUI(this.bChoosePoint);
	}
	private onTouchPoint(event: any): void 
	{
		
		this.bChoosePoint = true;
		this.updateChooseUI(this.bChoosePoint);
		event.stopPropagation();
		let touchPos = event.getLocation();
		let nodePos:cc.Vec2 = this.pointNode.parent.convertToNodeSpaceAR(touchPos);
		let centerPos = cc.v2(0, 0);
		let distance = nodePos.sub(centerPos).mag();//Math.sqrt((nodePos.x - centerPos.x) * (nodePos.x - centerPos.x) + (nodePos.y - centerPos.y) * (nodePos.y - centerPos.y));
		if(distance>=this.raduis)distance = this.raduis;
		this.pointAngle = getPointA2BAngle(centerPos,nodePos);
		let tempAngle = cc.misc.degreesToRadians(this.pointAngle);
		let realPos = cc.v2(Math.cos(tempAngle) * distance,Math.sin(tempAngle) * distance);
		this.pointNode.setPosition(realPos);
		// let dir = cc.v2(realPos.x / this.raduis, realPos.y / this.raduis);
		// this.pointPos = cc.v2(dir.x, dir.y);
		// console.log(">>>>>>>>>>",this.pointPos.toString());
	}

	//重置击球点
	public setOptionPlayer(playerID:number) {
		this.angleNode.angle = 0;
		this.angleLabel.string = "0°";
		this.pointPos = cc.v2(0, 0);
		this.pointAngle = 0;
		this.pointNode.setPosition(this.pointPos);
		this.bChoosePoint = true;
		this.updateChooseUI(this.bChoosePoint);
	}

	private onTouchAngle(event: any): void {
		this.bChoosePoint = false;
		this.updateChooseUI(this.bChoosePoint);
		event.stopPropagation();
		let touchPos = event.getLocation();
		this.checkAngle(touchPos);
	}

	private onTouchMoveAngle(event: any): void 
	{
		if (!this.bChoosePoint) {
			let touchPos = event.getLocation();
			this.checkAngle(touchPos);
		}
	}

	private onTouchEnd(event: any): void {
		event.stopPropagation();
	}

	private checkAngle(touchPos: cc.Vec2): void {
		let nodePos = this.angleNode.parent.convertToNodeSpaceAR(touchPos);
		//console.log('touchPos', touchPos.x, touchPos.y, 'nodePos', nodePos.x, nodePos.y);
		let centerPos = cc.v2(-190, -190);
		let angle = Math.atan2((nodePos.y - centerPos.y), (nodePos.x - centerPos.x)) //弧度 
		let theta = angle * (180 / Math.PI);
		theta = parseInt(theta+"");
		if (theta >= 0 && theta <= 90) {
			//console.log('需要传送的角度', theta);
			this.angleNode.angle = theta;
			this.angleLabel.string = theta+"°";
		}
		
	}

	// 关闭弹窗
	private onTouchStart(event: any): void 
	{
		event.stopPropagation();
		let pointData = 
		{
			angle: this.angleNode.angle,
			position: this.pointPos,
			pointAngle:this.pointAngle
		}
		dispatchFEventWith(GameEvent.Update_ContactPoint, pointData);
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Game_ContactPoint, null, GameLayer.UI);
	}
	private updateChooseUI(bChoosePoint: boolean): void 
	{
		if (bChoosePoint) {
			this.pointMask.setPosition(cc.v2(0, 0));
			this.pointMask.scale = 1;
			this.angleNode.parent.setPosition(cc.v2(-500, -200));
			this.angleNode.parent.scale = 0.3;
		} else {
			this.pointMask.setPosition(cc.v2(500, -200));
			this.pointMask.scale = 0.3;
			this.angleNode.parent.setPosition(cc.v2(0, 0));
			this.angleNode.parent.scale = 1;
		}
	}
}