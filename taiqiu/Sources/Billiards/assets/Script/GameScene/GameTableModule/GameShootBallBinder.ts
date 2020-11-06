import { FBinder } from "../../../Framework/Core/FBinder";
import { Physics3DUtility } from "../../../Framework/Utility/Physics3DUtility";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { PlayerVO } from "../../VO/PlayerVO";
import { RoomVO } from "../../VO/RoomVO";
import { TableVO } from "../../VO/TableVO";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { Fun } from "../../../Framework/Utility/dx/Fun";
import GameBall from "../GameBall";
import { integer } from "../../../Framework/Utility/dx/integer";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
/**
 * 专门用于做击球相关的Binder
 */
export class GameShootBallBinder extends FBinder 
{
    public static ClassName:string = "GameShootBallBinder";
    /**玩家自己的VO */
    private player:PlayerVO;
    /**当前游戏桌子的VO */
    private table:TableVO;
    /**当前游戏房间的VO */
    private room:RoomVO;
    /**当前的击球力度 */
    protected shootVelocity = cc.v3();
    /**击球角度 */
    private shootAngle:number = 0;
    /**加塞角度 */
    private contactAngle:number = 0;
    /**当前击球力度 */
    private powerScale:number = 0;
    /**击球质量比 */
    private massRatio = 0.3;
    /**高杆角度 */
    protected gasserAngle:number = 0;

