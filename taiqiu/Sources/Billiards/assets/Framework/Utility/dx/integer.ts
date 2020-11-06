
export function integer(num:number)
{
    if(num<0)return Math.ceil(num);
    else return Math.floor(num);
}
