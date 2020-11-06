

export class PointUtility
{
    private static DEG_TO_RAD:number = Math.PI / 180;
    /**
     * 从 (0,0) 到此点的线段长度
     */
    public static Length(p:cc.Vec2):number
    {
        return Math.sqrt(p.x*p.x+p.y*p.y);
    }

    /**
     *  返回 pt1 和 pt2 之间的距离。
     */
    public static Distance(p1:cc.Vec2, p2:cc.Vec2):number
    {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }
    /**
     * 确定两个指定点之间的点。
     * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
     * @param pt1 第一个点。
     * @param pt2 第二个点。
     * @param f 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
     * @returns 新的内插点。
     */
    public static InterPolate(pt1:cc.Vec2, pt2:cc.Vec2, f:number):cc.Vec2 
    {
        let f1:number = 1 - f;
        return cc.v2(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
    }

    public static ToFixed(p:cc.Vec2|cc.Vec3,digits:number):any
    {
        if(!p)return null;
        p.x = parseFloat(p["x"].toFixed(digits));
        p.y = parseFloat(p["y"].toFixed(digits));
        if(p.hasOwnProperty("z"))p["z"] = parseFloat(p["z"].toFixed(digits));
        return p;
    }


    public static ReversePoint(v:cc.Vec2):cc.Vec2
    {
        let y: number = v.y;
        v.y = v.x;
        v.x = y;
        return v;
    }

    /**从指定点向某个角度延长线 */
    public static LengthenPoint(p:cc.Vec2,angle:number,len:number,axis:cc.Vec2 = cc.v2(1,1))
    {
        angle = cc.misc.degreesToRadians(angle);
        return cc.v2(Math.cos(angle)*axis.x,Math.sin(angle)*axis.y).mul(len).addSelf(p);
    }
    public static Object2Point(p:cc.Vec2|cc.Vec3,obj:any):any
    {
        if(!obj)return null;
        p.x = obj.x;
        p.y = obj.y;
        if(p.hasOwnProperty("z"))p["z"] = obj.z;
        return p;
    }

    /**
	 * 求圆和直线之间的交点
	 * 直线方程：y = kx + b
	 * 圆的方程：(x - m)² + (x - n)² = r²
	 * x1, y1 = 线坐标1, x2, y2 = 线坐标2, m, n = 圆坐标, r = 半径, sourcePos = 源头坐标
	 */
	public static getInsertPointBetweenCircleAndLine(x1, y1, x2, y2, m, n, r, sourcePos):number {
		let result = 0;
		let kbArr = this.binaryEquationGetKB(x1, y1, x2, y2);
		let k = kbArr[0];
		let b = kbArr[1];

		let aX = 1 + k * k;
		let bX = 2 * k * (b - n) - 2 * m;
		let cX = m * m + (b - n) * (b - n) - r * r;

		let insertPoints = [];
		let xArr = this.quadEquationGetX(aX, bX, cX);
		xArr.forEach(x => {
			let y = k * x + b;
			insertPoints.push(cc.v2(x,y));
		})
		if(insertPoints.length == 0)
			return result;
		else if(insertPoints.length == 1) {
			let curPos = (insertPoints[0]).sub(sourcePos);
			let distanceVal = Math.sqrt(curPos.x * curPos.x + curPos.y * curPos.y);
			return distanceVal;
		} else {
			let curPos1 = (insertPoints[0]).sub(sourcePos);
			let distanceVal1 = Math.sqrt(curPos1.x * curPos1.x + curPos1.y * curPos1.y);
			let curPos2 = (insertPoints[1]).sub(sourcePos);
			let distanceVal2 = Math.sqrt(curPos2.x * curPos2.x + curPos2.y * curPos2.y);
			result = distanceVal1 < distanceVal2 ? distanceVal1 : distanceVal2;
			return result;
		}
	}

	/**
	 * 求二元一次方程的系数
	 * y1 = k * x1 + b => k = (y1 - b) / x1
	 * y2 = k * x2 + b => y2 = ((y1 - b) / x1) * x2 + b
	 */
	private static binaryEquationGetKB(x1, y1, x2, y2) {
		let k = (y1 - y2) / (x1 - x2);
		let b = (x1 * y2 - x2 * y1) / (x1 - x2);
		return [k, b];
	}

	/**
	 * 一元二次方程求根
	 * ax² + bx + c = 0
	 */
	public static quadEquationGetX(a, b, c) {
		let xArr = [];
		let result = Math.pow(b, 2) - 4 * a * c;
		if (result > 0) {
			xArr.push((-b + Math.sqrt(result)) / (2 * a));
			xArr.push((-b - Math.sqrt(result)) / (2 * a));
		} else if (result == 0) {
			xArr.push(-b / (2 * a));
		}
		return xArr;
	}
}
