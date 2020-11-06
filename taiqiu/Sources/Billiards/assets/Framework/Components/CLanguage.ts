
import { ILanguage } from "../Interfaces/ILanguage";
import { LanguageType } from "../Enums/LanguageType";
import { CLanguageButtonInfo } from "./Infos/CLanguageButtonInfo";
import { excuteNodeEvents } from "../Utility/dx/excuteNodeEvents";
import { LanguageManager } from "../Managers/LanguageManager";
import { AssetUtility } from "../Utility/AssetUtility";
import { ResourceManager } from "../Managers/ResourceManager";
import { formatString } from "../Utility/dx/formatString";
import { EventManager } from "../Managers/EventManager";


const {ccclass, property,executeInEditMode,menu} = cc._decorator;
@ccclass
@menu('Components/多语言组件/CLanguage')
@executeInEditMode
export class CLanguage extends cc.Component implements ILanguage
{
    public static ClassName:string = "CLanguage";
    @property({type:cc.Enum(LanguageType)})
    private _type:LanguageType = LanguageType.TEXT;
    @property({serializable:true})
    private _target: cc.Node = null;
    @property({serializable:true})
    private _key:string = "";
    @property({type:CLanguageButtonInfo,serializable:true})
    private _buttonInfo:CLanguageButtonInfo = null;
    @property({ serializable:true })
    private _appendLangIndex: boolean = false;
    @property({type:cc.String})
    private _args: string[] = [];

    @property({type:cc.Enum(LanguageType),tooltip:"多语言类型"})
    public get type():LanguageType{return this._type;};
    public set type(value:LanguageType)
    {
        if(this._type==value)return;
        this._type = value;
        this.invalidate();
    }
    @property({type:cc.Node,tooltip:"多语言目标Node，Text支持cc.Label和cc.RichText"})
    public get target():cc.Node{return this._target;};
    public set target(value:cc.Node)
    {
        if(this._target==value)return;
        this._target = value;
        this.invalidate();
    }
    @property({serializable:true,visible(){return this.type==LanguageType.TEXT||this.type==LanguageType.SPRITE},tooltip:"多语言文件中的Key值"})
    public get key():string{return this._key;};
    public set key(v:string)
    {
        if(this._key==v)return;
        this._key = v;
        this.invalidate();
    }
    @property({type:CLanguageButtonInfo,visible(){return this.type==LanguageType.BUTTON},tooltip:"多语言Button设置"})
    public get buttonInfo():CLanguageButtonInfo{return this._buttonInfo;};
    public set buttonInfo(value:CLanguageButtonInfo)
    {
        this._buttonInfo = value;
        this._buttonInfo.callback = this.invalidate.bind(this);
    }
    @property({ visible() { return this.type== LanguageType.SPRITE||this.type==LanguageType.BUTTON },tooltip:"在多语言取Key值会在key值后面拼接上当前的多语言下标值"})
    public get appendLangIndex(): boolean {return this._appendLangIndex;}
    public set appendLangIndex(value: boolean) 
    {
        this._appendLangIndex = value;
        this.invalidate();
    }
    @property({type:cc.String,visible(){return this.type!=LanguageType.FUNCTION},tooltip:"显示多语言文本时，允许使用{0}...{n}的方式格式化字符串"})
    public get args(): string[] {return this._args;}
    public set args(value: string[]) 
    {
        this._args = value;
        this.invalidate();
    }
    /**绑定事件 */
    @property({ type: [cc.Component.EventHandler] ,visible(){return this.type==LanguageType.FUNCTION}})
    private events: Array<cc.Component.EventHandler> = [];
    private _comp: cc.Component = null;

    public start():void
    {
        this.invalidate();
    }
    public onChangeLanguage(currentIndex?: number) 
    {
        if(this.type!=LanguageType.FUNCTION)this.invalidate();
        else excuteNodeEvents(this.events);
    }

