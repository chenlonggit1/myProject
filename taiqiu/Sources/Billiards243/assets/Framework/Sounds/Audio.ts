import { CacheManager } from "../Managers/CacheManager";
import { ResourceManager } from "../Managers/ResourceManager";
import { StoreManager } from "../Managers/StoreManager";
import { Fun } from "../Utility/dx/Fun";



export class Audio
{
    public static ClassName:string = "Audio";
    public name:string;
    public audioAsset:string;
    public onComplete:Function;
    public loop:boolean = false;
    private _volume: number = 1;
    

    private _sound:cc.AudioClip;
    private _isPlaying:boolean = false;
    private audioID:number = -1;

    public get isPlaying():boolean{return this._isPlaying;}
    public get volume(): number {return this._volume;}
    public set volume(value: number) 
    {
        this._volume = value;
        if(this._sound!=null&&this.audioID!=-1)
            cc.audioEngine.setVolume(this.audioID,this._volume);
    }

    public play():void
    {
        if(this.audioAsset==null||this.audioAsset==""||this.isPlaying)return;
        this._isPlaying = true;
        // let audioAsset = Assets.GetAudio(this.url);
        this._sound = CacheManager.GetCache(this.audioAsset);
        if(this._sound!=null)this.playSound();
        else ResourceManager.LoadAudio(this.name,Fun(this.onAudioComplete,this));
    }
    public stop():void
    {
        if(!this.isPlaying)return;
        this._isPlaying = false;
        this.stopSound();
    }
    private onAudioComplete(resName:string):void
    {
        this._sound = CacheManager.GetCache(resName);
        if(this.isPlaying)this.playSound();
    }
    private playSound():void
    {
        if(this._sound==null)return;
        this.audioID = cc.audioEngine.play(this._sound,this.loop,this.volume);
        cc.audioEngine.setFinishCallback(this.audioID,()=>this.onPlayAudioComplete());
    }
    private stopSound():void
    {
        if(this._sound==null||this.audioID==-1)return;
        cc.audioEngine.stop(this.audioID)
    }
    private onPlayAudioComplete():void
    {
        this.audioID = -1;
        if(this.onComplete!=null)
            this.onComplete();
    }
    public dispose():void
    {
        this.onComplete = null;
        this.stopSound();
        this.name = null;
        this._isPlaying = false;
        this._sound = null;
        this.volume = 1;
        this.loop = false;
        this.audioID = -1;
        StoreManager.Store(this);
    }
}
