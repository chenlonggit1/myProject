(() => {
  'use strict';

  return function init (panel) 
  {
    let packageName = "creater-manager";
    let viewEL = panel.view;
    let Fs = require("fire-fs");
    let Path = require('fire-path');
    let template = Fs.readFileSync(Editor.url('packages://' + packageName + '/templates/binder.txt', 'utf8')) + "";
    let utils = Editor.require('packages://' + packageName + '/utils/Utils.js');
    let scriptUtils = Editor.require('packages://' + packageName + '/utils/ScriptUtils.js');
    Editor.import('packages://'+packageName+'/panel/item/Binder.tmpl').then(content => 
    {
      viewEL.innerHTML = content;
      let inputEL = viewEL.querySelector('#name');
      let superClass = viewEL.querySelector('#superClass');
      let description = viewEL.querySelector('#description');
      let search = viewEL.querySelector('#search');
      this.plugin = new window.Vue(
      {
        el: viewEL,
        created(){},
        init()
        {
          setTimeout(() =>this.updateSupers(), 50);
        },
        data:
        {
          searchs:[],
          errMsg:"",
          supers:[]
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
                if(sc.implements.indexOf('IBinder')!=-1)
                    this.supers.push(sc.path.replace(p,""));
            }
            this.updateSearchs();
          },
          updateSearchs()
          {
            let keyword = search.value+"";
            scriptUtils.searchArrayDatas(this.supers,this.searchs,keyword);
          },
          onCreate()
          {
            let name = inputEL.value+"";
            let p = utils.checkPanelPath(panel,name);
            this.errMsg = p.err?p.err:"";
            if(this.errMsg.length!=0)return;
            let su = superClass.value+"";
            if(su=="{{option}}")
            {
              this.errMsg = "请选择需要继承的Binder父类！";
              return;
            }
            let path = p.path+".ts";
            let str = template+"";
            let d = description.value+"";
            if(d.length==0)d = name;
            str = scriptUtils.replaceScriptData(str,su,path,name,d);
            Editor.assetdb.create(path,str);
          }
        }
      });
    });
  };
})();