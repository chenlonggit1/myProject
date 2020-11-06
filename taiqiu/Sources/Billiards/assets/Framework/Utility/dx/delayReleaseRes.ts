import { ResourceReleaseManager } from "../../Managers/ResourceReleaseManager";

/**
 * 延时释放资源
 * @param asset 资源全路径
 * @param delay 延时时长，单位ms
 */
export function delayReleaseRes(asset:string|string[],delay:number):void
{   
    if(typeof asset==="string")ResourceReleaseManager.ReleaseAsset(asset,delay);
    else 
    {
        for (let i = 0; i < asset.length; i++) 
            ResourceReleaseManager.ReleaseAsset(asset[i],delay);
    }
} 
