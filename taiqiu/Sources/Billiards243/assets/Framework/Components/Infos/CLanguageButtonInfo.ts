
const {ccclass, property} = cc._decorator;
/**
 * 多语言中按钮的设置数据
 */
@ccclass("CLanguageButtonInfo")
export class CLanguageButtonInfo
{
    public static ClassName:string = "CLanguageButtonInfo";
    @property({serializable:true})
    private _normal: string = "";
    @property({serializable:true})
    public get normal(): string {return this._normal;}
    public set normal(value: string) 
    {
        this._normal = value;
        this.updateStatus();
    }
    @property({serializable:true})
    private _pressed: string = "";
    @property({serializable:true})
    public get pressed(): string {return this._pressed;}
    public set pressed(value: string) 
    {
        this._pressed = value;
        this.updateStatus();
    }
    @property({serializable:true})
    private _hover: string = "";
    @property({serializable:true})
    public get hover(): string {return this._hover;}
    public set hover(value: string) 
    {
        this._hover = value;
        this.updateStatus();
    }
    @property({serializable:true})
    private _disabled: string = "";
    @property({serializable:true})
    public get disabled(): string {return this._disabled;}
    public set disabled(value: string) 
    {
        this._disabled = value;
        this.updateStatus();
    }
    private updateStatus()
    {
        if(this.callback!=null)
            this.callback();
            
    }
    public callback:Function = null;
}
