import { FModule } from "../../Framework/Core/FModule";
import { dispatchModuleEvent } from "../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../ModuleNames";
import { PopupAnimType } from "../../Framework/Enums/PopupAnimType";

/**
*@description:基础模块弹出类
**/
export class ModuleBasePopup extends FModule
{
	protected popupTween:cc.Tween = null;
	protected animType:PopupAnimType = PopupAnimType.SCALE;
	protected orginPos:cc.Vec2 = null;

	/**
	 * 弹出动画
	 * @param node 
	 * @param end 
	 * @param mask 
	 */
	public popup(node: cc.Node, end: () => void, mask: boolean = true):void
	{
		// 显示遮罩
		if (mask)
			dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Mask);
		// 播放动画
		if (this.popupTween) this.popupTween.stop();
		this.popupTween = this.createTween(node, true)
						.call(() => {
							// 清空动画
							this.popupTween = null;
							// 执行结束回调
							if (end) end();
						})
						.start();
	}
	
	/**
	 * 弹下动画
	 * @param node 
	 * @param end 
	 * @param mask 
	 */
	protected popdown(node: cc.Node, end: () => void, mask: boolean = true):void
	{
		if(!node.isValid)return;
		// 播放动画
		if (this.popupTween) this.popupTween.stop();
		this.popupTween = this.createTween(node, false)
						.call(() => {
							// 清空动画
							this.popupTween = null;
							// 执行结束回调
							if (end) end();
						})
						.start();
		// 隐藏遮罩
		if (mask)
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Mask);
	}

	/**
	 * 创建动画
	 * @param node 
	 * @param isOpen 
	 */
	protected createTween(node: cc.Node, isOpen:boolean): cc.Tween
	{
		// 记录初始位置
		if (!this.orginPos) this.orginPos = cc.v2(node.x,node.y);
		let canvas = cc.Canvas.instance.node;

		switch (this.animType)
		{
			case PopupAnimType.SCALE:
				return cc.tween(node)
						.call(() => {
							node.scale = isOpen ? 0 : 1;
							node.opacity = isOpen ? 0 : 255;
						})
						.to(0.3, {scale:isOpen ? 1 : 0,opacity:isOpen ? 255 : 0}, {easing:isOpen ? "backOut" : "backIn"});
			case PopupAnimType.UP:
				return cc.tween(node)
						.call(() => {
							node.y = isOpen ? this.orginPos.y - canvas.height : this.orginPos.y;
						})
						.to(0.3, {y:isOpen ? this.orginPos.y : this.orginPos.y - canvas.height}, {easing:isOpen ? "expoOut" : "expoIn"});
			case PopupAnimType.DOWN:
				return cc.tween(node)
						.call(() => {
							node.y = isOpen ? this.orginPos.y + canvas.height : this.orginPos.y;
						})
						.to(0.3, {y:isOpen ? this.orginPos.y : this.orginPos.y + canvas.height}, {easing:isOpen ? "expoOut" : "expoIn"});
			case PopupAnimType.LEFT:
				return cc.tween(node)
						.call(() => {
							node.x = isOpen ? this.orginPos.x + canvas.width : this.orginPos.x;
						})
						.to(0.5, {x:isOpen ? this.orginPos.x : this.orginPos.x + canvas.width}, {easing:isOpen ? "expoOut" : "expoIn"});
			case PopupAnimType.RIGHT:
				return cc.tween(node)
						.call(() => {
							node.x = isOpen ? this.orginPos.x - canvas.width : this.orginPos.x;
						})
						.to(0.5, {x:isOpen ? this.orginPos.x : this.orginPos.x - canvas.width}, {easing:isOpen ? "expoOut" : "expoIn"});
			default: cc.tween(node);
		}
	}
}