'use strict';

let packageName = "creater-manager";
let Fs = require("fire-fs");
let utils = Editor.require('packages://' + packageName + '/utils/Utils.js');
let setting = Editor.require('packages://' + packageName + '/setting/Setting.js');
let scriptUtils = Editor.require('packages://' + packageName + '/utils/ScriptUtils.js');

Editor.Panel.extend(
{
    style:Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/panel.css', 'utf8')) + "",
    template:Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/panel.html', 'utf8')) + "",
    $: 
    {
        view:'#view',
        typeSelect:'#typeSelect',
        gameSearch:"#gameSearch",
        gameSelect:'#gameSelect'
    },
    ready () 
    {
        setting.init();
        this.setting = setting;
        this.view = this.$view;
        this.gameSelect = this.$gameSelect;
        let typeSelect = this.$typeSelect;
        let gameSelect = this.gameSelect;
        let gameSearch = this.$gameSearch;
        gameSelect.addEventListener('confirm', event => 
        {
            let value = event.target.value;
            setting.profile().gameSelect=value;
            setting.save();
        });
        typeSelect.addEventListener('confirm', event => 
        {
            let value = event.target.value;
            this.showPreview(value);
        });
        this.plugin = new window.Vue(
        {
            el: this.shadowRoot,
            created(){},
            init()
            {
                setTimeout(() => this.getSettingData(), 50);
            },
            data:
            {
                corePath:"",
                gamePath:"",
                games:[],
                gameSearchs:[],
                types:["Module&Binder","Module","Binder"]
            },
            watch:
            {
                gamePath()
                {
                    if(utils.isValidPath(this.gamePath))
                        this.updateGames();
                },
            },
            methods:
            {
                updateGames()
                {
                    this.games = utils.findFolders(this.gamePath);
                    this.updateGameSearchs();
                    let vv = setting.profile().gameSelect;
                    if(this.gameSearchs.indexOf(vv)==-1)return;
                    gameSelect.value = vv;
                },
                updateGameSearchs()
                {
                    let keyword = gameSearch.value+"";
                    scriptUtils.searchArrayDatas(this.games,this.gameSearchs,keyword);
                },
                getSettingData()
                {
                    let g = setting.profile().gamePath;
                    let c = setting.profile().corePath;
                    if(utils.isValidPath(g))this.gamePath = g;
                    if(utils.isValidPath(c))this.corePath = c;
                },
                onSelectFolder(type)
                {
                    utils.selectFolder((res)=>
                    {
                        if(type==1)setting.profile().corePath=this.corePath = res;
                        if(type==2)setting.profile().gamePath=this.gamePath = res;
                        setting.save();
                    });
                },
			}
        });
    },
    showPreview (name) 
    {
        Editor.import(`packages://creater-manager/panel/item/${name}.js`).then(initFn => 
        {
            initFn(this);
        });
    },
});
