import { IContext } from "../Interfaces/IContext";
import { FContext } from "./FContext";
import { FScene } from "./FScene";
import { Assets } from "./Assets";
import { dispatchFEvent } from "../Utility/dx/dispatchFEvent";
import { SceneEvent } from "../Events/SceneEvent";
import { AudioManager } from "../Managers/AudioManager";
import { ResourceManager } from "../Managers/ResourceManager";
import { Fun } from "../Utility/dx/Fun";

export class Application
{
    public static ClassName: string = "Application";
    public static Size: cc.Vec2 = cc.v2(1920, 1080);
    public static CurrentScene: FScene = null;
    private static context: IContext = null;
    public static CanvasScale: cc.Vec2 = cc.v2(1, 1);

    private static isBootStrap:boolean = false;


    /**
     * 
     * @param context 
     * @param stageSize 
     * @param assetClass 
     */
    public static Bootstrap(context: typeof FContext | IContext, stageSize?: cc.Vec2, assetClass?: typeof Assets): void
    {
        if(this.isBootStrap)return;
        this.SetApplicationSize(stageSize);
        if (assetClass != null) new assetClass();
        else new Assets();
        if (this.context) this.context.dispose();
        if (typeof context === "function") this.context = new context();
        else this.context = context;
        this.context.initialize();
        this.isBootStrap = true;
        

    }
    public static SetApplicationSize(stageSize: cc.Vec2): void
    {
        if (stageSize != null) 
        {
            this.Size = stageSize;
            // cc.view.setDesignResolutionSize(stageSize.x,stageSize.y,cc.ResolutionPolicy.SHOW_ALL);
        }
    }
    public static SetCurrentScene(scene: FScene): void
    {
        this.CurrentScene = scene;
        
        if (("isLayout" in scene) && scene["isLayout"])// 启用布局
        {
            if (cc.sys.isNative)// 只在打包成Native时才生效
            {
                if ("isNativeLockOrien" in scene&&scene["isNativeLockOrien"] && "nativeOrientation" in scene)
                {
                    
                }
            }else
            {
                if (("isWebOrien" in scene)&&scene["isWebOrien"])
                {
                    
                }
            }
        }
        dispatchFEvent(new SceneEvent(SceneEvent.SET_CURRENT_SCENE,cc.director.getScene().name));
    }
    public static OnCurrentSceneDestroy(): void
    {
        this.CurrentScene = null;
    }

    //设置按钮声音
    public static SetButtonSound(): void
    {
        if(cc.Button.prototype["touchBeganClone"]) return;
        cc.Button.prototype["touchBeganClone"] = cc.Button.prototype["_onTouchBegan"];
        cc.Button.prototype["_onTouchBegan"] = function(event)
        {
            if(this.interactable && this.enabledInHierarchy && AudioManager.IsCanPlayEffect)
            {
                AudioManager.PlayEffect("button");
            }
            this.touchBeganClone(event);
        }
    }

    //文本添加字体
    public static AddFont(): void
    {
        if(cc.Label.prototype["onLoadClone"]) return;
        cc.Label.prototype["onLoadClone"] = cc.Label.prototype["onLoad"];
        cc.Label.prototype["onLoad"] = function() {
            if(!this.font){
                cc.assetManager.resources.load("Fonts/ALKATIPTor",cc.Font,(err,res)=>{
                    if(this.node) {
                        this.font = res;
                        this._forceUpdateRenderData(true);
                    }
                })
            }
            this.onLoadClone();
        }
    }

    public static Exit(): void 
    {
        this.context&&this.context.dispose();
        if (cc.sys.isNative)
        {
            cc.game.end();
            cc.director.end();
        }
    }
}



// export class Application {


//     public static Bootstrap(context: typeof FContext | IContext, stageSize?: cc.Vec2, assetClass?: typeof Assets, isCollisionEnable?: boolean): void {


//         if (this.context) this.context.dispose();
//         InstanceManager.GetInstance(cc.Rect, Instances.DeviceNotchRect);//cc.rect(0,0,0,0);// 设备异形屏所在区域和范围,默认为0，0，0，0
//         this.SetApplicationSize(stageSize);
//         if (typeof context === "function") this.context = new context();
//         else this.context = context;
//         this.context.initialize();
//         if (isCollisionEnable) {
//             // 开启碰撞检测
//             cc.director.getCollisionManager().enabled = true;
//         }
//     }

//     public static SetApplicationSize(stageSize: cc.Vec2) {
//         if (stageSize != null) this.Size = stageSize;
//         if (cc.sys.isBrowser)// 只有在浏览器的时候才允许
//         {
//             let gameContainer = document.getElementById("Cocos2dGameContainer");
//             let ww = gameContainer.style.width;
//             let hh = gameContainer.style.height;
//             ww = ww.replace("px", "");
//             hh = hh.replace("px", "");
//             this.CanvasScale.x = Number(ww) / stageWidth();
//             this.CanvasScale.y = Number(hh) / stageHeight();
//         } else {
//             this.CanvasScale.x = 1;
//             this.CanvasScale.y = 1;
//         }
//     }

//     /**
//      * 设置成当前场景
//      * @param scene 场景
//      * @param isFit 是否需要自动匹配
//      * @param isAddMask 是否给场景添加个遮罩
//      */
//     public static SetCurrentScene(scene: FScene, isFit: boolean = true, isAddMask: boolean = true): void {
//         this.CurrentScene = scene;
//         if (isFit) {
//             let canvas = scene.node.getComponent(cc.Canvas);
//             if (canvas != null) {
//                 canvas.fitHeight = true;
//                 canvas.fitWidth = true;
//             }
//         }
//         if (("isLayout" in scene) && scene["isLayout"])// 启用布局
//         {
//             if (NotchManager.IsHasNotch && ("isSupportNotch" in scene) && scene["isSupportNotch"])// 启用刘海屏支持
//             {
//                 NotchManager.SetSceneSetting({ notchSize: scene["notchSize"] });
//             } else NotchManager.SetSceneSetting(null);
//             FF_ENABLE_FIT_LAYOUT = true;
//             if (cc.sys.isNative)// 只在打包成Native时才生效
//             {
//                 if ("isNativeLockOrien" in scene) {
//                     if (scene["isNativeLockOrien"] && "nativeOrientation" in scene)
//                         AdapterManager.SetSceneSetting({ rotation: scene["nativeOrientation"], isAnim: scene["isOrienAnim"] });
//                     else AdapterManager.SetSceneSetting(null);
//                 } else AdapterManager.SetSceneSetting(null);
//             } else {
//                 if (("isWebOrien" in scene)) {
//                     if (scene["isWebOrien"])
//                         AdapterManager.SetSceneSetting({ rotation: scene["webOrientation"], isAnim: scene["isOrienAnim"] });
//                     else AdapterManager.SetSceneSetting(null);
//                 } else AdapterManager.SetSceneSetting(null);
//             }
//             if (!AdapterManager.IsNewEngine) {
//                 if (AdapterManager.CanvasRotation != null && !AdapterManager.IsNewEngine)
//                     (this.CurrentScene.node as any)["rotation"] = AdapterManager.CanvasRotation;
//             }
//         } else FF_ENABLE_FIT_LAYOUT = false;
//     }
//     public static OnCurrentSceneDestroy(): void {
//         this.CurrentScene = null;
//     }
//     public static Exit(): void {
//         if (this.context)
//             this.context.dispose();
//         if (cc.sys.isNative) {
//             console.log("退出程序！！！");
//             cc.game.end();
//             cc.director.end();
//         }
//     }
// }