const { ccclass, requireComponent } = cc._decorator;

/**
 * 需要动态适配的设计组件
 *
 * @export
 * @class CameraAdapter
 * @extends {
    cc.Component}
 */
@ccclass
@requireComponent(cc.Camera)
export class CameraAdapter extends cc.Component 
{
    public static ClassName:string = "CameraAdapter";
    /** 摄像机组件 */
    private camera!: cc.Camera;
    /** 摄像机默认fov的求tan值，方便适配时atan赋值fov */
    private defaultTanFov!: number;
    protected f:any = null;

    onLoad() {
        this.camera = this.getComponent(cc.Camera)!;
        this.defaultTanFov = Decimal.tan(new Decimal(this.camera.fov).div(180).mul(Decimal.PI)).toNumber();
        this.updateFov();
        this.f = this.updateFov.bind(this);
        window.addEventListener('resize', this.f);
    }

    updateFov() {
        let tan = new Decimal(cc.view.getVisibleSize().height).div(cc.view.getDesignResolutionSize().height).mul(this.defaultTanFov);
        this.camera.fov = Decimal.atan(tan).div(Decimal.PI).mul(180).toNumber();
    }

    onDestroy() {
        window.removeEventListener('resize', this.f);
    }
}