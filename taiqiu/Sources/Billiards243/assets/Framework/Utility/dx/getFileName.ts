
export function getFileName(url:string):string
{
    let sindex = url.lastIndexOf("/");
    if(sindex==-1)sindex = url.lastIndexOf("\\");
    if(sindex>-1)
    {
        url = url.substring(sindex+1);
        sindex = url.indexOf(".");
        if(sindex>-1)url = url.substring(0,sindex);
    }
    return url;
}
