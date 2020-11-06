import { AudioType } from "../Enums/AudioType";
import { LanguageManager } from "./LanguageManager";
import { StoreManager } from "./StoreManager";
import { AudioStacker } from "../Sounds/AudioStacker";
import { Assets } from "../Core/Assets";

export class AudioManager 
{
    private static music:AudioStacker;
    private static effect:AudioStacker;
    private static voice:AudioStacker;
    private static isCanPlayEffect:boolean = true;
    private static isCanPlayMusic:boolean = true;
    private static effectVolum:number = 1;
    private static musicVolume:number = 1;

    public static get IsCanPlayEffect():boolean{return this.isCanPlayEffect;}
    public static get IsCanPlayMusic():boolean{return this.isCanPlayMusic;}

    public static get EffectVolum():number{return this.effectVolum;}
    public static get MusicVolume():number{return this.musicVolume;}
    
    public static set IsCanPlayEffect(v:boolean)
    {
        if(this.isCanPlayEffect==v)return;
        this.isCanPlayEffect = v;
    }
    public static set IsCanPlayMusic(v:boolean)
    {
        if(this.isCanPlayMusic==v)return;
        this.isCanPlayMusic = v;
        if(!v&&this.music)this.music.clear();
    }
    public static set EffectVolum(v:number)
    {
        if(this.effectVolum==v)return;
        this.effectVolum = v;
        this.effect&&(this.effect.volume =  this.effectVolum);
        this.voice&&(this.voice.volume =  this.effectVolum);
    }
    public static set MusicVolume(v:number)
    {
        if(this.musicVolume==v)return;
        this.musicVolume = v;
        this.music&&(this.music.volume = this.musicVolume);
    }

    /**播放特效**/
    public static PlayEffect(audioName:string,isAlone:boolean=true):void
    {
        if(!this.IsCanPlayEffect)return;
        let s:AudioStacker = null;        
        if(isAlone)
        {
            s = StoreManager.New(AudioStacker);
            s.onComplete = s.dispose;
            s.clear();
        }else
        {
            if(this.effect==null)this.effect = StoreManager.New(AudioStacker);
            s = this.effect;
        }
        s.volume = this.effectVolum;
        s.addAudio(Assets.GetAudio(audioName,AudioType.EFFECT));
        s.play();
    }
    /**播放人声（需要区分多语言）**/
    public static PlayVoice(audioName:string,isAlone:boolean=false):void
    {
        if(!this.IsCanPlayEffect)return;
		let s:AudioStacker = null;
        if(isAlone)
        {
            s = StoreManager.New(AudioStacker);
            s.onComplete = s.dispose;
            s.clear();
        }else
        {
            if(this.voice==null)this.voice = StoreManager.New(AudioStacker);
            s = this.voice;
        }
        s.volume = this.effectVolum;
        s.addAudio(Assets.GetAudio(audioName,AudioType.VOICE));
        s.play();
    }
    /**播放数字人声（需要区分多语言）**/
    public static PlayNumVoice(audioName:string):void
    {
        if(!this.IsCanPlayEffect)return;
        if(this.voice==null)this.voice = StoreManager.New(AudioStacker);
        this.voice.addAudio(Assets.GetAudio(audioName,AudioType.VOICE));
        this.voice.play();
    }
    /**播放音乐**/
    public static PlayMusic(audioName:string):void
    {
        if(!this.IsCanPlayMusic)return;
        if(this.music==null)this.music = StoreManager.New(AudioStacker);
        let musicName = Assets.GetAudio(audioName,AudioType.MUSIC);
        if(this.music.currentAudio&&this.music.currentAudio.name==musicName)return;
        this.music.volume = this.musicVolume;
        this.music.clear();
        this.music.loop = true;
        this.music.addAudio(musicName);
        this.music.play();
    }
    // public static GetAudioURL(audioName:string,audioType:AudioType):string
    // {
    //     var dir:string = this.musicDir;
    //     if(audioType==AudioType.EFFECT)dir = this.effectDir;
    //     else if(audioType==AudioType.VOICE)dir = this.voiceDir+LanguageManager.CurrentName+"/";
    //     return dir+audioName;
    // }
     /* 停止所有的聲音播放 */
     public static StopPlay(){
        if(this.effect) this.effect.clear();
        if(this.voice) this.voice.clear();
    }
}