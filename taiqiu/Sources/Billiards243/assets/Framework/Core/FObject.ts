import { ObjectUtility } from "../Utility/ObjectUtility";


export class FObject
{
    public update(data:object):void
    {
        this.analysis(data);
    }
    protected analysis(data:object,...customPropertys):void
    {
		ObjectUtility.Analysis(this,this,data,this.customSetProperty,this.unOwnSetProperty,customPropertys);
    }
    /**
     * 当前对象不存在正在解析的属性值
     */
    protected unOwnSetProperty(thisObj:object,data:object,property:string):void
    {
    }
    /**
     * 设置自定义的属性
     */		
    protected customSetProperty(thisObj:object,data:object,property:string):void
    {
        if(this[property]!=null&&this[property] instanceof FObject)
            this[property].update(data[property]);
        else this.unOwnSetProperty(thisObj,data,property);
    }
    public clone():object
    {
        return null;
    }
}