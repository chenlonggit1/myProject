import { FBinder } from "../../../Framework/Core/FBinder";
import { dispatchFEventWith } from "../../../Framework/Utility/dx/dispatchFEventWith";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GameEvent } from "../../GameEvent";
import { PlayerVO } from "../../VO/PlayerVO";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { RoomVO } from "../../VO/RoomVO";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import { TableVO } from "../../VO/TableVO";
import { EventManager } from "../../../Framework/Managers/EventManager";
import { CuePropertyVO } from "../../VO/CuePropertyVO";

/**
*@description:游戏操作模块
**/
export class GameOptionBinder extends FBinder 
{
	public static ClassName:string = "GameOptionBinder";
	
	protected power:cc.Sprite = null;
	protected powerScaleNode:cc.Node = null;
	protected powerNode:cc.Node = null;
	protected powerNum:cc.Label = null;


	protected fineTurningNode:cc.Node = null;
	protected fineTurningScaleNode:cc.Node = null;
	protected fineTurning:cc.Node = null;
	protected fineTurningNum:cc.Label = null;
	protected hitPoint:cc.Node = null;
	protected redPoint:cc.Node = null;
	protected pointAngle:cc.Label = null;
	protected powerHitPoint:cc.Node = null;
	protected fineTurningHitPoint:cc.Node = null;
	
	/**玩家自己 */
	private player:PlayerVO = null;
	private room:RoomVO = null;
	private table:TableVO = null;
	private isOpenContactPoint:boolean = false;
	protected initViews():void
	{
		super.initViews();
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
		this.powerNode = getNodeChildByName(this.asset,"ShootPower");
		this.powerScaleNode = getNodeChildByName(this.powerNode,"Progress");
		this.powerHitPoint = getNodeChildByName(this.powerNode,"HitPoint");
		this.power = this.powerScaleNode.getComponent(cc.Sprite);
		this.powerNum =  getNodeChildByName(this.powerNode,"Num",cc.Label);

		this.fineTurningNode = getNodeChildByName(this.asset,"FineTurning");
		this.fineTurningScaleNode = getNodeChildByName(this.fineTurningNode,"FrontMask");
		this.fineTurningHitPoint = getNodeChildByName(this.fineTurningNode,"HitPoint");
		this.fineTurning = getNodeChildByName(this.fineTurningNode,"Mask/Scale");
		this.fineTurningNum =  getNodeChildByName(this.fineTurningNode,"Num",cc.Label);

		this.fineTurningNode.active = false;
		this.powerNode.active = false;

		this.hitPoint = getNodeChildByName(this.asset, "HitPoint");
		this.redPoint = getNodeChildByName(this.hitPoint, "RedPoint");
		this.pointAngle = getNodeChildByName(this.hitPoint, "PointAngle", cc.Label);
		this.hitPoint.active = false;
	}

	/**设置当前击球的玩家 */
	public setOptionPlayer(playerID:number)
	{
		
		this.removeOptionEvents();
		this.power.fillRange = 0;
		this.power.node.stopAllActions();
		if(this.player.id==playerID)
		{
			this.powerNode.active = true;
			this.fineTurningNode.active = true;
			this.hitPoint.active = true;
			this.addOptionEvents();	
		}else
		{
			this.powerNode.active = true;
			this.fineTurningNode.active = false;
			this.hitPoint.active = false;
			if (this.isOpenContactPoint) {
				this.isOpenContactPoint = false;
				dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Game_ContactPoint, null, GameLayer.UI);
			}
		}

