let packageName = "module-manager";
let Fs = require("fire-fs");
let Path = require('fire-path');
let moduleItem = Editor.require('packages://' + packageName + '/panel/item/item.js');
let utils = Editor.require('packages://' + packageName + '/utils/Utils.js');
let scriptUtils = Editor.require('packages://' + packageName + '/utils/ScriptUtils.js');
let setting = Editor.require('packages://' + packageName + '/setting/Setting.js');
Editor.Panel.extend(
{
    style: Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.css', 'utf8')) + "",
    template: Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.html', 'utf8')) + "",
    $: 
    {

    },
    ready() 
    {
        // 注册自定义组件
        moduleItem.init();
        
        window.plugin = new window.Vue(
        {
            el: this.shadowRoot,
            created()
            {
            },
            init()
            {
                setting.init();
                setTimeout(() => this.getSettingData(), 40);
                setTimeout(() =>this.updateModules(), 50);
            },
            data:
            {
                corePath:"",
                modules:[]
            },
            watch:
            {
            },
            methods:
            {
                onSelectFolder()
                {
                    utils.selectFolder((res)=>
                    {
                        setting.profile().corePath=this.corePath = res;
                        setting.save();
                        this.updateModules();
                    });
                },
                getSettingData()
                {
                    let c = setting.profile().corePath;
                    if(utils.isValidPath(c))this.corePath = c;
                },
                updateModules()
                {
                    let p = Path.join(Editor.Project.path,"assets");
                    if(!utils.isValidPath(p))return;
                    while(this.modules.length>0)
                        this.modules.pop();
                    let scripts = scriptUtils.getScriptSuperInfos(p);
                    for (let i = 0; i < scripts.length; i++) 
                    {
                        let sc = scripts[i];
                        if(sc.implements.indexOf('IModule')!=-1)
                        {
                            let path = sc.path.replace(/\//g,"\\");
                            if(this.corePath.length!=0&&path.indexOf(this.corePath)!=-1)continue;
                            let url = 'db://assets/' + sc.path.replace(p,"")+".ts";
                            let uuid = Editor.assetdb.remote.urlToUuid(url);
                            let name = Path.basename(sc.path);
                            let filePath = sc.path.replace(p+"/","");
                            let desc = sc.desc;
                            this.modules.push({name:name,filePath:filePath,desc:desc,url:url,uuid:uuid});
                        }
                    }
                }
            }
        });
    },
    messages: 
    {
        'module-manager:hello'(event) 
        {
        }
    }
});