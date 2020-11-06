import { Assets } from "../Core/Assets";
import { getQualifiedClassName } from "../Utility/dx/getQualifiedClassName";
import { trace } from "../Utility/dx/trace";
import { CacheManager } from "./CacheManager";


export class StoreManager
{
    private static pools:{[key:string]:any[]} = {};
    private static prefabPaths:{[key:string]:string} = {};
    /**
     * 回收对象到对象池中
     */
    public static Store(obj:any,storeName?:string):void
    {
        if(!storeName)storeName = getQualifiedClassName(obj);
        this.PushObject(storeName,obj);
    }
    /**
     * 获取一个对象
     */
    public static New(clz:any,storeName?:string):any
    {
        if(!storeName)storeName = getQualifiedClassName(clz);
        let o = this.GetObject(storeName);
        if(o==null)o = new clz();
        return o;
    }

    public static NewPrefabNode(prefabName:string|cc.Prefab):any
    {
        if(typeof prefabName==="string")
        {
            if(CacheManager.HasCache(Assets.GetPrefab(prefabName)))
                return this.NewNode(CacheManager.GetCache(Assets.GetPrefab(prefabName)));
            else return null;
        }else return this.NewNode(prefabName);        
    }
    public static NewNode(clz: typeof cc.Component|cc.Prefab):any
    {
        let className = getQualifiedClassName(clz);
        if(clz instanceof cc.Prefab)
        {
            let p = this.GetObject(className+"_"+clz.name);
            if(p==null)p = cc.instantiate(clz);
            if(p["_prefab"]!=null)
                this.prefabPaths[p["_prefab"]["fileId"]] = className+"_"+clz.name;
            return p;
        }
        let o = this.GetObject(className);
        if(o==null)
        {
            let n = new cc.Node();
            o = n.addComponent(clz);
        }
        return o;
    }
    public static StoreNode(obj:cc.Component|cc.Node):void
    {
        if(obj instanceof cc.Node)
        {
            this.ResetNode(obj);
            if(obj["_prefab"])
            {
                let prefabName = this.prefabPaths[obj["_prefab"]["fileId"]];
                this.PushObject(prefabName,obj);
                return;
            }
        }else
        {
            if(obj==null||!obj.node)return;
            this.ResetNode(obj.node);
            if(obj instanceof cc.Sprite)
            {
                obj.sizeMode = cc.Sprite.SizeMode.TRIMMED;
                obj.spriteFrame = null;
            }
            let className = getQualifiedClassName(obj);
            this.PushObject(className,obj);
        }
    }
    // 重置cc.Node的属性
    private static ResetNode(n:cc.Node):void
    {
        if(n.parent)n.removeFromParent();
        n.color = cc.Color.WHITE;
        n.anchorX = 0.5;
        n.anchorY = 0.5;
        n.opacity = 255;
        if("angle" in n)(n as any)["angle"] = 0;
        else (n as any)["rotation"] = 0;
        n.scaleX = 1;
        n.scaleY = 1;
        n.skewX = 0;
        n.skewY = 0;
        n.x = 0;
        n.y = 0;
    }

    public static ReleasePrefab(prefab:string|cc.Prefab)
    {
        let className = getQualifiedClassName(prefab);
        if(prefab instanceof cc.Prefab)className = className+"_"+prefab.name;
        let ss = this.pools[className];
        if(ss==null)return;
        while(ss.length>0)
        {
            let p = ss.shift();
            p.destroyAllChildren();
            p.destroy();
        }
    }
    /**释放对象池内的对象 */
    public static Release():void
    {
        for(let n in this.prefabPaths)
            delete this.prefabPaths[n];
        for(let m in this.pools)
        {
            if(m.indexOf("cc.")==0)
            {
                let arr = this.pools[m];
                for(let k:number = 0;k<arr.length;k++)
                {
                    if(arr[k] instanceof cc.Node)
                    {
                        if(arr[k].isValid)
                            arr[k].destroy();
                    }else if(arr[k].node&&arr[k].node.isValid)
                    {
                        arr[k].node.destroy();
                    }
                }
            }
            delete this.pools[m];
        }
    }

    private static GetObject(name:string):any
    {
        if(this.pools[name]!=undefined&&this.pools[name].length>0)
        {
            return this.pools[name].shift();
        }
        return null;
    }
    private static PushObject(name:string,obj:object):void
    {
        if(this.pools[name]==undefined)this.pools[name] = [];
        if(this.pools[name].indexOf(obj)==-1)this.pools[name].push(obj);
    }

    public static Print()
    {
        trace("-----------------Start Stores----------------------");
        let len = 0;
        for(let n in this.pools)
        {
            trace(n,"===>",this.pools[n].length);
            len++;
        }
        trace("-----------------Total Stores:"+len+"----------------------");
    }
}