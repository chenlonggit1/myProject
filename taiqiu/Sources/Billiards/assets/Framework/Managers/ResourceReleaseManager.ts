
import { trace } from "../Utility/dx/trace";
import { CacheManager } from "./CacheManager";
import { getTime } from "../Utility/dx/getTime";
import { JFramer } from "../Timers/JFramer";
/**
*@description:资源释放管理
**/
export class ResourceReleaseManager 
{
    private static delayRes:{[key:string]:number} = {};
    private static timer:JFramer = null;
    private static lastUpdateTime:number = 0;
    public static ClearReleaseDelay(asset:string):void
    {
        if(this.delayRes[asset]!=null)
        {
            //trace("取消资源释放====>",asset);
            delete this.delayRes[asset];
            if(!this.timer||!this.timer.running)return;
            this.CheckNeedStopTimer();
        }
    }
    /**释放素材资源,delay:延时释放 */
    public static ReleaseAssets(asset:{assets,assetTypes},delay:number=0):void
    {
        let assets = asset.assets;
        for (let i = 0; i < assets.length; i++) 
            this.ReleaseAsset(assets[i],delay);
    }
    /**释放素材资源,delay:延时释放 */
    public static ReleaseAsset(asset:string,delay:number=0):void
    {
        if(delay<=0)this.Release(asset);
        else this.AddReleaseDelay(asset,delay);
    }
    protected static AddReleaseDelay(asset:string,delay:number):void
    {
        this.delayRes[asset] = delay;
        if(this.timer==null)
        {
            this.timer = new JFramer();
            this.timer.name = "ResourceReleaseManager";
            this.timer.addFramerCallback(this,this.OnReleaseResTick);
        }
        if(!this.timer.running)
        {
            this.lastUpdateTime = getTime();
            this.timer.start();
        }
    }
    
    protected static CheckNeedStopTimer():void
    {
        let keys = Object.keys(this.delayRes);
        if(keys.length==0)// 没有需要释放的资源，需要关闭定时器
            this.timer.stop();
    }
    protected static OnReleaseResTick():void
    {
        let ct = getTime();
        let v = ct-this.lastUpdateTime;
        let isChange = false;
        for(let asset in this.delayRes)
        {
            this.delayRes[asset]-=v;
            if(this.delayRes[asset]<=0)
            {
                isChange = true;
                this.Release(asset);
                delete this.delayRes[asset];
            }
        }
        this.lastUpdateTime = ct;
        if(isChange)this.CheckNeedStopTimer();
    }
    protected static Release(asset:string)
    {
        cc.assetManager.resources.release(asset);
        CacheManager.RemoveCache(asset);
    }
}