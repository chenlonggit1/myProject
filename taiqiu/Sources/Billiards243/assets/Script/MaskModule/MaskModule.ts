import { FModule } from "../../Framework/Core/FModule";
import { stageWidth } from "../../Framework/Utility/dx/stageWidth";
import { stageHeight } from "../../Framework/Utility/dx/stageHeight";


/**
*@description:遮罩模块
**/
export class MaskModule extends FModule
{
    public static ClassName:string = "MaskModule";
	private graphics:cc.Graphics;
    private hasBlockInput:boolean = false;
    private _alpha: number = 0;
    public get alpha(): number {return this._alpha;}
    public set alpha(value: number) 
    {
        this._alpha = value;
        if(this.graphics!=null)
        {
            this.graphics.clear();
            this.graphics.fillColor = new cc.Color(0,0,0,value);
            this.graphics.fillRect(-stageWidth()/2,-stageHeight()/2,stageWidth(),stageHeight());
        }
    }
    protected createMainNode():cc.Node
    {
        let n = super.createMainNode();
        this.graphics = n.addComponent(cc.Graphics);
        return n;
    }
    protected showViews():void
    {
        super.showViews();
        let alpha = 200;
        let intercept = true;
        if(this.moduleData!=null)
        {
            if(this.moduleData.hasOwnProperty("alpha"))
                alpha = this.moduleData["alpha"];
            if(this.moduleData.hasOwnProperty("intercept"))
                intercept = this.moduleData["intercept"];
        }
        this.alpha = 200;
        if(intercept)
        {
            if(!this.hasBlockInput)
            {
                this.node.addComponent(cc.BlockInputEvents);
                this.node.setContentSize(stageWidth(),stageHeight());
                this.node.width = stageWidth();
                this.node.height = stageHeight();
                this.hasBlockInput = true;
            }
        }else
        {
            if(this.hasBlockInput)
                this.node.removeComponent(cc.BlockInputEvents);
            this.hasBlockInput = false;
        }
    }
    public hide(data?:object):void
    {
        super.hide(data);
    }

    public dispose():void
    {
        super.dispose();
    }
}
