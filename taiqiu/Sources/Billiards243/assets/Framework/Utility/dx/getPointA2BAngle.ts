/**
 * 获取两点之间的角度
 * A为开始点
 * B为结束点
 */
export function getPointA2BAngle(pointA:cc.Vec2,pointB:cc.Vec2,initAngle:number=0)
{
    let offset = pointB.sub(pointA);
    let radian:number= Math.atan2(offset.y,offset.x);//反正切函数求出弧度值
    return (radian* 180 / Math.PI)+initAngle;
}
