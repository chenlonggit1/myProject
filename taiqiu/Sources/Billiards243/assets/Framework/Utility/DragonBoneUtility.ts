
export class DragonBoneUtility
{

    private static Version = null;
    /**
     * 对比龙骨版本 ，判断当前使用的龙骨版本是否大于等于指定的版本
     * @param version  格式为 5.6.300
     */
    public static CompareVersion(version:string):boolean
    {
        if(this.Version==null)this.Version = this.ParserVersion(dragonBones.DragonBones.VERSION);
        let ver = this.ParserVersion(version);
        let len = Math.max(this.Version.length,ver.length);
        for (let i = 0; i < len; i++)
        {
            if(ver[i]>this.Version[i])return false;
            else if(ver[i]<this.Version[i]) return true;
        }
        return true;
    }

    private static ParserVersion(version:string):number[]
    {
        let ver:any[] = version.split(".");
        for (let i = 0; i < ver.length; i++)
            ver[i] = parseInt(ver[i]);
        return ver;
    }
}
