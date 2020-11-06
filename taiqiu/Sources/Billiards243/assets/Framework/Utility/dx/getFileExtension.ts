
export function getFileExtension(url:string):string
{
    let sindex = url.lastIndexOf(".");
    if(sindex>-1)return url.substring(sindex+1);
    return url;
}
