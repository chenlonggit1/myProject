import { FEvent } from "../Events/FEvent";
import { ModuleEvent } from "../Events/ModuleEvent";
import { Dictionary } from "../Structs/Dictionary";
import { trace } from "../Utility/dx/trace";



export class EventManager
{
    private static events:Dictionary<any,any>= new Dictionary();
    
    public static addEvent(obj:any,type:string,fun:Function):void
    {
        if(!this.events.hasKey(obj))
            this.events.setValue(obj,{length:0});
        let o = this.events.getValue(obj);
        if(o[type]==undefined)
        {
            o[type] = [];
            o.length++;
        }
        var funs:any[] = o[type];
        if(funs.indexOf(fun)==-1)funs.push(fun);
    }
    public static removeEvent(obj:any,type?:string,fun?:Function):void
    {
        if(!this.events.hasKey(obj))return;
        let o = this.events.getValue(obj);
        var funs:any[];
        if(type!=null)
        {
            if(!o[type])return;
            funs = o[type];
            if(fun!=null)
            {
                var index:number = funs.indexOf(fun);
                if(index>-1)funs.splice(index,1);
            }else
            {
                funs = o[type];
                while(funs.length>0)
                    funs.shift();
            }
            if(funs.length==0)
            {
                o.length--;
                delete o[type];
            }
        }else
        {
            for(let s in o)
            {
                if(s=="length")continue;
                funs = o[s];
                o.length--;
                while(funs.length>0)
                    funs.shift();
            }
        }
        if(o.length<=0)
            this.events.remove(obj);
    }
    public static dispatchEventWith(type:string,data?:any):void
    {
        this.dispatchEvent(new FEvent(type,data));
    }
    public static dispatchEvent(evt:FEvent):void
    {
        let type = evt.type;
        let objs = this.events.getKeys();
        let o:any,obj:any,funs:Array<Function>;
        for(let i = 0;i<objs.length;i++)
        {
            obj = objs[i];
            o = this.events.getValue(obj);
            if(!o[type])continue;
            funs = o[type];
            for(let j = 0;j<funs.length;j++)
            {
                if(funs[j].length==0)funs[j].call(obj);
                else funs[j].call(obj,evt);
            }
                
        }
    }
    public static dispatchModuleEventWith(type:string,moduleName:string,gameLayer?:any,data?:any):void
    {
        this.dispatchEvent(new ModuleEvent(type,moduleName,null,gameLayer,data));
    }

    public static Print()
    {
        trace("------------------- Start Events ------------------------");
        let objs = this.events.getKeys();
        let o:any,obj:any;
        for(let i = 0;i<objs.length;i++)
        {
            obj = objs[i];
            let evts:string="";
            o = this.events.getValue(obj);
            for(let s in o)
            {
                if(s!="length")
                    evts+=s+",";
            }
            trace(evts,"----->",obj);
        }
        trace("-----------------Total Events:"+objs.length+"----------------------");
    }
}