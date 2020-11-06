
import { LoaderType } from "../Enums/LoaderType";
import { AudioType } from "../Enums/AudioType";
import { LanguageManager } from "../Managers/LanguageManager";

export class Assets
{
    /**预制体目录 */
    public prefabs:string = "Prefabs/";
    /**音频目录 */
    public audios:string = "Audios/";
    /**图集、图片素材目录 */
    public textures:string = "Textures/";
    /**多语言配置目录 */
    public languages:string = "Languages/";
    /**字体目录 */
    public fonts:string = "Fonts/";
    /**龙骨动画目录 */
    public dragonBones:string = "DragonBones/";

    private static effectDir:string = "Effects/";
    private static voiceDir:string = "Voices/";
    private static musicDir:string = "Musics/";


    private static _instance = null;
    public static get instance():Assets
    {
        if(Assets._instance==null)
            Assets._instance = new Assets();
        return Assets._instance;
    }
    public constructor()
    {
        Assets._instance = this;
    }
    public static GetAudio(audioName:string,audioType:AudioType):string
    {
        var dir:string = this.musicDir;
        if(audioType==AudioType.EFFECT)dir = this.effectDir;
        else if(audioType==AudioType.VOICE)dir = this.voiceDir+LanguageManager.CurrentName+"/";
        return Assets.instance.audios+dir+audioName;
    }
    public static GetPrefab(prefabName:string):string
    {
        if(prefabName.indexOf(Assets.instance.prefabs)==0)return prefabName;
        return Assets.instance.prefabs+prefabName;
    }
    public static GetTexture(assetName:string,extension:string = "png"):string
    {
        // if(CC_EDITOR)
        // {
        //     if(assetName.indexOf(":")!=-1)return "resources/"+Assets.instance.textures+assetName;
        //     return "resources/"+Assets.instance.textures+assetName+"."+extension;
        // }
        return (Assets.instance.textures+assetName);
    }
    public static GetFonts(assetName:string):string
    {
        // if(CC_EDITOR)return "resources/"+Assets.instance.fonts+assetName+".fnt";
        return Assets.instance.fonts+assetName;
    }
    public static GetLanguage(languageName:string):string
    {
        //if(CC_EDITOR)return "resources/"+Assets.instance.languages+languageName+".json";
        return Assets.instance.languages+languageName;
    }
    public static GetDragonBone(dragonBoneName:string):{name:string,ske:string,tex:string,img:string}
    {
        return {name:Assets.instance.dragonBones+dragonBoneName,ske:Assets.instance.dragonBones+dragonBoneName+"_ske",tex:Assets.instance.dragonBones+dragonBoneName+"_tex",img:Assets.instance.dragonBones+dragonBoneName+"_tex"};
    }

    public static GetAssets(assets:any[]):{assets:string[],assetTypes:cc.Asset[]}
    {
        let data = {assets:[],assetTypes:[]};
        for (let i = 0; i < assets.length; i++) 
        {
            if(assets[i]==null)continue;
            if(typeof assets[i]==="string")
            {
                data.assets.push(this.GetPrefab(assets[i]));
                data.assetTypes.push(cc.Prefab);
            }else if(assets[i].type==LoaderType.PREFAB)
            {
                data.assets.push(this.GetPrefab(assets[i].asset));
                data.assetTypes.push(cc.Prefab);
            }else if(assets[i].type==LoaderType.AUDIO)
            {
                // data.assets.push(AudioManager.GetAudioURL(assets[i].asset,assets[i].audioType));
                // data.assetTypes.push(cc.AudioClip);
            }else if(assets[i].type==LoaderType.IMAGE)
            {
                data.assets.push(this.GetTexture(assets[i].asset));
                data.assetTypes.push(cc.Texture2D);
            }else if(assets[i].type==LoaderType.DRAGON_BONE)
            {
                let dragonBoneData = Assets.GetDragonBone(assets[i].asset);
                data.assets.push(dragonBoneData.ske);
                data.assetTypes.push(dragonBones.DragonBonesAsset);
                data.assets.push(dragonBoneData.tex);
                data.assetTypes.push(dragonBones.DragonBonesAtlasAsset);
                //// 只在释放资源时才起作用，加载资源时无效
                data.assets.push(dragonBoneData.name);
                data.assetTypes.push(null);// 
            }else if(assets[i].type==LoaderType.SPRITE_ATLAS)
            {
                data.assets.push(this.GetTexture(assets[i].asset));
                data.assetTypes.push(cc.SpriteAtlas);
            }
        }
        return data;
    }
}
