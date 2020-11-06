let packageName = "creater-manager";
let Fs = require("fire-fs");
let Path = require('fire-path');

let _getNodeChildByName="";
let superClassIgnores = 
[
    "FObject","FDispose","FStore","cc.Component","ReceiveHandler","GameDealInfoVO",
    "StatisticsInfoVO","Loader","FEvent","GameBetInfoVO","SimplePlayerVO"
];

module.exports = 
{

    getNodeChildByName(){return _getNodeChildByName;},
    /**是否是有效的脚本文件 */
    isValidScript(fileName,content,bb)
    {
        let str = "";
        if(bb)
        {
            if(fileName=="FBinder")return true;
            str = "export class "+fileName+" implements IModule";// 实现了某个接口的类
            if(content.indexOf(str)!=-1)return true;
            str = "export class "+fileName+" implements IMediator";// 实现了某个接口的类
            if(content.indexOf(str)!=-1)return true;
            str = "export class "+fileName+" implements IContext";// 实现了某个接口的类
            if(content.indexOf(str)!=-1)return true;
            str = "export class "+fileName+" implements IProxy";// 实现了某个接口的类
            if(content.indexOf(str)!=-1)return true;
            str = "export class "+fileName+" implements IBinder";// 实现了某个接口的类
            if(content.indexOf(str)!=-1)return true;
        }
        
        str = "enum "+fileName;// 枚举
        if(content.indexOf(str)!=-1)return false;
        str = "interface "+fileName;//接口
        if(content.indexOf(str)!=-1)return false;
        str = "export function "+fileName;// 全局方法
        if(content.indexOf(str)!=-1)return false;
        str = "export default function "+fileName;// 全局方法
        if(content.indexOf(str)!=-1)return false;

        if(bb)
        {
            str = "export class "+fileName+" implements ";// 实现了某个接口的类
            if(content.indexOf(str)!=-1)return false;
            str = "export default class "+fileName+" implements ";// 实现了某个接口的类
            if(content.indexOf(str)!=-1)return false;
            str = "export class "+fileName+" extends ";// 纯类
            if(content.indexOf(str)==-1)
            {
                str = "export default class "+fileName+" extends ";// 纯类
                if(content.indexOf(str)==-1)return false;
            }
            for (let i = 0; i < superClassIgnores.length; i++) 
            {
                str = "export class "+fileName+" extends "+superClassIgnores[i];
                if(content.indexOf(str)!=-1)return false;
                str = "export default class "+fileName+" extends "+superClassIgnores[i];
                if(content.indexOf(str)!=-1)return false;
            }
        }
        return true;
    },
    getScriptSuperInfos(path,bb=true)
    {
        let superClassDict = {};
        let scripts = [];
        this.searchScriptSuperInfos(path,superClassDict,scripts,bb);
        for (let i = 0; i < scripts.length; i++) 
        {
            let o = scripts[i];
            let cName = o.name;
            o.supers = [];
            o.implements = [];
            while(superClassDict[cName]!=null)
            {
                let so = superClassDict[cName];

                if(so.supers.length>0)
                {
                    o.supers = o.supers.concat(so.supers);
                    cName = so.supers[0];
                }
                if(so.implements.length>0)
                {
                    o.implements = o.implements.concat(so.implements);
                    cName = so.implements[0];
                }
                if(so.implements.length==0&&so.supers.length==0)break;
            }
        }
        return scripts;
    },
    searchScriptSuperInfos(path,superClassDict,scripts,bb)
    {
        let pa = Fs.readdirSync(path);  
        for (let i = 0; i < pa.length; i++) 
        {
            let ele = pa[i];
            let ext = Path.extname(ele);
            if(ext!=".ts"&&ext!="")continue;
            if(ele.indexOf(".d.ts")!=-1)continue;
            let info = Fs.statSync(path+"/"+ele);
            if(info.isDirectory())this.searchScriptSuperInfos(path+"/"+ele,superClassDict,scripts,bb);
            else
            {
                if(ext!=".ts")continue;
                let fileData = Fs.readFileSync(path+"/"+ele, {encoding:"utf8"});
                ele = ele.replace(".ts","");
                if(ele=="getNodeChildByName")_getNodeChildByName = (path+"/"+ele+".ts");
                else if(!this.isValidScript(ele,fileData,bb))continue;
                superClassDict[ele] = this.getSuperInfo(ele,fileData);
                scripts.push({path:path+"/"+ele,name:ele});
            }
        }
    },
    getSuperInfo(fileName,content)
    {
        let str = "export class "+fileName+" extends ";
        let index = content.indexOf(str);
        let isInterface = false;
        if(index==-1)
        {
            str = "export default class "+fileName+" extends ";// 纯类
            index = content.indexOf(str);
            if(index==-1)
            {
                isInterface = true;
                str = "export class "+fileName+" implements ";// 实现了某个接口的类
                index = content.indexOf(str);
                if(index==-1)
                {
                    str = "export default class "+fileName+" implements ";// 实现了某个接口的类
                    index = content.indexOf(str);
                }
            }
        }
        if(index==-1)return null;
        index = index+str.length;
        let endIndex = content.indexOf("{",index);
        let infoStr = content.substring(index,endIndex).replace(/\r/g,"").replace(/\n/g,"");//.split(" ");
        if(infoStr.charAt(infoStr.length-1)==" ")infoStr = infoStr.substring(0,infoStr.length-1);
        let infoArr = infoStr.split(" ");
        let supers = [];
        let implements = [];
        if(isInterface)implements = infoArr[0].split(",");
        else 
        {
            supers.push(infoArr[0]);
            if(infoArr.length>2)implements = infoArr[2].split(",");
        }
        return {supers:supers,implements:implements};
    },
    getImportURL(f1,f2)
    {

        //Editor.log(f1,">>>>>",f2);
        let ff = "";
        f1 = f1.replace(/\\/g,"/");
        f2 = f2.replace(/\\/g,"/");
        let fArr = f2.split("/");
        let fArr1 = f1.split("/");
        let m = "";
        let i = 0;
        for (i = 0; i < fArr.length; i++) 
        {
            
            if(f1.indexOf(m+fArr[i]+"/")!=-1)m += fArr[i]+"/";
            else break;
        }
        let pstr = fArr1[fArr1.length-1];
        if(pstr.indexOf(".")!=-1)
        {
            i++;// 带文件名称的路径
            fArr1[fArr1.length-1]=pstr.substr(0,pstr.indexOf("."));
        }
        let fstr = fArr[fArr.length-1];
        if(fstr.indexOf(".")==-1&&fstr!="")i--;// 说明当前放进来的路径不包含文件名称，目录也没有以 / 结尾
        if(i==fArr.length)ff+="./";// 在同一级的目录下面
        while(i<fArr.length)
        {
            i++;
            ff+="../";
        }
        ff+=fArr1.join("/").replace(m,"");
        return ff;
    },
    getFileName(str)
    {
        let i1 = str.lastIndexOf("/");
        let i2 = str.lastIndexOf(".ts");
        if(i1==-1||i2==-1)return null;
        else return str.substring(i1+1,i2);
    },

    findInterfaces(path)
    {
        let scripts = [];
        this.searchScriptInterface(path,scripts);
        return scripts;
    },
    searchScriptInterface(path,scripts)
    {
        let pa = Fs.readdirSync(path);  
        for (let i = 0; i < pa.length; i++) 
        {
            let ele = pa[i];
            let ext = Path.extname(ele);
            if(ext!=".ts"&&ext!="")continue;
            if(ele.indexOf(".d.ts")!=-1)continue;
            let info = Fs.statSync(path+"/"+ele);
            if(info.isDirectory())this.searchScriptInterface(path+"/"+ele,scripts);
            else
            {
                if(ext!=".ts")continue;
                let fileData = Fs.readFileSync(path+"/"+ele, {encoding:"utf8"});
                ele = ele.replace(".ts","");
                if(fileData.indexOf("export interface "+ele)!=-1)
                    scripts.push({path:path+"/"+ele,name:ele});
            }
        }
    },
    replaceScriptData(str,superClass,path,name,description)
    {
        let cp = Path.join(Editor.Project.path,"assets");//panel.setting.profile().corePath;
        
        if(superClass.length!=0)
        {
            if(superClass=="cc.Component")
            {
                str = str.replace(/import { {SuperClassName} } from "{SuperClassPath}";/g,"");
            }else
            {
                let superFile = cp+superClass+".ts";
                superClass = superClass.replace(cp.replace(Path.join(Editor.Project.path,"assets"),"").replace(/\\/g,"/"),"");
                let superPath = this.getImportURL(superFile,path.replace("db://",Editor.Project.path+"/"));
                let superData = Fs.readFileSync(superFile, {encoding:"utf8"});
                // 如果
                if(superData.indexOf("export default class "+Path.basename(superClass))!=-1)
                    str = str.replace(/{ {SuperClassName} }/g,Path.basename(superClass));
                str = str.replace(/{SuperClassPath}/g,superPath);
            }
            str = str.replace(/{SuperClassName}/g,Path.basename(superClass));
        }else
        {
            str = str.replace(/import { {SuperClassName} } from "{SuperClassPath}";/g,"");
            str = str.replace(/extends {SuperClassName}/g,"");
        }
        str = str.replace(/{Description}/g,description);
        str = str.replace(/{ClassName}/g,name);
        return str;
    },
    searchArrayDatas(arr,sd,keyword,attr=null)
    {
        while(sd.length>0)sd.pop();
        for (let i = 0; i < arr.length; i++) 
        {
            if(keyword=="")sd.push(arr[i]);
            else if((attr?arr[i][attr]:arr[i]).indexOf(keyword)!=-1)sd.push(arr[i]);
        }
    }
}