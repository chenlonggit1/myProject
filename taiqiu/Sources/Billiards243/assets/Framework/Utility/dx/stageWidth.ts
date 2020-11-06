import { Application } from "../../Core/Application";


export function stageWidth():number
{
	if(CC_EDITOR)return cc.Canvas.instance.node.width;
	return Application.Size.x;
}
