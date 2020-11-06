let packageName = "module-manager";
let Fs = require("fire-fs");
let Path = require('fire-path');
module.exports = 
{
    createDirectory(rootPath,path,name)
    {
        let root = Path.basename(rootPath);
        if(root==path)path = Path.join(rootPath,name);
        else path = Path.join(rootPath,Path.join(path,name));
        if (!Fs.existsSync(path))Fs.mkdirsSync(path); 
        path = path.replace(Editor.Project.path+"\\","db://");
        path = path.replace(/\\/g,"/");
        return path;
    },
    isValidPath(str)
    {
        if(str!=null&&str.length>0)
        {
            let isExist = Fs.existsSync(str);
            if(isExist)
            {
                let info = Fs.statSync(str);
                return info.isDirectory();
            }
        }
        return false;
    },
    selectFolder(cb)
    {
        let res = Editor.Dialog.openFile(
        {
            defaultPath: Path.join(Editor.Project.path, "assets/"),
            properties: ['openDirectory']
        });
        if (res !== -1)cb(res+"");
    },
    findFolders(p,depth=0)
    {
        depth++;
        let folders = [];
        let files = Fs.readdirSync(p);
        for (let i = 0; i < files.length; i++) 
        {
            var file = Path.join(p, files[i]);
            var stat = Fs.statSync(file);
            if (stat && stat.isDirectory())
            {
                folders.push(file);
                folders = folders.concat(this.findFolders(file,depth));
            }
        }
        if(depth==1)
        {
            let root = Path.basename(p);
            for (let j = 0; j < folders.length; j++) 
                folders[j] = folders[j].replace(p,"");
            folders.unshift(root);
        }
        return folders;
    },
    checkPanelPath(panel,name)
    {
        let path = panel.setting?panel.setting.profile().gamePath:"";
        let game = panel.gameSelect.value;

        
        if(path.length==0)return {err:"请先设置游戏根目录！"};
        if(game=='{{option}}')return {err:"请选择游戏！"};
        if(name.length==0)return {err:"请输入名称！"};
        let root = Path.basename(path);
        if(root==game)path = Path.join(path,name);
        else path = Path.join(Path.join(path,panel.gameSelect.value),name);
        path = path.replace(Editor.Project.path+"\\","db://");
        path = path.replace(/\\/g,"/");
        return {path:path};
    },
    findPrefabs(cb)
    {
        var assetsDir = Path.join(Editor.Project.path, "assets/*");
        let adb = Editor.assetdb;
        let prefabs = [];
        adb.queryAssets(assetsDir,'prefab',(err,res)=>
        {
            for(let j = 0;j<res.length;j++)
            {
                if(!res[j]&&!res[j].url)continue;
                if(res[j].url.indexOf("db://internal/prefab/")!=-1)continue;// 引擎自带的预制体
                // if(res[j].url.indexOf("db://assets/resources/Prefabs/")==-1)continue;// 不在Prefabs目录下的预制体
                let prefab = res[j].url.replace("db://assets/","").replace(".prefab","");
                prefabs.push({value:prefab,selected:false,url:res[j].url,path:res[j].path});
            }


            cb(prefabs);
        });
    }
}