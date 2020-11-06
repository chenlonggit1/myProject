import { Assets } from "../Core/Assets";
import { FFunction } from "../Core/FFunction";
import { LoaderType } from "../Enums/LoaderType";
import { ILoader } from "../Interfaces/ILoader";
import { DragonBoneLoader } from "../Loaders/DragonBoneLoader";
import { Loader } from "../Loaders/Loader";
import { SceneLoader } from "../Loaders/SceneLoader";
import { AssetUtility } from "../Utility/AssetUtility";
import { cancelDelayReleaseRes } from "../Utility/dx/cancelDelayReleaseRes";
import { trace } from "../Utility/dx/trace";
import { CacheManager } from "./CacheManager";


export class ResourceManager 
{
    private static loadCallbacks:{[key:string]:any[]} = {};
    /**
     * 加载骨骼动画
     * @param spinePath 
     * @param armature 
     * @param armatureName 
     * @param animationName 
     * @param playTimes 
     * @param onComplete 
     * @param onError 
     */
    public static LoadSpine(spinePath:string,onComplete?: FFunction,onError?:FFunction):void
    {
        if(!this.isValidAssetPath(spinePath,onError))return;
        
        // this.addLoader(dragonBoneData,LoaderType.DRAGON_BONE,{armatureDisplay:armature,armatureName:armatureName,animationName:animationName, onComplete: onComplete ,onError:onError,playTimes:playTimes});
    }
    /**
     * 
     * @param bonePath 龙骨动画在Resources里面的路径
     * @param armature 显示龙骨的组件
     * @param armatureName 
     * @param animationName 
     * @param onComplete 
     */
    public static LoadDragonBone(bonePath:string,armature?:dragonBones.ArmatureDisplay,armatureName?:string,animationName?:string,playTimes?:number,onComplete?: FFunction,onError?:FFunction):void
    {
        if(!this.isValidAssetPath(bonePath,onError))return;
        let dragonBoneData = Assets.GetDragonBone(bonePath);
        this.addLoader(dragonBoneData,LoaderType.DRAGON_BONE,{armatureDisplay:armature,armatureName:armatureName,animationName:animationName, onComplete: onComplete ,onError:onError,playTimes:playTimes});
    }

    public static LoadRawData(path:string,onComplete?: FFunction,onError?:FFunction):void
    {
        if(!this.isValidAssetPath(path,onError))return;
        this.addLoader(path,LoaderType.RAW,{ onComplete: onComplete,onError:onError });
    }

    public static LoadText(path:string,onComplete?: FFunction,onError?:FFunction):void
    {
        if(!this.isValidAssetPath(path,onError))return;
        this.addLoader(path,LoaderType.TEXT,{ onComplete: onComplete,onError:onError });
    }
    public static LoadAudio(path:string,onComplete?: FFunction,onError?:FFunction):void
    {
        if(!this.isValidAssetPath(path,onError))return;
        let audioAsset = path;//Assets.GetAudio(path);
        this.addLoader(audioAsset,LoaderType.AUDIO,{ onComplete: onComplete,onError:onError },cc.AudioClip);
    }
    /**加载预制体 */
    public static LoadPrefab(prefabName: string, onComplete?: FFunction,onError?:FFunction): void 
    {
        if(!this.isValidAssetPath(prefabName,onError))return;
        let prefabAsset = Assets.GetPrefab(prefabName);
        this.addLoader(prefabAsset,LoaderType.PREFAB,{ onComplete: onComplete,onError:onError });
    }
    /**
     * 加载并设置Sprite的spriteFrame,
     * 此处需要加？ 
     */
    public static LoadSpriteFrame(assetName: string, sprite: cc.Sprite,onComplete?: FFunction,onError?:FFunction): void 
    {        
        if(!this.isValidAssetPath(assetName,onError))return;
        assetName = Assets.GetTexture(assetName);
        let assets = AssetUtility.SplitAtlas(assetName);
        let isAtlas = assets.length>1;
        if(CC_EDITOR&&isAtlas)assets[0] = assets[0];//+".plist";
        this.addLoader(assets[0],isAtlas?LoaderType.SPRITE_ATLAS:LoaderType.SPRITE,{ sprite: sprite, assetName: assets[1],onComplete:onComplete,onError:onError},isAtlas?cc.SpriteAtlas:cc.SpriteFrame);
    }

