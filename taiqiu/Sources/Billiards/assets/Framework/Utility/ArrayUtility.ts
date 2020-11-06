export class ArrayUtility
{

    public static SortOn(arr:any[],p:string):void
    {
        arr.sort(function(a,b)
        {
            return a[p]-b[p];
        });
    }
    public static SortNum(arr:any[]):void
    {
        arr.sort(function(a,b){return a-b;});
    }

    /**查找两个数组之间的差异数据**/
    public static Difference(a1:any[],a2:any[]):any[]
    {
        var d:any[] = [];
        a1 = a1.concat();
        a2 = a2.concat();
        for(var i:number = 0;i<a1.length;i++)
        {
            var index:number = a2.indexOf(a1[i]);
            if(index!=-1)
            {
                a2.splice(index,1);
                a1.splice(i,1);
                i--;
            }
        }
        if(a1.length>0)d = d.concat(a1);	
        if(a2.length>0)d = d.concat(a2);	
        return d;
    }
    
    public static Identical(a1:any[],a2:any[]):any[]
    {
        var d:any[] = [];
        for(var i:number = 0;i<a1.length;i++)
        {
            if(a2.indexOf(a1[i])!=-1)
                d.push(a1[i]);
        }
        return d;
    }
}