import { FFunction } from "../Core/FFunction";

export class JuggleFramer
{
    public static ClassName:string = "JuggleFramer";
    public onFrame:FFunction = null;
    protected isRunning:boolean = false;
    protected handler:number = 0;
    protected isRender:boolean = false;
    public constructor()
    {
        let vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i)
        {
            var vp = vendors[i];
            window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
            window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']||window[vp+'CancelRequestAnimationFrame']);
        }
        // window.requestAnimationFrame = null;
        if(!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback){return setTimeout(()=>callback(17),17);}
        if(!window.cancelAnimationFrame)
            window.cancelAnimationFrame = clearTimeout;
    }
    public start()
    {
        if(this.isRunning&&this.onFrame!=null)return;
        this.isRunning = true;
        this.isRender = false;
        this.render();
    }
    protected render()
    {
        if(!this.isRunning&&this.onFrame==null)return;
        if(this.isRender)this.onFrame.excute();
        this.isRender = true;
        this.handler = window.requestAnimationFrame(()=>this.render());
    }
    public stop()
    {
        if(!this.isRunning)return;
        this.isRunning = false;
        this.isRender = false;
        window.cancelAnimationFrame(this.handler);
    }
}
