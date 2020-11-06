import { Dictionary } from "../Framework/Structs/Dictionary";

export class GameDataManager 
{
    private static dict: Dictionary<string, object> = new Dictionary();

    /**获取到字典数据**/
    public static GetDictData(key: string,defaultClass?:any): any 
    {
        let v = this.dict.getValue(key); 
        if(v==null&&defaultClass!=null)
        {
            v = new defaultClass();
            this.SetDictData(key,v);
        }
        return v;
    }
    /**设置字典数据* */
    public static SetDictData(key: string, value: any): void { this.dict.setValue(key, value); }

    /**设置本地缓存 */
    public static SetShareData(key: string, value: any): void 
    {
        if(value==null)localStorage.removeItem(key);
        else
        {
            if(typeof value==="string"||typeof value==="number")localStorage.setItem(key, value+""); 
            else localStorage.setItem(key, JSON.stringify(value));
        }
    }
    /**获取本地缓存 */
    public static GetShareData(key: string, clz?: any, defaultValue?: any): any 
    {
        let str: string = "";
        str = localStorage.getItem(key);
        if (str == null || str.length == 0) 
        {
            if (clz != null) return new clz();
            else 
            {
                if (defaultValue != null) return defaultValue;
                else return null;
            }
        } else 
        {
            if (clz == null) return str;
            else 
            {
                var obj: object = new clz();
                var json: object = JSON.parse(str);
                if(obj["update"])obj["update"](json);
                return obj;
            }
        }
    }
}
