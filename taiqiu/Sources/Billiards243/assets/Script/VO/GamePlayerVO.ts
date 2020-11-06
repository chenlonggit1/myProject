import { SimplePlayerVO } from "./SimplePlayerVO";

export class GamePlayerVO extends SimplePlayerVO 
{
    public static ClassName:string = "GamePlayerVO";
    /**
     * 当前对象不存在正在解析的属性值
     */
    protected unOwnSetProperty(thisObj:object,data:object,property:string):void
    {
        super.unOwnSetProperty(thisObj,data,property);
        if(property=="idsList")
            this.pocketBalls = data[property];
    }
}
