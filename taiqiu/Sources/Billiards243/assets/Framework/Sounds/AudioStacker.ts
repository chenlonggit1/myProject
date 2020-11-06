import { Audio } from "./Audio";
import { StoreManager } from "../Managers/StoreManager";


export class AudioStacker
{
    public static ClassName:string = "AudioStacker";
    public onComplete:Function;
    public loop:boolean = false;
    private audios:string[] = [];
    private _currentAudio: Audio = null;
    public get currentAudio(): Audio {return this._currentAudio;}
    
    private isPlaying:boolean = false;
    private _volume: number = 1;
    private isForceStop:boolean = false;


    public get volume(): number {return this._volume;}
    public set volume(value: number) 
    {
        this._volume = value;
        this.currentAudio&&(this.currentAudio.volume = this._volume);
        if(value>0&&this.isForceStop&&this.isPlaying)
        {
            this.isForceStop = false;
            this.playNextSound();
        }
    }

    /**添加一个声音（注意：相同的声音可以重复添加）**/
    public addAudio(audioName:string):void
    {
        this.audios.push(audioName);
    }
    public play():void
    {
        if(this.isPlaying)return;
        this.isPlaying = true;
        this.playNextSound();
    }
    private playNextSound():void
    {
        if(this.volume==0&&this.loop&&this.isPlaying)
        {
            this.isForceStop = true;
            return;
        }
        if(this.audios.length==0)
        {
            if(this.onComplete!=null)
            {
                if(this.onComplete.length==0)this.onComplete();
                else this.onComplete(this);
            }
            this.clear();
        }else
        {
            let audioName = this.audios.shift();
            this.currentAudio&&this.currentAudio.dispose();
            this._currentAudio = StoreManager.New(Audio);
            this.currentAudio.volume = this.volume;
            this.currentAudio.name = audioName;
            this.currentAudio.audioAsset = audioName;
            this.currentAudio.onComplete = this.playNextSound.bind(this);
            this.currentAudio.play();
            if(this.loop)this.audios.push(audioName);
        }
    }
    public clear():void
    {
        this.isPlaying = false;
        this.currentAudio&&this.currentAudio.dispose();
        this._currentAudio = null;
        this.audios.length = 0;
        this.loop = false;
        this.isForceStop = false;
    }
    public dispose():void
    {
        this.clear();
        this.onComplete = null;
        this._currentAudio = null;
    }
}