    protected invalidate(): void
    {
        if(LanguageManager.CurrentIndex<0)// 当前多语言文件还未加载
        {
            if(CC_EDITOR)
            {
                LanguageManager.ChangeLanguage(0);
                setTimeout(() =>this.invalidate(), 100);
            }
            return;
        }
        let c:any = this.comp;
        if(c==null)return;
        if(this.type==LanguageType.TEXT)
        {
            if(this.key=="")c.string = "";
            else 
            {
                let asset = this.getAsset(this.key);
                if(asset==null||asset=="null")c.font = null;
                else 
                {
                    let assets = AssetUtility.SplitAtlas(asset);
                    if(assets.length>1&&assets[0]!=""&&assets[0]!="null")
                    {
                        let ff = assets.shift();//
                        let atlas = AssetUtility.GetAtlas(ff);
                        if(atlas!=""&&atlas!=null&&atlas!="null")ResourceManager.LoadFont(atlas,c);
                        else if(ff!=""&&ff!=null&&ff!="null")ResourceManager.LoadFont(ff,c);
                        else c.font = null;
                    }
                    else c.font = null;
                    if(!c.font){
                        cc.assetManager.resources.load("Fonts/ALKATIPTor",cc.Font,(err,res)=>{
                            if(this.node) {
                                c.font = res;
                                c._forceUpdateRenderData(true);
                            }
                        })
                    }
                    c.string = assets[0];
                }
            }
        }else if(this.type==LanguageType.SPRITE)
        {
            let asset = this.getAsset(this.key);
            if(asset==null||asset=="null")c.spriteFrame = null;
            else 
            {
                if(this.appendLangIndex)asset = asset+LanguageManager.CurrentIndex;
                ResourceManager.LoadSpriteFrame(asset,c);
            }
        }else if(this.type==LanguageType.BUTTON)
        {
            if(this.buttonInfo==null)return;
            if(this.buttonInfo.normal!="")
            {
                let asset = this.getAsset(this.buttonInfo.normal);
                if(this.appendLangIndex)asset = asset+LanguageManager.CurrentIndex;
                ResourceManager.LoadButtonSpriteFrame(asset,c,"normalSprite");
            }
            if(this.buttonInfo.pressed!="")
            {
                let asset = this.getAsset(this.buttonInfo.pressed);
                if(this.appendLangIndex)asset = asset+LanguageManager.CurrentIndex;
                ResourceManager.LoadButtonSpriteFrame(asset,c,"pressedSprite");
            }
            if(this.buttonInfo.hover!="")
            {
                let asset = this.getAsset(this.buttonInfo.hover);
                if(this.appendLangIndex)asset = asset+LanguageManager.CurrentIndex;
                ResourceManager.LoadButtonSpriteFrame(asset,c,"hoverSprite");
            }
            if(this.buttonInfo.disabled!="")
            {
                let asset = this.getAsset(this.buttonInfo.disabled);
                if(this.appendLangIndex)asset = asset+LanguageManager.CurrentIndex;
                ResourceManager.LoadButtonSpriteFrame(asset,c,"disabledSprite");
            }
        }
    }
    private getAsset(k:string):string{return formatString(AssetUtility.GetAtlas(k),this.args);}
    public get comp(): cc.Component 
    {
        if(this.target==null&&this.node!=null)this.target = this.node;
        if(this._comp!=null)return this._comp;
        let temp = null;
        if(this.type==LanguageType.SPRITE)temp = this.target.getComponent(cc.Sprite);
        else if(this.type==LanguageType.BUTTON)temp = this.target.getComponent(cc.Button);
        else if(this.type==LanguageType.TEXT)
        {
            if(this.target){
                temp = this.target.getComponent(cc.Label);
                if(temp==null)temp = this.target.getComponent(cc.RichText);
            }
            
        }
        if(!CC_EDITOR)this._comp = temp;
        return temp;
    }
    onEnable():void
    {
        LanguageManager.AddItem(this);
    }
    onDisable():void{
        EventManager.removeEvent(this);
        LanguageManager.RemoveItem(this);
        //移除render的呼叫
    }
}