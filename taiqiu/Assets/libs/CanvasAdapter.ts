const { ccclass, requireComponent, executionOrder } = cc._decorator;

/**
 * 场景画布的适配组件
 *
 * @export
 * @class CanvasAdapter
 * @extends {cc.Component}
 */
@ccclass
@requireComponent(cc.Canvas)
@executionOrder(-1)
export default class CanvasAdapter extends cc.Component {
    onLoad() {
        cc.Canvas.instance.fitHeight = false;
        cc.Canvas.instance.fitWidth = false;
        const size = cc.view.getVisibleSize();
        // 设备分辨率宽高比
        const screenRatio = new Decimal(size.width).div(size.height);
        // 设计分辨率宽高比
        const designRatio = new Decimal(cc.Canvas.instance.designResolution.width).div(cc.Canvas.instance.designResolution.height);
        if (!designRatio.greaterThanOrEqualTo(screenRatio)) {
            // 设计分辨率的宽高比 小于 设备分辨率的宽高比
            cc.Canvas.instance.fitWidth = true;
        } else {
            // 设计分辨率的宽高比 大于等于 设备分辨率的宽高比
            cc.Canvas.instance.fitHeight = true;
        }
        this.node.getComponent(cc.Widget).updateAlignment();
    }
}
