const { ccclass, requireComponent, executionOrder } = cc._decorator;

/**
 * 场景背景图的适配组件
 *
 * @export
 * @class BGAdapter
 * @extends {cc.Component}
 */
@ccclass
@requireComponent(cc.Sprite)
@executionOrder(-1)
export default class BGAdapter extends cc.Component {
    onLoad() {
        const scaleX = new Decimal(cc.Canvas.instance.node.width).div(this.node.width);
        const scaleY = new Decimal(cc.Canvas.instance.node.height).div(this.node.height);
        // 缩放因子
        const scale = Decimal.max(scaleX, scaleY).toNumber();
        this.node.scale = scale;
    }
}
