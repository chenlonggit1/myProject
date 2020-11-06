import { JTimer } from "../Timers/JTimer";
import { FFunction } from "../Core/FFunction";
import { trace } from "./dx/trace";

export class Physics3DUtility 
{
    public static IsSleeping ():boolean{ return CANNON.World['SLEEPING'];}
    private static enableUpdateFrame:boolean = true;
    private static physic3D = null;// cc.director.getPhysics3DManager();
    private static frameTimer:JTimer = null;
    private static sleepCallbacks:FFunction[] = [];
    public static IsEnableSendSleep:boolean = true;

    /**加速限制休眠时间 */
    public static SleepTimeLimit = 0.4;
    /**加速限制休眠速度 */
    public static SleepSpeedLimit = 1.3;
    public static IsDebug:boolean = false;
    private static getPhysic()
    {
        if(this.physic3D==null)
            this.physic3D = cc.director.getPhysics3DManager();
    }
    public static InitPhysic()
    {
        window['shoot_count'] = 0;
        this.getPhysic();
        this.physic3D.enabled = false;
        this.physic3D.allowSleep = true;
        this.physic3D.gravity = cc.v3(0,-10,0);
        this.physic3D.maxSubStep = 100;
        // 表示允许执行多步模拟，建议不要修改，可以通过 maxSubStep 控制最多步进次数
        this.physic3D.useFixedTime = true;//false;
        // 表示使用物理框架实现的非插值多步模拟
        // 否则将会使用由物理引擎提供的插值多步模拟，可能会导致物理事件不连续
        this.physic3D['useAccumulator'] = false;//true
        // 表示使用固定长度机制，使用 p3dm['fixDigits'] 修改位数
        // 比如修改位置的位数长度为 7，p3dm['fixDigits'].position = 7;
        this.physic3D['useFixedDigit'] = true;
        this.physic3D['fixDigits'].position = 11;
        this.physic3D['fixDigits'].rotation = 11;
        this.physic3D["physicsWorld"].world.solver.tolerance=1e-4;
        this.physic3D.deltaTime = 1/120;
        if (window['CANNON']) 
            window['CANNON']['Persistence'] = this;
    }
    public static SetSleepCallback(fun:FFunction)
    {
        if(FFunction.FindIndexOf(fun,this.sleepCallbacks)==-1)
            this.sleepCallbacks.push(fun);
    }
    public static StartUpdateFrame()
    {
        this.getPhysic();
        this.enableUpdateFrame = true;
        this.startFrameTimer();
    }
    public static StopUpdateFrame()
    {
        this.enableUpdateFrame = false;
        if(!this.frameTimer.running)return;
        this.frameTimer.reset();
    }
    private static startFrameTimer()
    {
        if(this.frameTimer==null)
        {
            this.frameTimer = JTimer.GetTimer(this.physic3D.deltaTime*1000);
            this.frameTimer.addTimerCallback(this,this.onUpdatePhysicFrame)
        }
        if(this.frameTimer.running)return;
        this.frameTimer.reset();
		this.frameTimer.start();
    }
    private static onUpdatePhysicFrame()
    {
        this.UpdatePhysicFrame(this.frameTimer.currentCount,this.frameTimer.delay);
    }
    public static UpdatePhysicFrame(frameNum,deltaTime)
    {
        
        if (!this.enableUpdateFrame) 
        {
            if (Physics3DUtility.IsSleeping()) 
            {
                this.physic3D.enabled = false;
                this.physic3D["physicsWorld"].world.time = 0;
                this.frameTimer.reset();
            }
            return;
        }
        
        this.physic3D.enabled = true;
        this.physic3D.update(deltaTime);
        this.physic3D.enabled = false;
        if (Physics3DUtility.IsSleeping()) 
        {
            this.physic3D.traverse((body) => 
            {
                body.body.sleepTimeLimit = this.SleepTimeLimit;
                body.body.sleepSpeedLimit = this.SleepSpeedLimit;
                if(body.node.group=="Balls")
                    Physics3DUtility.refreshMass(body.body);
            });
            if(this.IsDebug)this.Print();
            this.frameTimer.reset();
            this.enableUpdateFrame = false;
            this.physic3D.enabled = false;
            this.physic3D["physicsWorld"].world.time = 0;
            for (let i = 0; i < this.sleepCallbacks.length; i++) 
                this.sleepCallbacks[i].excute();
            trace("Physics3D Sleep--->",frameNum,Physics3DUtility.IsSleeping());
        }
    }
    protected static stepTotal:number = 0;
    protected static hashCode(str) 
    {
        //获取字符串的 哈希值 
        // str = str.toLowerCase();
        var hash = 1315423911, i, ch;
        for (i = str.length - 1; i >= 0; i--) {
            ch = str.charCodeAt(i);
            hash ^= ((hash << 5) + ch + (hash >> 2));
        }
        return (hash & 0x7FFFFFFF).toString();
    }
    protected static Print()
    {
        console.log("========击球杆数===========",window['shoot_count']);
        var sunStr = (this.physic3D["physicsWorld"].world.time).toString();
        let bodyDatas = [];
        this.physic3D.traverse((body) => 
        {
            if(body.node.group=="Balls")
            {
                body.body.timeLastSleepy = 0;
                bodyDatas.push({name:body.node.name,str:body.body.position.toString(), str2:body.body.quaternion.toString()});
                // console.log(body.node.name, body.body.position.toString());    
                this.refreshMass(body.body);
            }
        });
        bodyDatas.sort((a,b)=>
        {
            if(parseInt(a.name.replace("B",""))>parseInt(b.name.replace("B","")))return 1;
            return -1;
        });
        for (let j = 0; j < bodyDatas.length; j++) 
        {
            console.log(bodyDatas[j].name, bodyDatas[j].str);
            sunStr += bodyDatas[j].str;
            sunStr += bodyDatas[j].str2;
        }

        var hash = this.hashCode(sunStr);
        var oldHash = localStorage.getItem("s-" + window['shoot_count']);
        if (oldHash == hash) 
        {
            console.log(`[${window['shoot_count']}] ` + hash);
        }else if (oldHash) 
        {
            console.log(`[${window['shoot_count']}]* ${oldHash}`);
            localStorage.setItem("s-" + window['shoot_count'], hash);
        }else 
        {
            localStorage.setItem("s-" + window['shoot_count'], hash);
        }
        console.log("Physics3D Sleep---> ",this.stepTotal, (this.physic3D["physicsWorld"].world.time) + ", " + this.stepTotal, ", " + this.hashCode(sunStr));

        this.stepTotal = 0;  
    }
    public static Dispose()
    {
        this.frameTimer&&this.frameTimer.dispose();
        if(this.physic3D)this.physic3D.enabled = false;
        cc.director.getCollisionManager().enabled = false;
        this.sleepCallbacks.length = 0;
        this.frameTimer = null;
    }
    public static SetNodeWorld (node: cc.Node, worldPos?: cc.Vec3,worldRot?: cc.Quat):void
    {
        const c3d = node.getComponent(cc.Collider3D);
        if (c3d) 
        {
            if(worldPos!=null)
            {
                const pos = c3d.shape['sharedBody'].body.position;
                pos.x = parseFloat(worldPos.x.toFixed(3));
                pos.y = parseFloat(worldPos.y.toFixed(3));
                pos.z = parseFloat(worldPos.z.toFixed(3));
                c3d.shape['sharedBody'].body.initPosition.copy(pos);
                // console.log(`${node.name}* ${pos.x}, ${pos.y}, ${pos.z}`)
            }
            if(worldRot!=null)
            {
                const rot = c3d.shape['sharedBody'].body.quaternion;
                rot.x = parseFloat(worldRot.x.toFixed(3));
                rot.y = parseFloat(worldRot.y.toFixed(3));
                rot.z = parseFloat(worldRot.z.toFixed(3));
                rot.w = parseFloat(worldRot.w.toFixed(3));
                c3d.shape['sharedBody'].body.initQuaternion.copy(rot);
                // console.log(`2 - ${node.name}* ${rot.x}, ${rot.y}, ${rot.z}, ${rot.w}`)
            }
        }
    }

    public static refreshMass (body){
        const rot = body.quaternion;
        rot.normalize();		
        body.updateMassProperties();
        if (this.physic3D.useFixedDigit) {						
            const pd = this.physic3D.fixDigits.position;
            const rd = this.physic3D.fixDigits.rotation					
            rot.x = parseFloat(rot.x.toFixed(rd));
            rot.y = parseFloat(rot.y.toFixed(rd));
            rot.z = parseFloat(rot.z.toFixed(rd));
            rot.w = parseFloat(rot.w.toFixed(rd));
        }
    }
}
