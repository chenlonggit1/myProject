import { ResourceReleaseManager } from "../../Managers/ResourceReleaseManager";

/**
 * 取消资源延时释放
 * @param asset 资源全路径
 */
export function cancelDelayReleaseRes(asset:string|string[]):void
{   
    if(asset==null)return;
    if(typeof asset==="string")ResourceReleaseManager.ClearReleaseDelay(asset);
    else 
    {
        for (let i = 0; i < asset.length; i++) 
            ResourceReleaseManager.ClearReleaseDelay(asset[i]);
    }
} 