    /**设置按钮精灵帧 author cjr  */
    public static LoadButtonSpriteFrame(assetName: string, button:cc.Button,frameName:string, onComplete?: FFunction,onError?:FFunction):void
    {
        if(!this.isValidAssetPath(assetName,onError))return;
        assetName = Assets.GetTexture(assetName);
        let assets = AssetUtility.SplitAtlas(assetName);
        let isAtlas = assets.length>1;
        if(CC_EDITOR&&isAtlas)assets[0] = assets[0];//+".plist";
        this.addLoader(assets[0],isAtlas?LoaderType.SPRITE_ATLAS:LoaderType.SPRITE,{ button: button,frameName:frameName, assetName: assets[1],onComplete:onComplete,onError:onError},isAtlas?cc.SpriteAtlas:cc.SpriteFrame);
    }

    public static LoadScene(sceneName:string,onComplete?: FFunction,onProgress?:FFunction,onError?:FFunction):void
    {
        this.addLoader(sceneName,LoaderType.SCENE,{onComplete: onComplete, onProgress: onProgress ,onError:onError});
    }
    public static LoadImage(assetName: string, sprite: cc.Sprite,onComplete?: FFunction,onError?:FFunction): void 
    {
        this.addLoader(assetName,LoaderType.IMAGE,{sprite:sprite,onComplete: onComplete,onError:onError},cc.SpriteFrame);
    }
    /**加载并设置字体的font */
    public static LoadFont(assetName: string, lable: cc.Label,onComplete?: FFunction,onError?:FFunction): void 
    {
        let asset = Assets.GetFonts(assetName);
        this.addLoader(asset,LoaderType.FONT,{lable:lable,onComplete:onComplete,onError:onError},cc.Font);
    }