		this.redPoint.setPosition(cc.v2(0,0));
		this.pointAngle.node.active = false;
	}
	/**移除界面操作事件 */
	protected removeOptionEvents()
	{
		this.powerHitPoint.off(cc.Node.EventType.TOUCH_MOVE,this.onPowerTouch,this);
		this.powerHitPoint.off(cc.Node.EventType.TOUCH_END,this.onPowerTouch,this);
		this.powerHitPoint.off(cc.Node.EventType.TOUCH_CANCEL,this.onPowerTouch,this);
		this.fineTurningHitPoint.off(cc.Node.EventType.TOUCH_MOVE,this.onFineTurningTouch,this);
		this.fineTurningHitPoint.off(cc.Node.EventType.TOUCH_END,this.onFineTurningTouch,this);
		this.fineTurningHitPoint.off(cc.Node.EventType.TOUCH_CANCEL,this.onFineTurningTouch,this);
		this.hitPoint.off(cc.Node.EventType.TOUCH_START,this.onHitPointTouch,this);
		EventManager.removeEvent(this,"onBallCueRotateChange",this.onBallCueRotateChange);
		// dispatchFEventWith("onBallCueRotateChange");
	}
	/**添加界面操作事件 */
	protected addOptionEvents()
	{
		this.powerHitPoint.on(cc.Node.EventType.TOUCH_MOVE,this.onPowerTouch,this);
		this.powerHitPoint.on(cc.Node.EventType.TOUCH_END,this.onPowerTouch,this);
		this.powerHitPoint.on(cc.Node.EventType.TOUCH_CANCEL,this.onPowerTouch,this);
		this.fineTurningHitPoint.on(cc.Node.EventType.TOUCH_MOVE,this.onFineTurningTouch,this);
		this.fineTurningHitPoint.on(cc.Node.EventType.TOUCH_END,this.onFineTurningTouch,this);
		this.fineTurningHitPoint.on(cc.Node.EventType.TOUCH_CANCEL,this.onFineTurningTouch,this);
		this.hitPoint.on(cc.Node.EventType.TOUCH_START,this.onHitPointTouch,this);
		addEvent(this,GameEvent.Update_ContactPoint,this.updateContactPoint);
		if(this.fineTurningNum)
			addEvent(this,"onBallCueRotateChange",this.onBallCueRotateChange);
	}

	protected onBallCueRotateChange(evt)
	{
		if(this.fineTurningNum)
			this.fineTurningNum.string = Math.round(evt.data)+"";
	}
	protected onFineTurningTouch(evt:cc.Event.EventTouch)
	{
		if(evt.type==cc.Node.EventType.TOUCH_MOVE)
		{
			let offsetPos = evt.getLocation().sub(evt.getPreviousLocation());
			let position = this.fineTurning.position;
			position.y+=offsetPos.y*0.1;
			this.fineTurning.setPosition(position);
			dispatchFEventWith(GameEvent.Player_FineTurning_Option,offsetPos.y);
		}else 
		{
			let position = this.fineTurning.position;
			position.y%=69;
			this.fineTurning.setPosition(position);
			dispatchFEventWith(GameEvent.Player_FineTurning_Option,null);
		}
		evt.stopPropagation();
	}
	protected onPowerTouch(evt:cc.Event.EventTouch)
	{
		if(evt.type==cc.Node.EventType.TOUCH_MOVE)
		{
			let pos = evt.getLocation();
			pos = this.powerHitPoint.convertToNodeSpaceAR(pos);
			let height = this.powerHitPoint.height;
			pos.y+=height*this.powerHitPoint.anchorY;
			let p = (height-pos.y)/height;
			if(p<0)p = 0;
			else if(p>1)p=1;

			let pos1 = evt.getLocation();
			pos1 = this.powerScaleNode.convertToNodeSpaceAR(pos1);
			let height1 = this.powerScaleNode.height;
			pos1.y+=height1*this.powerScaleNode.anchorY;
			let p1 = pos1.y/height1;
			if(p1<0)p1 = 0;
			else if(p1>1)p1=1;
			
			this.power.fillRange = Math.max(p1,p);
			// if(this.powerNum)this.powerNum.string = Math.round(this.table.shootForce.x*this.power.fillRange)+"";
			dispatchFEventWith(GameEvent.Player_Power_Option,{power:this.power.fillRange,isFire:false});
			let cueProperty:CuePropertyVO = GameDataManager.GetDictData(GameDataKey.CueProperty,CuePropertyVO);
			if(cueProperty.power>0)
				this.powerNum.string = Math.floor(this.power.fillRange*cueProperty.power)+"";
		}else
		{
			if(this.power.fillRange>0){
				dispatchFEventWith(GameEvent.Player_Power_Option,{power:this.power.fillRange,isFire:true});
			}
		}
		evt.stopPropagation();
	}
	protected onHitPointTouch(evt) {
		this.isOpenContactPoint = !this.isOpenContactPoint;
		if (this.isOpenContactPoint){
			dispatchModuleEvent(ModuleEvent.SHOW_MODULE, ModuleNames.Game_ContactPoint, null, GameLayer.UI);
		}
	}
	protected updateContactPoint(data) {
		let pointData = data.data;
		this.isOpenContactPoint = !this.isOpenContactPoint;
		this.redPoint.setPosition(cc.v2(pointData.position.x*20,pointData.position.y*20));
		this.pointAngle.node.active = parseInt(pointData.angle) > 0;
		this.pointAngle.string = parseInt(pointData.angle) + "°";
	}
	/**玩家击球 */
	public shoot(playerID:number,powerScale:number):void
	{
		this.power.node.stopAllActions();
		if(this.player.id==playerID)
		{
			if(this.powerNum)this.powerNum.string = "";
			if(this.fineTurningNum)this.fineTurningNum.string = "";
			this.power.fillRange = 0;
			this.powerNode.active = false;
			this.fineTurningNode.active = false;
			this.hitPoint.active = false;
			this.removeOptionEvents();
		}else
		{
			if(this.powerNode.active)
			{
				if(playerID<0)
				{
					JTimer.TimeOut(this,200,Fun(()=>
					{
						cc.tween(this.power).to(0.15,{fillRange:powerScale}).call(()=>this.powerNode.active = false).start();
					},this));
				}else cc.tween(this.power).to(0.15,{fillRange:powerScale}).call(()=>this.powerNode.active = false).start();
			}
			this.fineTurningNode.active = false;
			this.hitPoint.active = false;
		}
	}
	public dispose()
	{
		this.power&&this.power.node.stopAllActions();
		super.dispose();
	}
	/**玩家当前是否可击球 */
	protected get isCanOption(): boolean {return this.player.id==this.room.optPlayer}
}