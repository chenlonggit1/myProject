import { AudioManager } from "../../Framework/Managers/AudioManager";
import { dispatchFEvent } from "../../Framework/Utility/dx/dispatchFEvent";
import { UIEvent } from "../../Framework/Events/UIEvent";
import { GameLayer } from "../../Framework/Enums/GameLayer";
import { getCamera } from "../../Framework/Utility/dx/getCamera";
import { CanvasOffset } from "../Common/CanvasOffset";
import { stageWidth } from "../../Framework/Utility/dx/stageWidth";
import { stageHeight } from "../../Framework/Utility/dx/stageHeight";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameBall extends cc.Component 
{
    public static ClassName:string = "GameBall";
    /**阴影贴图 */
    @property(cc.SpriteFrame)
    protected shadow:cc.SpriteFrame = null;
    /**阴影节点 */
    protected shadowNode:cc.Node = null;

    @property(cc.Integer)
    public id:number = 0;
    private camera:cc.Camera = null;
    /**第一次碰库时的回调 */
    public onFirstHitKu:Function = null;
    /** */
    public onCollision:Function = null;

    onLoad()
    {
        if(this.shadow!=null)
        {
            this.camera = getCamera("3D Camera");
            this.shadowNode = new cc.Node("Shadow");
            this.shadowNode.scale = 0.72;
            this.shadowNode.opacity = 135;
            let sp = this.shadowNode.addComponent(cc.Sprite);
            sp.spriteFrame = this.shadow;
        }
    }

    onEnable()
    {
        let collider = this.node.getComponent(cc.SphereCollider3D);
        collider.on("collision-enter",this.onBallCollision,this);
        if(this.shadowNode)dispatchFEvent(new UIEvent(UIEvent.ADD_TO_LAYER, this.shadowNode,null, GameLayer.Content));
    }
    onDisable()
    {
        let collider = this.node.getComponent(cc.SphereCollider3D);
        collider.off("collision-enter",this.onBallCollision,this);
        if(this.shadowNode)
        {
            if(this.shadowNode.parent)
                this.shadowNode.removeFromParent();
        }
    }
    protected onBallCollision(evt)
    {
        let other:cc.Node = evt.otherCollider.node;

        if(this.onCollision!=null)this.onCollision(other);
        if(other.group=="Tables"&&other.name.startsWith("BorderBox"))
        {
            AudioManager.PlayEffect("BallHit");
            if(this.onFirstHitKu!=null)
                this.onFirstHitKu();
            this.onFirstHitKu = null;
            return;
        }
        if(other.group!="Balls")return;
        this.onFirstHitKu = null;
        AudioManager.PlayEffect("BallCollider");
    }
    update()
    {
        if(this.camera==null||this.shadowNode==null)return;
        if(!this.node.parent&&this.shadowNode.parent)
            this.shadowNode.removeFromParent();
        if(!this.shadowNode.parent&&this.node.parent)
            dispatchFEvent(new UIEvent(UIEvent.ADD_TO_LAYER, this.shadowNode,null, GameLayer.Content));
        let ballWorldPos = this.node.convertToWorldSpaceAR(cc.v3());
        let ballScreenPos:any = this.camera.getWorldToScreenPoint(ballWorldPos);
        ballScreenPos = cc.v2(ballScreenPos.x,ballScreenPos.y).sub(CanvasOffset.Offset);
        ballScreenPos.subSelf(cc.v2(stageWidth()/2,stageHeight()/2));
        this.shadowNode.setPosition(ballScreenPos);
    }
}
