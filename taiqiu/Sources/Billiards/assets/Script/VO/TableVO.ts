import { FObject } from "../../Framework/Core/FObject";

export class TableVO extends FObject
{
    public static ClassName:string = "TableVO";
    /*白球 */
    public whiteBall:cc.Node = null;
    /**保存桌子上除白球外的其他球 */
    public balls:cc.Node[] = [];
    /**白球上一次操作的位置 */
    public lastWhiteBallPos: cc.Vec3 = null;
    /**所有已经落袋的球 */
    public pocketBalls:number[] = [];
    /**正在拖动球 */
    public isBallDragging:boolean = false;
    /**台球的父节点 */
    public ballParent:cc.Node = null;
    /**球的半径 */
    public ballRadius:number = 0;
    /**桌子所有的定位点 */
    public anchors:cc.Node[] = [];
    /**所有球在屏幕上的位置 */
    public ballScreenPoints:{[key:string]:cc.Vec2} = {};
    /**桌子所有的定位点在屏幕上的位置 */
    public anchorScreenPoints:cc.Vec2[] = [];
    /**落袋位置 */
    public pocketNum:number = 1;
    /**击球力度 */
    public shootForce:cc.Vec3 = cc.v3(300,0,0);
    /**击球瞄准线 */
    public boresight:number = 20;


    public reset()
    {
        this.pocketBalls.length = 0;
        this.isBallDragging = false;
    }

}