    private static isValidAssetPath(asset,onError):boolean
    {
        if(asset==""||asset=="null"||asset.lastIndexOf("null")!=-1)
        {
            // trace(asset,"<----发现加载空素材！！！！");
            if(onError!=null)onError();
            return false;
        }
        return true;
    }
    private static addLoader(asset:any,loaderType:LoaderType,data:any,assetType?:any):void
    {
        if(asset==null)return;
        let assetName = asset;
        if(loaderType==LoaderType.DRAGON_BONE)assetName = asset.name;
        cancelDelayReleaseRes(assetName);// 取消释放资源
        if(CacheManager.HasCache(assetName))this.excuteAssetCallback(assetName,loaderType,data);
        else
        {
            if(this.loadCallbacks[assetName]==undefined)
            {
				let loader:ILoader = null;
                if(loaderType==LoaderType.SCENE)loader = SceneLoader.Get();
                else if(loaderType==LoaderType.DRAGON_BONE)loader = DragonBoneLoader.Get();
                else loader = Loader.Get();
                this.loadCallbacks[assetName] = [data];                
                loader.addCallback(this,this.onLoadComplete,this.onLoadProgress,this.onLoadError);
                loader.load(asset,assetType,loaderType);
            }else this.loadCallbacks[assetName].push(data);
        }
    }
    private static onLoadError(err:any):void
    {
        let callbacks = this.loadCallbacks[err.resName];
    //    trace("加载资源出错", err.message, "==resName==>", err.resName, "==等待回调数==>", callbacks ? callbacks.length : 0);
        delete this.loadCallbacks[err.resName];

        if (callbacks == null) return;
        for (let j = 0; j < callbacks.length; j++) {
            if (callbacks[j] == null) continue;
            let fun: FFunction = callbacks[j]["onError"];
            if (fun != null) fun.excute();
        }
        callbacks && (callbacks.length = 0);
    }
    private static onLoadProgress(p:number,loader:any):void
    {
        if(loader instanceof SceneLoader)
        {
            let assetPath = loader.getSceneName(0);
            let callbacks = this.loadCallbacks[assetPath];
            if(callbacks==null)return;
            for(let j = 0;j<callbacks.length;j++)
            {
                if(callbacks[j]==null)continue;
                let fun:FFunction = callbacks[j]["onProgress"];
                if(fun!=null)fun.excute([p]);
            }
        }
    }
    private static onLoadComplete(loader:any):void
    {
        if(loader instanceof Loader)
        {
            for(let i = 0;i<loader.length;i++)
            {
                let assetPath = loader.getURL(i);
                let loaderType = loader.getLoaderType(i);
                let callbacks = this.loadCallbacks[assetPath];
                if(callbacks==null)continue;
                for(let j = 0;j<callbacks.length;j++)
                    this.excuteAssetCallback(assetPath,loaderType,callbacks[j]);
                delete this.loadCallbacks[assetPath];
            }
        }else if(loader instanceof SceneLoader)
        {
            let assetPath = loader.getSceneName(0);
            let callbacks = this.loadCallbacks[assetPath];
            if(callbacks==null)return;
            for(let j = 0;j<callbacks.length;j++)
                this.excuteAssetCallback(assetPath,LoaderType.SCENE,callbacks[j]);
            delete this.loadCallbacks[assetPath];
        }
    }
    private static excuteAssetCallback(assetPath:string,loaderType:LoaderType,data:any):void
    {
        if(loaderType==LoaderType.SPRITE_ATLAS)
        {

            let a = CacheManager.GetCache(assetPath);
            if(!(a instanceof cc.SpriteAtlas))
            {
                console.log("无法获取图集资源--->",assetPath,a);
                return;
            }
            let sf = a.getSpriteFrame(data["assetName"]);
            if(data["sprite"]!=null)
            {
                if(data["sprite"]["node"]&&data["sprite"]["node"]["isValid"])
                    data["sprite"]["spriteFrame"] = sf;
            }
            if(data["button"]!=null)
            {
                if(data["button"]["node"]&&data["button"]["node"]["isValid"])
                    data['button'][data["frameName"]] = sf;
            }
        }else if(loaderType==LoaderType.SPRITE||loaderType==LoaderType.IMAGE)
        {
            let asset = CacheManager.GetCache(assetPath);
            if(asset instanceof cc.Texture2D)// 将Texture2D 转换成SpriteFrame
            {
                asset = new cc.SpriteFrame(asset);
                CacheManager.Cache(assetPath,asset);
            }
            if(data["sprite"]!=null)
            {
                if(data["sprite"]["node"]&&data["sprite"]["node"]["isValid"])
                    data["sprite"]["spriteFrame"]=asset;
            }
            if(data["button"]!=null)
            {
                if(data["button"]["node"]&&data["button"]["node"]["isValid"])
                    data['button'][data["frameName"]] = asset;
            }
        }else if(loaderType==LoaderType.FONT)
        {
            if(data["lable"]!=null)
            {
                if(data["lable"]["node"]&&data["lable"]["node"]["isValid"])
                    data["lable"].font=CacheManager.GetCache(assetPath);
            }
        }else if(loaderType==LoaderType.DRAGON_BONE)
        {
            let dragonBoneData = CacheManager.GetCache(assetPath);
            if(data["armatureDisplay"]!= null&&data["armatureDisplay"]["node"]&&data["armatureDisplay"]["node"]["isValid"])
            {
                data["armatureDisplay"]["dragonAsset"] = null;
                data["armatureDisplay"]["dragonAtlasAsset"] = null;
                data["armatureDisplay"]["armatureName"] = null;
                data["armatureDisplay"]["animationName"] = null;
                data["armatureDisplay"]["dragonAsset"] = dragonBoneData.dragonAsset;
                data["armatureDisplay"]["dragonAtlasAsset"] = dragonBoneData.dragonAtlasAsset; 
                if(data["armatureName"]==null)
                {
                    let armatures:any[] = data["armatureDisplay"]["getArmatureNames"]();
                    data["armatureName"] = armatures[0];
                    if(data["animationName"]==null)
                    {
                        for (let k = 0; k < armatures.length; k++) 
                        {
                            let animations:any[] = data["armatureDisplay"]["getAnimationNames"](armatures[k]);
                            if(animations.length==0)continue;
                            data["armatureName"] = armatures[k];
                            data["animationName"] = animations[0];
                            break;
                        }
                    }
                }else
                {
                    if(data["animationName"]==null)
                    {
                        let animations:any[] = data["armatureDisplay"]["getAnimationNames"](data["armatureName"]);
                        if(animations.length!=0) data["animationName"] = animations[0];
                    }
                }
                if(data["armatureName"]!=null)data["armatureDisplay"]["armatureName"] = data["armatureName"];
                if(data["animationName"]!=null)data["armatureDisplay"]["playAnimation"](data["animationName"],data["playTimes"]?data["playTimes"]:data["armatureDisplay"]["playTimes"]);
                
            }
            // let dragonBoneData = CacheManager.GetCache(assetPath);
            // if(data["armatureDisplay"]!= null&&data["armatureDisplay"]["node"]&&data["armatureDisplay"]["node"]["isValid"])
            // {
            //     data["armatureDisplay"]["dragonAsset"] = null;
            //     data["armatureDisplay"]["dragonAtlasAsset"] = null;
            //     data["armatureDisplay"]["armatureName"] = null;
            //     data["armatureDisplay"]["animationName"] = null;
            //     data["armatureDisplay"]["dragonAsset"] = dragonBoneData.dragonAsset;
            //     data["armatureDisplay"]["dragonAtlasAsset"] = dragonBoneData.dragonAtlasAsset; 
            //     if(data["armatureName"]==null)
            //     {
            //         if(dragonBoneData.dragonAsset["_uuid"]&&dragonBoneData.dragonAtlasAsset["_uuid"])
            //         {
            //             let ak = dragonBoneData.dragonAsset["_uuid"]+"#"+dragonBoneData.dragonAtlasAsset["_uuid"];
            //             let rawData = JSON.parse(dragonBoneData.dragonAsset["_dragonBonesJson"]);
            //             if(data["armatureDisplay"]["_factory"]&&rawData!=null)
            //             {
            //                 let dragonBonesData = data["armatureDisplay"]["_factory"]["parseDragonBonesData"](rawData, ak);;
            //                 //let dragonBonesData = dragonBones.ObjectDataParser.getInstance().parseDragonBonesData(rawData);
            //                 if(dragonBonesData)
            //                 {
            //                     let armatures = dragonBonesData.armatureNames;
            //                     data["armatureName"] = armatures[0];
            //                     if(armatures.length>0&&data["animationName"]==null)
            //                     {
            //                         let armatureData = dragonBonesData["armatures"][data["armatureName"]];
            //                         let animationNames = armatureData["animationNames"];
            //                         if(animationNames.length>0)data["animationName"] = animationNames[0];
            //                     }
            //                 }
            //             }
            //         }
            //     }else
            //     {
            //         if(data["animationName"]==null)
            //         {
            //             let animations:any[] = data["armatureDisplay"]["getAnimationNames"](data["armatureName"]);
            //             if(animations.length!=0) data["animationName"] = animations[0];
            //         }
            //     }
            //     if(data["armatureName"]!=null)data["armatureDisplay"]["armatureName"] = data["armatureName"];
            //     if(data["animationName"]!=null)data["armatureDisplay"]["playAnimation"](data["animationName"],data["playTimes"]?data["playTimes"]:data["armatureDisplay"]["playTimes"]);
            // }
        }
        let fun:FFunction = data["onComplete"];
        if(fun!=null)
        {
            if(data["args"]==null)data["args"]=[];
            data["args"].unshift(assetPath);
            if(fun.length==0)fun.excute();
            else fun.excute(data["args"]);
        } 
    }
    /**实例化预制体，只有先加载才能实例成功 */
    public static InstantiatePrefab(prefabName: string): any 
    {
        let prefabAsset = Assets.GetPrefab(prefabName);
        let c = CacheManager.GetCache(prefabAsset);
        if (c != null) return cc.instantiate(c);
        return null;
    }
}
