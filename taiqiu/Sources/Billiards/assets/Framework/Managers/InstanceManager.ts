import { getQualifiedClassName } from "../Utility/dx/getQualifiedClassName";

export class InstanceManager
{

    private static instanceDict:{[key:string]:any} = {};
    /**获取单例**/
    public static GetInstance(clz:any,instanceName?:any):any
    {
        var c:string = instanceName?instanceName:getQualifiedClassName(clz);
        if(!this.instanceDict[c])this.instanceDict[c] = new clz();//.add(c,new clz());//[c] = new clz();
        let o:any = this.instanceDict[c];
        if(instanceName&&o.hasOwnProperty("name"))o.name = instanceName;
        return o;
    }
    public static HasInstance(instanceName:any):Boolean
    {
        return this.instanceDict[instanceName]!=null;
    }
    public static DisposeInstance(instanceName:any):void
    {
        if(this.instanceDict[instanceName])
        {
            let o:any = this.instanceDict[instanceName];
            if(o&&o.hasOwnProperty("dispose"))o.dispose();
            delete this.instanceDict[instanceName];
        }
    }
}