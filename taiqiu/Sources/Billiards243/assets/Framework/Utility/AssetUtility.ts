import { LanguageManager } from "../Managers/LanguageManager";
import { getFileName } from "./dx/getFileName";
import { getFileExtension } from "./dx/getFileExtension";
import { StringUtility } from "./StringUtility";

export class AssetUtility
{
    // 默认切割字符
    private static readonly SPLIT_CHAR = "?:";

    public static GetCacheUUIDs()
    {
        let uuids = {};
        // 2.4.0 不再使用cc.loader
        // let caches = cc.loader["_cache"];
        // let keys = Object.keys(caches);
        // for (let i = 0; i < keys.length; i++) 
        // {
        //     if(keys[i].indexOf("preview-scripts/assets/")!=-1||// 去除js代码
        //         keys[i].indexOf("preview-scene")!=-1|| // 去除场景
        //         keys[i].indexOf("res/raw-assets/")!=-1)continue;// 
        //     let u = getFileName(keys[i]);
        //     if(uuids[u]==null)uuids[u]=[];
        //     uuids[u].push({path:keys[i],ext:getFileExtension(keys[i]),data:caches[keys[i]]});
        // }
        return uuids;
    }

    /**
     * 
     * @param assetData 过滤掉无效 的资源
     */
    public static RemoveInvalidAsset(assetData:{assets:string[],assetTypes:cc.Asset[]})
    {
        for (let i = 0; i < assetData.assets.length; i++) 
        {
            if(assetData.assetTypes[i]==null)
            {
                assetData.assets.splice(i,1);
                assetData.assetTypes.splice(i,1);
                i--;
            }
        }
    }

    public static GetAtlas(asset:string):any
    {
        let str = this.findAtlas(asset,0);
        if(str==asset&&str.indexOf(this.SPLIT_CHAR)==-1)return "null";
        return StringUtility.TrimSpace(str);
    }
    private static findAtlas(asset:string,index:number):any
    {
        if(index>3)return asset+" ";// 设置查找深度，防止死循环，返回需要加空字符串，是防止在GetAtlas上面判断取的资源为null
        if(asset!=null&&asset.indexOf(this.SPLIT_CHAR)!=-1)
        {
            let assets = this.SplitAtlas(asset);
            let altasName:string = LanguageManager.GetLang(assets[0]);
            if(altasName!="null"&&altasName!="")assets[0] = altasName;
            asset = assets.join(this.SPLIT_CHAR);
        }else
        {
            let temp = LanguageManager.GetLang(asset);
            if(temp!=null&&temp!="null") asset = this.findAtlas(temp,++index);
        }
        return asset;
    }
    /**切割图集 */
    public static SplitAtlas(asset:string):string[]
    {
        return asset.split(this.SPLIT_CHAR);
    }

    public static GetAssetPath(str:string):string
    {
        let assets = this.SplitAtlas(str);
        if(assets.length<2)return str;
        else return assets[0];
    }
}
