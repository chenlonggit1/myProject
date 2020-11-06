import { FFunction } from "../../Core/FFunction";
import { StoreManager } from "../../Managers/StoreManager";


export function Fun(f:Function,target?:any,isOnce:boolean=true,args?:any[]):FFunction
{
    let fun:FFunction = StoreManager.New(FFunction);
    fun.isOnce = isOnce;
    fun.fun = f;
    fun.target = target;
    fun.params = args;
	return fun;
}
