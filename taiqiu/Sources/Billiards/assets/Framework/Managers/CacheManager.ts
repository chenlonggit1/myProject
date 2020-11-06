import { AssetUtility } from './../Utility/AssetUtility';
import { cancelDelayReleaseRes } from '../Utility/dx/cancelDelayReleaseRes';
import { getFileName } from '../Utility/dx/getFileName';
import { InstanceManager } from './InstanceManager';
import { Instances } from '../Define/Instances';

export class CacheManager
{
    private static caches:{[key:string]:object} = {};
    public static HasCache(url:string):boolean
    {
        return this.caches[AssetUtility.GetAssetPath(url)]!=null;
    }
    public static Cache(url:string,obj:any):void
    {
        let p = AssetUtility.GetAssetPath(url);
        if(this.caches[p]==obj)return;
        this.caches[p] = obj;
    }
    public static GetCache(url:string,isCancelRelease:boolean=true):any
    {
        let path = AssetUtility.GetAssetPath(url);
         if(isCancelRelease)cancelDelayReleaseRes(path);
        return this.caches[path];
    }
    public static RemoveCache(url:string):void
    {
        let p = AssetUtility.GetAssetPath(url);
        if(!this.caches[p])return;
        let a:any = this.caches[p];
        if(a instanceof cc.Asset&&!(a instanceof cc.SpriteFrame)&&!(a instanceof cc.Texture2D))
        {
            let res = cc.loader.getDependsRecursively(a);
            let counts = InstanceManager.GetInstance(Object,Instances.CacheDepUUIDCounts);
            for (let i = 0; i < res.length; i++) 
            {
                if(res[i]==null)continue;
                let uuid = getFileName(res[i]);
                if(counts[uuid]!=null)counts[uuid]--;
                if(counts[uuid]<=0)delete counts[uuid];
            }
        }
        delete this.caches[p];
    }
    public static GetCacheSpriteFrame(str:string):cc.SpriteFrame
    {
        let assets = AssetUtility.SplitAtlas(str);
        if(assets.length<2)return this.GetCache(assets[0]);
        else 
        {
            let atlas = this.GetCache(assets[0]);
            if(atlas==null)return null;
            return atlas.getSpriteFrame(assets[1]);
        }
    }
}
