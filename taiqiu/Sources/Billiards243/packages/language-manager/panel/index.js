let packageName = "language-manager";

let Fs = require("fire-fs");
let Path = require('fire-path');
let utils = Editor.require('packages://' + packageName + '/utils/Utils.js');
let setting = Editor.require('packages://' + packageName + '/setting/Setting.js');

Editor.Panel.extend(
{
    style: Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.css', 'utf8')) + "",
    template: Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.html', 'utf8')) + "",
    $: 
    {
        scroll:"#scroll"
    },
    ready() 
    {
        let scroll = this.$scroll;
        setting.init();
        // 注册自定义组件
        this.plugin = new window.Vue(
        {
            el: this.shadowRoot,
            created()
            {
            },
            init()
            {
                setTimeout(() => this.getSettingData(), 500);
            },
            data:
            {
                keyword:"",
                rootPath:"",
                isMatchKey:true,
                languages:[],
                languageDatas:[],
                templanguageDatas:[],
                tid:-1,
                mid:-1,
            },
            methods:
            {
                getSettingData()
                {
                    let p = setting.profile().rootPath;
                    if(p==null||p.length==0)return;
                    if(!this.isValidPath(p))return;
                    this.rootPath=p;
                    this.findRootPathLanguages();
                },
                scrollToButtom()
                {
                    setTimeout(()=>scroll.scrollTop = scroll.scrollHeight, 10);
                },
                onSelectRootPath()
                {
                    let res = Editor.Dialog.openFile(
                    {
                        defaultPath: Path.join(Editor.Project.path, "assets/"),
                        properties: ['openDirectory']
                    });
                    if (res !== -1)
                    {
                        let p = res+"";
                        if(!this.isValidPath(p))return;
                        this.rootPath = p;
                        this.findRootPathLanguages();
                    }
                },
                onRootPathChange()
                {
                    if(!this.isValidPath())return;
                    this.findRootPathLanguages();
                },
                findRootPathLanguages()
                {
                    setting.profile().rootPath = this.rootPath;
                    setting.save();
                    while(this.languages.length>0)
                        this.languages.pop();
                    this.templanguageDatas.length = 0;
                    this.languages = utils.findLanguageFiles(this.rootPath);
                    if(this.languages.length==0)return;
                    this.templanguageDatas = utils.parseLanguageDatas(this.languages);
                    this.languages.unshift({name:"",path:null,json:null});
                    this.filterLanguageDatas();
                    this.saveLanguages();
                },
                filterLanguageDatas()
                {
                    while(this.languageDatas.length>0)
                        this.languageDatas.pop();
                    if(this.templanguageDatas.length==0)return;
                    for (let i = 0; i < this.templanguageDatas.length; i++) 
                    {
                        if(this.keyword.length==0)
                            this.languageDatas.push(this.templanguageDatas[i]);
                        else
                        {
                            let items = this.templanguageDatas[i];
                            if(items.length==0)continue;
                            if(items[0].key.indexOf(this.keyword)!=-1)
                            {
                                this.languageDatas.push(items);
                                continue;
                            }
                            if(!this.isMatchKey)
                            {
                                for (let j = 0; j < items.length; j++) 
                                {
                                    if(!items[j].value||items[j].value.length==0)continue;
                                    if(items[j].value.indexOf(this.keyword)!=-1)
                                    {
                                        this.languageDatas.push(items);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                },
                onKeyWordChange(flag=false)
                {
                    if(flag)this.isMatchKey = !this.isMatchKey;
                    if(this.mid!=-1)clearTimeout(this.mid);
                    this.mid = setTimeout(() => this.filterLanguageDatas(), 500);
                },
                onAddLanguage()
                {
                    Editor.Panel.open("language-manager-new",this.rootPath);
                },
                onLanguageDataChange(index,index1)
                {
                    let items = this.languageDatas[index];
                    if(index1==0)
                    {
                        items[index1].key = items[index1].value;
                        for (let i = 1; i < items.length; i++) 
                            items[i].key = items[index1].value;
                    }
                    if(this.tid!=-1)clearTimeout(this.tid);
                    this.tid = setTimeout(() => this.saveLanguages(), 500);
                },
                onDeleteLanguageData(index,index1)
                {
                    let items = this.languageDatas[index];
                    let m = this.templanguageDatas.indexOf(items);
                    if(m==-1)return;
                    this.templanguageDatas.splice(m,1);
                    this.filterLanguageDatas();
                    if(this.tid!=-1)clearTimeout(this.tid);
                    this.tid = setTimeout(() => this.saveLanguages(), 500);
                },
                onAddLanguageData()
                {
                    let isAdd = utils.addNewLanguageData(this.templanguageDatas,this.languages);
                    if(isAdd)
                    {
                        this.filterLanguageDatas();
                        this.saveLanguages();
                        this.scrollToButtom();
                    }
                },
                saveLanguages()
                {
                    let dict = {};
                    for (let i = 0; i < this.languages.length; i++) 
                    {
                        if(this.languages[i].path==null||this.languages[i].path=="")continue;
                        dict[this.languages[i].name]={path:this.languages[i].path,json:{}};
                    }
                    for (let j = 0; j < this.templanguageDatas.length; j++) 
                    {
                        let items = this.templanguageDatas[j];
                        for (let k = 0; k < items.length; k++) 
                        {
                            if(items[k].file==null||items[k].file=="")continue;
                            dict[items[k].file].json[items[k].key] = items[k].value;
                        }
                    }
                    for(ss in dict)
                    {
                        let p = dict[ss].path;
                        p = p.replace(Editor.Project.path+"\\","db://");
                        p = p.replace(Editor.Project.path+"/","db://");
                        p = p.replace(/\\/g,"/");
                        let json = dict[ss].json;
                        let jsonStr = "";
                        for (let str in json) 
                        {
                            if(jsonStr.length!=0)jsonStr+=",\n";
                            jsonStr+='      "'+str+'":'+JSON.stringify(json[str]);
                        }
                        jsonStr="{\n"+jsonStr+"\n}";
                        Editor.assetdb.saveExists(p,jsonStr);
                        Editor.assetdb.refresh(true);
                    }
                },
                isValidPath(str=null)
                {
                    if(str==null)str = this.rootPath;
                    if(str.length>0)
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
                createLanguage(fileName)
                {
                    fileName = Path.join(this.rootPath,fileName+".json");
                    fileName = fileName.replace(Editor.Project.path+"\\","db://");
                    fileName = fileName.replace(Editor.Project.path+"/","db://");
                    fileName = fileName.replace(/\\/g,"/");
                    Editor.assetdb.createOrSave(fileName,"{}");
                    Editor.assetdb.refresh(true);
                    setTimeout(() => this.findRootPathLanguages(), 500);
                }
            }
        });
    },
    messages: 
    {
        'create-language':function(e,arg)
        {
            this.plugin.createLanguage(arg);
        }
    }
});