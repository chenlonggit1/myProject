import { FObject } from "../../Framework/Core/FObject";
import { SimpleCardVO } from "./SimpleCardVO";
import { StoreManager } from "../../Framework/Managers/StoreManager";

export class SimplePlayerVO extends FObject
{
    public static ClassName:string = "SimplePlayerVO";
    public id:number = 0;
    /**昵称 */
    public nickName:string = "";
    /**头像 */
    public head:string = null;
    /**等级 */
    public level:number = 0;
    /**角色 */
    public roleId:number = 0;
    /**玩家需要击打的球 */
    public strikeBalls:number[] = [];
    /**所有已落袋的球 */
    public pocketBalls:number[] = [];
    /**玩家使用的球杆id */
    public cueId:number = 0;
    /**角色经验 */
    public exp:number = 0;

    /**再来一局已准备 */
    public isReady:boolean = false;
    /**服务器中用来记录的每个玩家应该击打的球 */
    public balls:number[] = [];
    /**重连过程中进的球 */
    public reConnectBalls:number[] = [];

    /**抽牌 */
    public cards = [];

    /**赢次数 */
    public winNum = 0;
    /**犯规次数 */
    public foul = 0;
    /**多连击，0-没有 */
    public manyCue = 0;
    

    /**
     * 当前对象不存在正在解析的属性值
     */
    protected unOwnSetProperty(thisObj:object,data:object,property:string):void
    {
        if(property=="nick")
            thisObj["nickName"] = data[property];
    }

    public reset()
    {
        this.balls.length = 0;
        this.strikeBalls.length = 0;
        this.pocketBalls.length = 0;
        this.cards.length = 0;
        this.isReady = false;
        this.foul = 0;
        this.manyCue = 0;
        this.reConnectBalls.length = 0;
    }
}
