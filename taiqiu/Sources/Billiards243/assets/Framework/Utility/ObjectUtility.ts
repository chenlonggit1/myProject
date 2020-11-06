import { getQualifiedClassName } from "./dx/getQualifiedClassName";
import { FObject } from "../Core/FObject";


export class ObjectUtility
{
    public ObjectUtility()
    {
    }

    public static GetObjectClassName(o:Object):string
    {
        var str:String = getQualifiedClassName(o);
        return str.substring(str.indexOf("::"));
    }

    public static SetProperty(target:object,source:object):void
    {
        for (var property in source) 
        {
            target[property] = source[property];  
        }
    }

    public static Analysis(thisObj:any,target:object,source:object,customSetProperty:Function,unOwnProperty:Function,customPropertys:any[]):void
    {
        if(source == null) return;
        for(var property in source)
        {
            if(target.hasOwnProperty(property))
            {
                if(customPropertys.length == 0 || customPropertys.indexOf(property) == -1)
                {
                    if(target[property]!=source[property])
                        target[property] = source[property];
                }
                else
                {
                    if(customSetProperty!=null)
                        customSetProperty.call(thisObj,target,source,property);
                }
            }
            else
            {
                if(unOwnProperty != null)
                    unOwnProperty.call(thisObj,target,source, property)
            }
        }
    }

    public static CloneObject(source:Object):any
    {
    }

    public static ToArray(v:any):any[]
    {
        var arr = [];
        for(var i:number = 0;i<v.length;i++)
            arr[i] = v[i];
        return arr;
    }

    public static TransformObjectVector(data:any,clz:any):any[]
    {
        if(data)
        {
            var arr:any[] = [];
            if(data.hasOwnProperty("length")){
                for(var i:number = 0;i<data.length;i++)
                {
                    if(clz==String||clz==Number||clz==Boolean)arr.push(data[i]);
                    else
                    {
                        var v:any = new clz();
                        if(v instanceof FObject)v.update(data[i]);
                        else this.Analysis(this,v,data[i],this.CustomSetProperty,this.CustomSetProperty,[]);
                        arr.push(v);
                    }
                }
            }else{
                // 如果是字典
                for (var key in data) {
                    arr[key] = data[key];
                }
            }
            
            return arr;
        }
        return [];
    }
    
    private static CustomSetProperty(thisObj:object,data:object,property:string):void{}
}
