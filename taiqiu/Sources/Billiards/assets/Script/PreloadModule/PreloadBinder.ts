import { FBinder } from "../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../Framework/Utility/dx/getNodeChildByName";

/**
*@description:预加载转圈圈模块
**/
export class PreloadBinder extends FBinder 
{
	public static ClassName:string = "PreloadBinder";

	protected progress:cc.ProgressBar = null;
	protected info:cc.Label = null;
	
	protected initViews():void
	{
		super.initViews();
		this.progress = getNodeChildByName(this.asset,"ProgressBar",cc.ProgressBar);
		this.info = getNodeChildByName(this.asset,"Text",cc.Label);
	}
	public setProgress(p:any)
	{
		if(p!=null)
		{
			this.progress.progress = p;
			this.progress.node.active = true;
		}else this.progress.node.active = false;
	}
	public setMsg(msg:string)
	{
		if(msg!=null)
		{
			this.info.string = msg;
			this.info.node.active = true;
		}else this.info.node.active = false;
	}
}