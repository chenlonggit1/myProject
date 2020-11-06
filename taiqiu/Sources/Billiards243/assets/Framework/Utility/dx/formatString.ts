
export function formatString(str:string,args:any[]):string
{
	for (var i = 0; i < args.length; i++) 
		str = str.replace("{"+i+"}",args[i]);
	return str;
}
