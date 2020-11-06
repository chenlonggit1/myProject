export class CryptoUtility
{
    public static SpliteBytes(bytes:any,startIndex:number = 0,len:number = 0,isRemoveBlock:boolean=true):any
    {
        if(startIndex>=bytes.length)return null;
        var temp:any[] = [];
        var endIndex:number = startIndex+len;
        if(endIndex>=bytes.length)endIndex = bytes.length;
        for(var i:number = startIndex;i<endIndex;i++)
            temp[i-startIndex] = bytes[i];
        if(isRemoveBlock)bytes = bytes.splice(startIndex,len);
        return temp;
    }
    
    //-----------------------------------------------------------------------------
    // WordArray <=> Uint8Array
    //-----------------------------------------------------------------------------

    public static ConvertByteArray(data:any):Uint8Array
    {
        if(Array.isArray(data))
            return new Uint8Array(data);
        return data;
    }
    public static ConvertWordArray(data:any):CryptoJS.lib.WordArray
    {
        let u8Arr = this.ConvertByteArray(data);
        return this.Byte2WordArray(u8Arr);
    }

    public static Word2ByteArray(bytes:CryptoJS.lib.WordArray,isUnshift?:boolean,...datas):Uint8Array
    {
        var words = bytes.words;
        var sigBytes = bytes.sigBytes;
        var len = sigBytes+datas.length;
        var sIndex = 0;
        // Convert
        var u8 = new Uint8Array(len);
        if(isUnshift)
        {
            sIndex = datas.length;
            for(var k = 0;k<sIndex;k++)
                u8[k]=datas[k];
        }
        for (var i = 0; i < sigBytes; i++) 
        {
            var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            u8[i+sIndex]=byte;
        }
        if(!isUnshift)
        {
            sIndex = datas.length;
            for (var m = 0; m < sIndex; m++) 
                u8[m+sigBytes]=datas[m];
        }
        return u8;
    }
    public static Byte2WordArray(bytes:Uint8Array):CryptoJS.lib.WordArray
    {
        // Shortcut
        var len = bytes.length;
        // Convert
        var words = [];
        for (var i = 0; i < len; i++) 
            words[i >>> 2] |= (bytes[i] & 0xff) << (24 - (i % 4) * 8);
        return CryptoJS.lib.WordArray.create(words, len);
    }
    public static int2Bytes(value:number,isHighOrder:boolean=false) // 高位在前
	{
        let src = [];
        src[isHighOrder?0:3] = ((value>>24) & 0xFF);
        src[isHighOrder?1:2] = ((value>>16) & 0xFF);
        src[isHighOrder?2:1] = ((value>>8) & 0xFF);  
        src[isHighOrder?3:0] = (value & 0xFF);		
		return src; 
	}

    public static bytes2Int(src:Array<number>,isHighOrder:boolean=false):number
    {
        let value = 0;
        value = ((src[isHighOrder?0:3] & 0xFF)<<24) 
                | ((src[isHighOrder?1:2] & 0xFF)<<16) 
                | ((src[isHighOrder?2:1] & 0xFF)<<8) 
                | ((src[isHighOrder?3:0] & 0xFF));
        return value;
	}


    //-----------------------------------------------------------------------------
    // 
    //-----------------------------------------------------------------------------
    public static GetBytes(input:string):CryptoJS.lib.WordArray{return CryptoJS.enc.Utf8.parse(input);}
    
    public static GetString(value:CryptoJS.lib.WordArray):string{return CryptoJS.enc.Utf8.stringify(value);}

    public static GetBase64Byte(input:string):CryptoJS.lib.WordArray{return CryptoJS.enc.Base64.parse(input);}
    /**将字节数据转换成Base64字符串 */
    public static GetBase64String(value:CryptoJS.lib.WordArray):string{return CryptoJS.enc.Base64.stringify(value);}

    public static GetMD5Byte(inputString:string):CryptoJS.lib.WordArray{return CryptoJS.MD5(this.GetBytes(inputString));}
    /**将字符串转换成 MD5 加密后的字符串 */
    public static GetMD5String(input:string|Uint8Array):string
    {
        if(typeof input==="string")return this.GetMD5Byte(input).toString();
        else 
        {
            let bytes:CryptoJS.lib.WordArray = this.Byte2WordArray(input);
            return CryptoJS.MD5(CryptoJS.lib.WordArray.create(input)).toString();
        }
    }
    /**将字符串转换成SHA256加密后的字节数据  */
    public static GetSHA256Byte(inputString:string):CryptoJS.lib.WordArray{return CryptoJS.SHA256(this.GetBytes(inputString));}
    /**将字符串转换成SHA256加密后的字符串 */
    public static GetSHA256String(inputString:string):string{return this.GetSHA256Byte(inputString).toString();}
}