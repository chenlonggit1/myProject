import { FModule } from "../Core/FModule";
import { IModule } from "../Interfaces/IModule";
import { trace } from "../Utility/dx/trace";
import { dispatchFEventWith } from "../Utility/dx/dispatchFEventWith";
import { ModuleEvent } from "../Events/ModuleEvent";


export class ModuleManager
{
    private static domains:{[key:string]:typeof FModule} = {};
    private static modules:{[key:string]:IModule} ={};

    /**设置模块映射 */
    public static AddModuleClass(moduleName:string,moduleClass:typeof FModule,force?:boolean):void
    {
        if(!force&&this.domains[moduleName]!=undefined)trace("重复设置名称为 ",moduleName," 的模块！！！");
        else this.domains[moduleName] = moduleClass;
    }
    public static RemoveModuleClass(moduleName:string):void
    {
        if(this.domains[moduleName])
            delete this.domains[moduleName];
    }
    public static HasModule(moduleName:string,instanceName?:string):boolean
    {
        let name = this.ConvetName(moduleName,instanceName);
        return this.modules[name]!=null;
    }
    public static AddModule(m:IModule,moduleName:string,instanceName?:string):void
    {
        let name = this.ConvetName(moduleName,instanceName);
        if(this.modules[name]==undefined)this.modules[name]=m;
        else trace("[ModuleManager]",moduleName," 中实例中已经存在！！！");
    }
    public static GetModule(moduleName:string,instanceName?:string,isShowModule:boolean=true):IModule
    {
        let name = this.ConvetName(moduleName,instanceName);

        if(isShowModule)
        {
            if(this.modules[name]&&this.modules[name].isInitialize&&!this.modules[name].isValid)
            {
                // trace("使用无效的模块===>",moduleName,instanceName);
                this.modules[name].dispose();
                delete this.modules[name];
            }
        }
        
        if(this.modules[name]==null)
        {
            let clz = this.domains[moduleName];
            if(clz!=null)this.modules[name] = new clz();
        }

        return this.modules[name];
    } 
    public static DisposeModule(moduleName:string,instanceName?:string):void
    {
        let name = this.ConvetName(moduleName,instanceName);
        if(this.modules[name]==null)return;
        // trace("销毁模块=====>",moduleName,instanceName);
        
        dispatchFEventWith(ModuleEvent.ON_DISPOSE_MODULE_OBJECT,this.modules[name]);
        this.modules[name].dispose();
        delete this.modules[name];
    }
    private static ConvetName(moduleName:string,instanceName?:string):string
    {
        return moduleName+"_"+(instanceName?instanceName:moduleName);
    }

    public static ApplyModuleFun(moduleName:string,binderName:string,funName:string,args:any[])
    {
        if(!this.HasModule(moduleName))return;
        let m:FModule = this.GetModule(moduleName,null,false) as FModule;
        m.applyModuleFun(binderName,funName,args);


    }



    public static Print()
    {
        trace("-----------------Start Modules----------------------");
        let len = 0;
        for(let n in this.modules)
        {
            trace(n,"===>",this.modules[n]);
            len++;
        }
        trace("-----------------Total Module:"+len+"----------------------");
    }
}
