
export class FFunction
{
    public static ClassName:string = "FFunction";
    public isOnce:boolean = true;
    public target:any = null;
    public fun:Function = null;
    public params:any[] = null;
    public excute(args?:any[]):any
    {
        if(this.fun!=null)
        {
            let pp = [];
            if(this.params!=null&&this.params.length>0)pp = pp.concat(this.params);
            if(args!=null&&args.length>0)pp = pp.concat(args);
            return this.fun.apply(this.target,pp);
        }
        if(this.isOnce)
            this.dispose();
    }

    public get length():number{return this.fun?this.fun.length:0;}
    public dispose():void
    {
        this.isOnce = true;
        this.fun = null;
        this.target = null;
        this.params = null;
    }
    public static Compare(a:FFunction,b:FFunction):boolean
    {
        return a.target==b.target&&a.fun==b.fun;
    }

    public static FindIndexOf(a:FFunction,array:FFunction[]):number
    {
        for (let i = 0; i < array.length; i++) 
            if(this.Compare(a,array[i]))return i;
        return -1;
    }
}