    protected initViews()
    {
        super.initViews();
        this.table = GameDataManager.GetDictData(GameDataKey.Table,TableVO);
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        this.room = GameDataManager.GetDictData(GameDataKey.Room,RoomVO);
    }
    /**
     * 接收到玩家操作的消息
     * @param playerID 
     */
    public setOptionPlayer(playerID:number)
    {
        this.shootVelocity = cc.v3();
        this.gasserAngle = 0;
        this.shootAngle = 0;
        this.contactAngle = 0;
        // this.extendGasser = 0;
    }
    /**击球 */
	public shoot(playerID:number,angle:number,force:cc.Vec3,velocity:cc.Vec3,powerScale:number,contactPoint:cc.Vec2,gasserAngle:number):void
	{
       
        this.room.gan++;
        if(velocity==null&&force!=null)
        {
            velocity = cc.v3();
            cc.Vec3.rotateY(velocity, force.mul(powerScale), cc.v3(), cc.misc.degreesToRadians(angle));  
        }
        if(velocity==null)return;
        window['shoot_count']++;
        // 开杆加30%的力
        if(this.room.gan==1)velocity.mulSelf(1.3);

        this.shootVelocity = velocity;
        let durtion = 100;
        if(playerID!=this.player.id)
        {
            durtion = 200;
            if(playerID<0)durtion=300;
        }
        JTimer.ClearTimeOut(this);
        JTimer.TimeOut(this,durtion,Fun(()=>
        {
            Physics3DUtility.StartUpdateFrame();
            this.shootAngle = angle;
            this.contactAngle = contactPoint.x;
            this.powerScale = powerScale;
            this.shootVelocity = velocity;
            this.gasserAngle = gasserAngle;
            this.applyShoot();
        },this));
    }
    /**
     * 将击球参数应用于击球中
     */
    protected applyShoot()
    {
        ///////////////////////////////////////////////////////
        let velocity = this.shootVelocity.mul(this.massRatio);
        let rigi = this.table.whiteBall.getComponent(cc.RigidBody3D);
        if(this.contactAngle==0&&this.gasserAngle==0)// 如果不是加塞，直接使用线速度击球
        {
            rigi.setLinearVelocity(velocity);
            return;
        }
        // 加塞时将材质设置成冰球材质
        this.setIceMaterial();
        let gb:GameBall = this.table.whiteBall.getComponent(GameBall);
        let sx = Math.cos(cc.misc.degreesToRadians(this.shootAngle));
        let sy = Math.sin(cc.misc.degreesToRadians(this.shootAngle));
        let cx = Math.cos(cc.misc.degreesToRadians(this.contactAngle));
        let cy = Math.sin(cc.misc.degreesToRadians(this.contactAngle));
        gb.onCollision = this.onBallCollision.bind(this);
        gb.onFirstHitKu = this.onHitKu.bind(this);
        let contactVelocity = cc.v3(sy*cx,cy,sx*cx);
        contactVelocity.mulSelf(rigi.node.scale*0.3);
        if(this.gasserAngle!=0)
        {
            let gx = Math.cos(cc.misc.degreesToRadians(this.gasserAngle));
            let gy = Math.sin(cc.misc.degreesToRadians(this.gasserAngle));
            let maxValue = Math.max(Math.abs(velocity.x),Math.abs(velocity.y),Math.abs(velocity.z));
            let angularVelocity = null;
            if(this.gasserAngle<=45)
            {
                velocity.mulSelf((1-gy));
                angularVelocity = cc.v3(sx*cx,cy,sy*cx);
                let contactAngle1 = Math.abs(this.contactAngle);
                if(contactAngle1<=45)angularVelocity.z*=-1;
                else if(contactAngle1<=90)angularVelocity = cc.v3(angularVelocity.x,angularVelocity.z,-angularVelocity.y);
                else if(contactAngle1<=135)angularVelocity = cc.v3(angularVelocity.x,angularVelocity.z,angularVelocity.y);
                else if(contactAngle1<=180)angularVelocity.z*=-1;
            }else
            {
                velocity.mulSelf((1-gy));
                angularVelocity = cc.v3(sx*cx,1-cy,(sy-1)*cx);
                let contactAngle2 = Math.abs(this.contactAngle);
                if(contactAngle2<=45)angularVelocity = cc.v3(sx*cx,1-cy,-(sy-1)*cx*(1-gx)-(this.contactAngle)/45);
                else if(contactAngle2<=90) angularVelocity = cc.v3(sx*cx,1-cy,(sy-1)*cx*(1-gx)+(this.contactAngle-45)/45);
                else if(contactAngle2<=135)angularVelocity = cc.v3(sx*cx,1-cy,(sy-1)*cx*(1-gx)+(this.contactAngle-45)/45);
                else if(contactAngle2<=180)angularVelocity = cc.v3(sx*cx,1-cy,-(sy-1)*cx*(1-gx)-(this.contactAngle)/45);
            }
            angularVelocity.mulSelf(maxValue*gy*this.powerScale);
            rigi.setAngularVelocity(angularVelocity);
        }
        rigi.applyImpulse(velocity.mulSelf(rigi.mass*0.8),contactVelocity);
    }
    //////////////////////////////////////////////////////////////////////////// 测试方法
    private contactData = null;
    /**加塞碰撞后把原来的冰材质还原回本来设置的材质 */
    private onBallCollision(other)
    {
        if(this.contactData==null)return;
        if(other.group=="Tables"&&(other.name=="BottomBox"||other.name=="CapBox"))return;
        let gb:GameBall = this.table.whiteBall.getComponent(GameBall);
        let rigi = this.table.whiteBall.getComponent(cc.RigidBody3D);
        let desktopCollider:cc.BoxCollider3D = getNodeChildByName(this.asset,"GameTable/Colliders/BottomBox",cc.BoxCollider3D);//this.asset
        let ballCollider:cc.SphereCollider3D = this.table.whiteBall.getComponent(cc.SphereCollider3D);
        desktopCollider.sharedMaterial.friction = this.contactData.friction1;
        desktopCollider.sharedMaterial.restitution = this.contactData.restitution1;
        ballCollider.sharedMaterial.friction = this.contactData.friction2;
        ballCollider.sharedMaterial.restitution = this.contactData.restitution2;
        rigi.mass = this.contactData.mass;
        rigi.linearDamping = this.contactData.linearDamping;
        rigi.angularDamping = this.contactData.angularDamping;
        rigi.linearFactor = this.contactData.linearFactor;
        rigi.angularFactor = this.contactData.angularFactor;
        ballCollider.sharedMaterial = ballCollider.sharedMaterial;
        desktopCollider.sharedMaterial = desktopCollider.sharedMaterial;
        gb.onCollision = null;
        this.contactData = null;
    }
    //////////////////////////////////////////////////////////////////////////// 
    /**
     * 设置成冰球材质
     */
    private setIceMaterial()
    {
        let desktopCollider:cc.BoxCollider3D = getNodeChildByName(this.asset,"GameTable/Colliders/BottomBox",cc.BoxCollider3D);//this.asset
        let ballCollider:cc.SphereCollider3D = this.table.whiteBall.getComponent(cc.SphereCollider3D);
        let rigi = this.table.whiteBall.getComponent(cc.RigidBody3D);
        this.contactData = {};
        this.contactData.friction1 = desktopCollider.sharedMaterial.friction;
        this.contactData.restitution1 = desktopCollider.sharedMaterial.restitution;
        this.contactData.friction2 = ballCollider.sharedMaterial.friction;
        this.contactData.restitution2 = ballCollider.sharedMaterial.restitution;
        this.contactData.mass = rigi.mass;
        this.contactData.linearDamping = rigi.linearDamping;
        this.contactData.angularDamping = rigi.angularDamping;
        this.contactData.linearFactor = rigi.linearFactor;
        this.contactData.angularFactor = rigi.angularFactor;
        rigi.mass = 120;
        rigi.linearDamping = 0.05;
        rigi.angularDamping = 0.05;
        rigi.linearFactor = cc.v3(1,1,1);
        rigi.angularFactor = cc.v3(1,1,1);
        desktopCollider.sharedMaterial.friction = 2;
        desktopCollider.sharedMaterial.restitution = 1;
        ballCollider.sharedMaterial.friction =0.01;
        ballCollider.sharedMaterial.restitution = 1;
        ballCollider.sharedMaterial = ballCollider.sharedMaterial;
        desktopCollider.sharedMaterial = desktopCollider.sharedMaterial;
    }
    /**白球加塞以后第一次的碰撞是碰到库边 */
    protected onHitKu()
    {
        let rot = (this.shootAngle+360)%90;// 将角度转换成0~360
        let offset = Math.min(rot,(90-rot));
        if(offset>10)return;// 垂直击球角度偏移超过15度
        rot = Math.abs(this.contactAngle);
        if(rot>30&&rot<150)return;
        let cx = Math.cos(cc.misc.degreesToRadians(this.contactAngle));
        let cy = Math.sin(cc.misc.degreesToRadians(this.contactAngle));
        let sx = Math.cos(cc.misc.degreesToRadians(this.shootAngle));
        let sy = Math.sin(cc.misc.degreesToRadians(this.shootAngle));
        let rigi = this.table.whiteBall.getComponent(cc.RigidBody3D);
        let velocity = cc.v3();
        rigi.getLinearVelocity(velocity);
        let contactVelocity = cc.v3(sy*cx,cy,sx*cx).mulSelf(15);
        rigi.setLinearVelocity(velocity.addSelf(contactVelocity));
    }
    /**销毁 */
    public dispose()
    {
        JTimer.ClearTimeOut(this);
        super.dispose();
    }
}