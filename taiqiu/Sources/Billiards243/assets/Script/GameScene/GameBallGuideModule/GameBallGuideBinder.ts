import { FBinder } from "../../../Framework/Core/FBinder";
import { TableVO } from "../../VO/TableVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { stageWidth } from "../../../Framework/Utility/dx/stageWidth";
import { stageHeight } from "../../../Framework/Utility/dx/stageHeight";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { PlayGameID } from "../../Common/PlayGameID";
import { UIEvent } from "../../../Framework/Events/UIEvent";
import GameBall from "../GameBall";
import { SimpleCardVO } from "../../VO/SimpleCardVO";

/**
*@description:提示玩家击球的光圈
**/
export class GameBallGuideBinder extends FBinder 
{
	public static ClassName:string = "GameBallGuideBinder";
	/**将击打的球 */
	protected ballGraphics:cc.Graphics = null;
	private ballTween:cc.Tween = null;
	protected table:TableVO = null;
	/**玩家自己 */
	private player:PlayerVO = null;
	private room:RoomVO = null;
	protected initViews():void
	{
		super.initViews();
		this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
		this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		let ballGraphicsNode = new cc.Node("ballGraphicsNode");
		this.ballGraphics = ballGraphicsNode.addComponent(cc.Graphics);
		this.ballGraphics.lineWidth = 5;
		this.ballGraphics.strokeColor = cc.Color.WHITE;
		this.ballGraphics.fillColor = cc.color(0,255,0,255);
		dispatchFEvent(new UIEvent(UIEvent.ADD_TO_LAYER,ballGraphicsNode,{x:-stageWidth()/2,y:-stageHeight()/2},GameLayer.UI));
	}

	/**设置当前击球的玩家 */
	public setOptionPlayer(playerID:number)
	{
		this.stopTween();
		if(this.player.id==playerID)
			this.playBallAnim();
	}
	/**击球 */
	public shoot(playerID:number,angle:number,force:cc.Vec3,velocity:cc.Vec3,powerScale:number,contactPoint:cc.Vec2,gasserAngle:number):void
	{
		this.stopTween();
	}

	public onGameSettle()
	{
		this.stopTween();
	}
	//播放击打球动画
	public playBallAnim()
	{
		if(this.room.gameId == PlayGameID.RedBall)return;
		let minR = this.table.ballRadius+4;
		let maxR = this.table.ballRadius+7;
		let script = this;
		let data = {
			_r:minR,
			set r(r:number){
				this._r = r;
				// 绘制
				script.drawRing(this._r, this.alpha);
			},
			get r(){
				return this._r;
			},
			alpha:200,
		};
		// 开启动画
		this.ballTween = cc.tween(data)
			.to(1.5, {r:maxR,alpha:0})
			.call(() => {
				[data.r,data.alpha] = [minR,150];
			})
			.union()
			.repeatForever()
			.start();
	}

	//绘制击打球
	private drawRing(r,a)
	{

		if(!this.ballGraphics||this.room.players.length==0) return;
		this.ballGraphics.clear();
		this.ballGraphics.strokeColor.setA(a);
		let strikeBalls = [];
		if(this.room.gameId == PlayGameID.Card15||this.room.gameId == PlayGameID.Card54)
		{
			let cards = this.room.players[0].cards;
			for (let i = 0; i < cards.length; i++) 
			{
				let card:SimpleCardVO = cards[i] as SimpleCardVO;
				if(strikeBalls.indexOf(card.value)==-1)strikeBalls.push(card.value);
			}
		}else strikeBalls = this.room.players[0].strikeBalls;

		for (let i = 0; i < this.table.balls.length; i++) 
		{
			let id = this.table.balls[i].getComponent(GameBall).id;
			if(strikeBalls.indexOf(id)!=-1)
			{
				if(this.table.pocketBalls.indexOf(id)!=-1) continue; //排除已经进洞的球
				let ballPos = this.table.ballScreenPoints[this.table.balls[i].name];
				this.ballGraphics.circle(ballPos.x,ballPos.y,r);
				this.ballGraphics.stroke();
			}
		}
	}
	//停止tween动画
	private stopTween() 
	{
		if(!this.ballGraphics)return;
		this.ballGraphics.clear();
		if(this.ballTween) {
			this.ballTween.stop();
			this.ballTween = null;
		}
	}

	public dispose()
	{
		this.stopTween();
		super.dispose();
	}
}