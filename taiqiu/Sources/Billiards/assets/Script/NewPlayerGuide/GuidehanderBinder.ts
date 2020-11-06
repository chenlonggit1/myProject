import { FBinder } from "../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../Framework/Utility/dx/getNodeChildByName";

/**
*@description:新手引导手指
**/
export class GuidehanderBinder extends FBinder 
{
	public static ClassName:string = "GuidehanderBinder";
	private Anim_lightRound: cc.Animation;
	public hand: cc.Node;

	get active () {
		return this.asset.active;
	}

	set active (isAc: boolean) {
		this.asset.active = isAc
		// isAc || this.hand.pauseAllActions();
	}

	set postion(pos: cc.Vec3) {
		this.Anim_lightRound.node.position = pos;
		this.hand.position = pos;
	}

	set showLightRound(isLink: boolean) {
		this.Anim_lightRound.node.active = isLink;
		if(isLink) {
			let aniState = this.Anim_lightRound.play();
			aniState.repeatCount = cc.macro.REPEAT_FOREVER;
		} else {
			this.Anim_lightRound.stop();
		}
		// this.Anim_lightRound.play()
	}

	
	protected initViews():void
	{
		super.initViews();

		this.Anim_lightRound = getNodeChildByName(this.asset, "flag", cc.Animation);
		this.hand = getNodeChildByName(this.asset, "hand");
		this.asset.zIndex = 100;
	}

	moveAction(pos: cc.Vec2, time: number = 1, isReverse: boolean = false) {
		let mv = cc.moveTo(time, pos);
		let origin = this.hand.getPosition();
		let mv2 = isReverse ? cc.moveTo(time, origin): cc.moveTo(0, origin)
		cc.tween(this.hand).repeatForever(cc.sequence(mv, cc.delayTime(0.5), mv2)).start();
	}

	ShakeAction() {
		this.stopAllACtion();
		let time = 0.5;
		let pos = cc.v2(this.hand.x + 50, this.hand.y-50);
		let mv = cc.moveTo(time, pos);
		let origin = this.hand.getPosition();
		cc.tween(this.hand).repeatForever(cc.sequence(mv, cc.delayTime(0.5), cc.moveTo(time, origin))).start();
	}

	stopAllACtion() {
		this.hand.stopAllActions();
	}
}