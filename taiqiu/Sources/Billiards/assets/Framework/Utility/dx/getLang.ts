import { LanguageManager } from "../../Managers/LanguageManager";
import { formatString } from "./formatString";

export function getLang(nodeName:string,params?:any[]):string
{   
    if(params!=null)return formatString(LanguageManager.GetLang(nodeName),params);
    return LanguageManager.GetLang(nodeName);
} 
