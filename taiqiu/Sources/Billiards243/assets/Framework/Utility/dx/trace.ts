import { formatDate } from "./formatDate";

export function trace(...msg):void
{
    let str:string = formatDate(new Date(),"hh:MM:ss ms");
    str = "["+str+"]";
    msg.unshift(str);
    if(CC_EDITOR)cc.log.apply(null,msg);
    else console.log.apply(null,msg);
}