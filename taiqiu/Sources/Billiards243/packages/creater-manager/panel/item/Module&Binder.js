
(() => {
  'use strict';

  return function init (panel) 
  {
    let packageName = "creater-manager";
    let viewEL = panel.view;
    let Fs = require("fire-fs");
    let Path = require('fire-path');
    let moduleTemplate = Fs.readFileSync(Editor.url('packages://' + packageName + '/templates/module.txt', 'utf8')) + "";
    let binderTemplate = Fs.readFileSync(Editor.url('packages://' + packageName + '/templates/binder.txt', 'utf8')) + "";
    let utils = Editor.require('packages://' + packageName + '/utils/Utils.js');
    let scriptUtils = Editor.require('packages://' + packageName + '/utils/ScriptUtils.js');
    let prefabItem = Editor.require('packages://' + packageName + '/panel/item/prefab-item.js');
    Editor.import('packages://'+packageName+'/panel/item/Module&Binder.tmpl').then(content => 
    {
      viewEL.innerHTML = content;
      let moduleName = viewEL.querySelector('#moduleName');
      let binderName = viewEL.querySelector('#binderName');

      let superModuleClass = viewEL.querySelector('#moduleSuperClass');
      let superBinderClass = viewEL.querySelector('#binderSuperClass');
      let description = viewEL.querySelector('#description');
      let bindAttr = viewEL.querySelector('#bindAttr');

      let moduleSearch = viewEL.querySelector('#moduleSearch');
      let binderSearch = viewEL.querySelector('#binderSearch');
      let prefabSearch = viewEL.querySelector('#prefabSearch');

      moduleName.addEventListener('change', event => 
      {
          let ddd = moduleName.value+"";
          if(ddd.indexOf("Module")==-1)ddd = ddd+="Binder";
          else ddd = ddd.replace("Module","Binder");
          binderName.value = ddd;
      });
      this.plugin = new window.Vue(
      {
        el: viewEL,
        created(){},
        init()
        {
          prefabItem.init(this);
          setTimeout(() =>this.updateSupers(), 30);
          setTimeout(() =>this.updatePrefabs(), 50);
        },
        data:
        {
          moduleSearchs:[],
          binderSearchs:[],
          prefabSearchs:[],
          errMsg:"",
          prefabs:[],
          superBinders:[],
          superModules:[],
          isCreateDir:true,
          selectedPrefabs:"",
		  isAutoRelease:false,
		  delayTime:10000
        },
        methods:
        {
          updateSupers()
          {
            if(!panel.setting)return;
            let p = Path.join(Editor.Project.path,"assets");//panel.setting.profile().corePath;//Path.join(Editor.Project.path,"assets");
            if(!utils.isValidPath(p))return;
            let scripts = scriptUtils.getScriptSuperInfos(p);
            for (let i = 0; i < scripts.length; i++) 
            {
                let sc = scripts[i];
                if(sc.implements.indexOf('IModule')!=-1)
                    this.superModules.push(sc.path.replace(p,""));
                if(sc.implements.indexOf('IBinder')!=-1)
                    this.superBinders.push(sc.path.replace(p,""));
            }
            this.updateModuleSearchs();
            this.updateBinderSearchs();
          },
          updateModuleSearchs()
          {
            let keyword = moduleSearch.value+"";
            scriptUtils.searchArrayDatas(this.superModules,this.moduleSearchs,keyword);
          },
          updateBinderSearchs()
          {
            let keyword = binderSearch.value+"";
            scriptUtils.searchArrayDatas(this.superBinders,this.binderSearchs,keyword);
          },
          updatePrefabSearchs()
          {
            let keyword = prefabSearch.value+"";
            scriptUtils.searchArrayDatas(this.prefabs,this.prefabSearchs,keyword,"value");
          },
          updatePrefabs()
          {
            let that = this;
            utils.findPrefabs(arr=>
            {
              that.prefabs = arr;
              that.updatePrefabSearchs();
            });
          },
          onPrefabSelected()
          {
              this.selectedPrefabs = "";
              for (let k = 0; k < this.prefabs.length; k++) 
              {
                  if(this.prefabs[k].selected)
                      this.selectedPrefabs+=this.prefabs[k].value+',';
              }
              if(this.selectedPrefabs.length>0&&this.selectedPrefabs.charAt(this.selectedPrefabs.length-1)==",")
                  this.selectedPrefabs = this.selectedPrefabs.substring(0,this.selectedPrefabs.length-1);
          },
          onCreate()
          {
            let name = moduleName.value+"";
            let p = utils.checkPanelPath(panel,name);
            this.errMsg = p.err?p.err:"";
            if(this.errMsg.length!=0)return;
            let msu = superModuleClass.value+"";
            let bsu = superBinderClass.value+"";
            if(msu=="{{option}}")
            {
              this.errMsg = "请选择需要继承的Module父类！";
              return;
            }
            if(bsu=="{{option}}")
            {
              this.errMsg = "请选择需要继承的Binder父类！";
              return;
            }
            
            let path = p.path+(this.isCreateDir?"/"+name:"")+".ts";
            let str = moduleTemplate+"";
            let d = description.value+"";
            if(d.length==0)d = name;

            str = scriptUtils.replaceScriptData(str,msu,path,name,d);
            let mdfs = "";
            for (let k = 0; k < this.prefabs.length; k++) 
            {
                if(this.prefabs[k].selected)
                    mdfs+='"'+this.prefabs[k].value.replace("resources/Prefabs/","")+'",';// 使用指定目录下的预制体
            }
            if(mdfs.length>0&&mdfs.charAt(mdfs.length-1)==",")
                mdfs = mdfs.substring(0,mdfs.length-1);
            str = str.replace(/{ModulePrefabs}/g,mdfs);
            let bAttr = bindAttr.value+"";
            bAttr = bAttr.replace(/[.]/g,"/");

            if(bAttr=="")
            {
                let sindex = str.indexOf("protected bindViews():void");
                let eindex = str.indexOf("this.binder.bindView(view)",sindex);
                eindex = str.indexOf("}",eindex);
                str = str.replace(str.substring(sindex,eindex+1),"");
                let str1 = 'import { getNodeChildByName } from "{getNodeChildByNamePath}";';
                str = str.replace(str1,"");
            }else
            {
                str = str.replace(/{BindNode}/g,"'"+bAttr+"'");
                let gggg = scriptUtils.getImportURL(scriptUtils.getNodeChildByName(),path.replace("db://",Editor.Project.path+"/"));//scriptUtils.getImportURL(scriptUtils.getNodeChildByName(),Path.dirname(path.replace("db://",Editor.Project.path+"/")));
                str = str.replace(/{getNodeChildByNamePath}/g,gggg);
            }
            name = binderName.value;
            str = str.replace(/{BinderPath}/g,"./"+name);
            str = str.replace(/{BinderName}/g,name);
			
			if(this.isAutoRelease)
			{
				str = str.replace("this.isReleaseAsset = false;","this.isReleaseAsset = true;");
				str = str.replace("this.delayReleaseAssetTime = 0;","this.delayReleaseAssetTime = "+this.delayTime+";");
			}
			
            if(this.isCreateDir)
            {
              if (!Fs.existsSync(Path.dirname(path.replace("db://",Editor.Project.path+"/")))) 
                Fs.mkdirsSync(Path.dirname(path.replace("db://",Editor.Project.path+"/")));
            }
            Editor.assetdb.create(path,str);
            path = path.replace(moduleName.value+".ts",name+".ts");//Path.join(Path.dirname(path),name)+".ts";
            str = binderTemplate+"";
            str = scriptUtils.replaceScriptData(str,bsu,path,name,d);
            Editor.assetdb.create(path,str);
          }
        }
      });
    });
  };
})();
