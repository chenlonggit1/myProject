import { CanvasOffset } from "../../../Script/Common/CanvasOffset";
import { getCamera } from "./getCamera";

export function convertToScreen(node:cc.Node):cc.Vec2
{
    let camera = getCamera("3D Camera");
    let worldPos = node.convertToWorldSpaceAR(cc.v3());
    let screenPos: any = camera.getWorldToScreenPoint(worldPos);
    screenPos = cc.v2(screenPos.x, screenPos.y).sub(CanvasOffset.Offset);
    return screenPos;
}
