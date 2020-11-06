import { FFunction } from "../../Framework/Core/FFunction";
import { getPointA2BAngle } from "../../Framework/Utility/dx/getPointA2BAngle";
import { StoreManager } from "../../Framework/Managers/StoreManager";
import { AudioManager } from "../../Framework/Managers/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BallItem extends cc.Component 
{
 
    /**球的移动路、径 */
    protected paths:cc.Vec3[] = [];
    /**入袋时球的移动速度 */
    protected moveSpeed:number = 0;
    /**当前的移动点 */
    protected point:cc.Vec3 = null;
    /**旋转方向 */
    private rotateAxis:cc.Vec3 = null;
    /**移动方向 */
    protected moveAxis:cc.Vec3 = cc.v3();
    /**需要移动的步数 */
    protected moveStep:number = 0;
    /**旋转速度 */
    protected rotateSpeed:number = 0.1;
    /*缩放速度 */
    protected scaleSpeed:number = 2.4;
    /**动画完成回调 */
    public callback:FFunction = null;
    private ballIndex = 0;

    public start()
    {
        this.node.eulerAngles = cc.v3(Math.random()*360-180,Math.random()*360-180,Math.random()*360-180);
    }
    public movePaths(paths:cc.Vec3[])
    {
        this.rotateSpeed = 0.1;
        this.paths = paths;
        if(this.point==null)
        {
            this.node.scale = 2.4;
            this.point = this.paths.shift();
            this.node.setPosition(this.point);
        }
        this.moveNext();
    }
    /**设置球的显示模型 */
    public setMaterials(index:number)
    {
        if(index>16||index<0)return;
        this.ballIndex = index;
        while(this.node.childrenCount>0)
            StoreManager.StoreNode(this.node.children.shift());
        let mesh:cc.Node = StoreManager.NewPrefabNode("GameScene/BallMeshs/Mesh"+index);
        this.node.addChild(mesh);
        //  在native中使用setMaterial的方式会出现报错
        // let mesh:cc.MeshRenderer = this.node.getComponentInChildren(cc.MeshRenderer);
        // mesh.setMaterial(0,mesh.sharedMaterials[index]);
    }
    /**移动到下一个定位 点 */
    protected moveNext()
    {
        if(this.paths.length==0)
        {
            this.point = null;
            this.moveAxis = null;
            if(this.callback)
            {
                if(this.callback.length==0)this.callback.excute();
                else this.callback.excute([this]);
            }
            this.callback = null;
            AudioManager.PlayEffect("BallCollider");
            return;
        }
        this.point = this.paths.shift();
        if(this.paths.length==4)
        {
            if(this.ballIndex == 0) {
                this.node.destroy();
                return;
            }
            this.node.scale = 2.4;
            this.node.setPosition(this.point);
            this.moveNext();
            return;
        }
        let pos = this.node.position.clone();
        if(this.point.equals(pos))// 当前两个位置重叠，继续下一个位置
        {
            this.moveNext();
            return;
        }
        if(this.paths.length > 4) this.moveSpeed = Math.random()*0.1+0.23;
        else this.moveSpeed = Math.random()*0.2+0.4;
        let offset = this.point.sub(pos);
        let len = offset.mag();
        this.moveStep = Math.ceil(len/this.moveSpeed);
        this.moveAxis.x = offset.x/this.moveStep;
        this.moveAxis.y = offset.y/this.moveStep;
        this.moveAxis.z = offset.z/this.moveStep;

        let rot = getPointA2BAngle(cc.v2(pos.x,pos.z),cc.v2(this.point.x,this.point.z));
        rot = (rot+360)%360;
        let a = cc.v3();
        let xx = Math.abs((180-rot)/180);// -1~+1a
        if(rot<=90)
        {
            a.x = -1*(1-xx)*2;
            a.z = -1*(1+a.x);
        }else if(rot<=180&&rot>90)
        {
            a.x = -1*(0+xx)*2;
            a.z = 1*(1+a.x);
        }else if(rot<=270&&rot>180)
        {
            a.x = 1*(0+xx)*2;
            a.z = 1*(1-a.x);
        }else if(rot<=360&&rot>270)
        {
            a.x = 1*(1-xx)*2;
            a.z = -1*(1-a.x);
        }
        a.mulSelf(-1);//
        this.rotateAxis = a.normalize();
    }
    /**移动函数 */
    protected move(dt)
    {
        if(this.moveStep<=0)return;
        this.moveStep--;
        let pos = this.node.position.clone();
        pos.addSelf(this.moveAxis);
        this.node.setPosition(pos);
        if(this.moveStep==0)this.moveNext();
    }
    /**旋转函数 */
    protected rotate(dt)
    {
        if(!this.rotateAxis)return;
        if(this.point==null)
        {
            this.rotateSpeed*=0.91;
            if(this.rotateSpeed<0.001)
            {
                this.rotateAxis = null;
                return;
            }
        }
        let q_tmp = cc.quat();
        let n_Q = cc.quat();
        this.node.getRotation(n_Q);
        let out_Q = cc.Quat.rotateAround(q_tmp, n_Q, this.rotateAxis, Math.PI * this.rotateSpeed);
        this.node.setRotation(out_Q);
    }
    /**缩放函数 */
    protected scale(dt)
    {
        if(this.paths.length > 4)
        {
            this.scaleSpeed*=0.993;
            this.node.setScale(this.scaleSpeed);
        }
    }

    public update(dt)
    {
        this.move(dt);
        this.rotate(dt);
        this.scale(dt);
    }
}
