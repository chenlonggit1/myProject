export interface IHttpRequest
{
    /**本次请求返回的数据，数据类型根据 responseType 设置的值确定 */
    response: any;
    /*设置返回的数据格式为文本（HttpResponseType.TEXT）还是二进制数据（HttpResponseType.ArrayBuffer） */
    responseType: string;
    /**表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。(这个标志不会影响同站的请求) */
    withCredentials: boolean;
    /**初始化一个请求 */
    open(url:string, method?:string): void;
    /**发送请求. */
    send(data?:any): void;
    /**如果请求已经被发送,则立刻中止请求. */
    abort(): void;
    /**返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"". */
    getAllResponseHeaders(): string;
    /**给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url. */
    setRequestHeader(header:string, value:string): void;
    /**返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"". */
    getResponseHeader(header:string): string;
    
}
