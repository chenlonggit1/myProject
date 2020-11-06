import { Application } from "../../Core/Application";


export function stageHeight():number
{
	if(CC_EDITOR)return cc.Canvas.instance.node.height;
	return Application.Size.y;
}