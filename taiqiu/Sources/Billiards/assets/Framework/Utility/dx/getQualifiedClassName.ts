export function getQualifiedClassName(value:any):string 
{
	if(value["ClassName"]!=null)return value["ClassName"];
    if (typeof value === 'function') 
    {
        var prototype = value.prototype;
        if (prototype && prototype.hasOwnProperty('__classname__') && prototype.__classname__) {
            return prototype.__classname__;
        }
        var retval = '';
        //  for browsers which have name property in the constructor of the object, such as chrome
        if (value.name) {
            retval = value.name;
        }
        if (value.toString) {
            var arr, str = value.toString();
            if (str.charAt(0) === '[') {
                // str is "[object objectClass]"
                arr = str.match(/\[\w+\s*(\w+)\]/);
            }
            else {
                // str is function objectClass () {} for IE Firefox
                arr = str.match(/function\s*(\w+)/);
            }
            if (arr && arr.length === 2) {
                retval = arr[1];
            }
        }
        return retval !== 'Object' ? retval : '';
    }
	else if (value && value.constructor) 
	{
        return getQualifiedClassName(value.constructor);
    }
    return '';
}