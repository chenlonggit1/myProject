import { FBinder } from "../../../Framework/Core/FBinder";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { UIEvent } from "../../../Framework/Events/UIEvent";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { stageHeight } from "../../../Framework/Utility/dx/stageHeight";
import { stageWidth } from "../../../Framework/Utility/dx/stageWidth";
import { GameBallCueBinder } from "../../GameScene/GameBallCueModule/GameBallCueBinder";

/**
*@description:训练球杆模块
**/
export class GameTrainBallCueBinder extends GameBallCueBinder 
{
	public static ClassName:string = "GameTrainBallCueBinder";
	/**瞄准辅助线 */
	protected TipLinetNode:cc.Node = null;
	protected TipLinet:cc.Graphics = null;
	
	// public initViews() {
	// 	super.initViews();
	// 	this.TipLinetNode = new cc.Node("TipLinet");
	// 	this.TipLinet = this.boresightNode.addComponent(cc.Graphics);
	// 	this.TipLinet.lineWidth = 3;
	// 	this.TipLinet.strokeColor = cc.Color.WHITE;
	// 	this.TipLinet.fillColor = cc.color(0,255,0,255);
	// 	// dispatchFEvent(new UIEvent(UIEvent.ADD_TO_LAYER,this.boresightNode,{x:-stageWidth()/2,y:-stageHeight()/2},GameLayer.UI));
	// }
}