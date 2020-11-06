import { GameFreeKickBinder } from "../../GameScene/GameFreeKickModule/GameFreeKickBinder";



/**
*@description:任意球摆球模块
**/
export class GameGuideFreeKickBinder extends GameFreeKickBinder {
	public static ClassName: string = "GameGuideFreeKickBinder";
	private whiteRound: cc.Node = null;

	initViews() {
		super.initViews();
		// this.whiteRound = cc.instantiate(this.freeKickBall);
		// this.whiteRound.x = this.halfScene.width / 2;
		// this.whiteRound.y = 0;
		// this.halfScene.addChild(this.whiteRound);
		// this.whiteRound.active = true;
	}

}