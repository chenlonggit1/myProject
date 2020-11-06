
export function getURLParam(paramName):string 
{
	let search = decodeURIComponent(window.location.search);
    search = search.toLowerCase();
    if (search == null || search.length <= 1) return null;
    let index = search.indexOf(paramName + "=");
    if (index == -1) return null;
    index += paramName.length + 1;
    let dindex = search.indexOf("&", index);
    if (dindex == -1) dindex = search.length;
    return search.substring(index, dindex);
}
