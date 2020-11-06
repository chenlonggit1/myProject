
export function formatDate(v:any,format:string="yyyy-mm-dd hh:MM"):string
{
	var date:Date;
    if(v instanceof Date)date = v;
    else if(typeof v === "number")date = new Date(v);
    else date = new Date(v.year,v.month,v.day);
    format = format.replace("yyyy",date.getFullYear()+"");
    format = format.replace("mm",formatStr(date.getMonth()+1));
    format = format.replace("dd",formatStr(date.getDate()));
    format = format.replace("hh",formatStr(date.getHours()));
    format = format.replace("MM",formatStr(date.getMinutes()));
    format = format.replace("ss",formatStr(date.getSeconds()));
    format = format.replace("ms",formatStr(date.getMilliseconds()));
    function formatStr(v:number):string{return v>9?v+"":"0"+v;}
    return format;
}
