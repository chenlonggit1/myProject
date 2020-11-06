let Fs = require('fire-fs');
let packageName = "creater-manager";

module.exports = {
    init(plugin) {
        //Editor.log("prefab-item 注册组件!");
        Vue.component('prefab-item', 
		{
            props: ['data'],
            template: Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/item/prefab-item.html', 'utf8')) + "",
            created() 
			{    
            },
            methods: 
			{    
                onChange()
                {
                    let c = this.$el.querySelector("ui-checkbox");
                    this.data.selected = c.checked;
                    plugin.onPrefabSelected();
                },
                onClickBtnPingPong()
                {
                    let uuid = Editor.assetdb.remote.urlToUuid(this.data.url);
                    Editor.Ipc.sendToAll('assets:hint', uuid);
                },
                onClickBtnEdite()
                {
                    let uuid = Editor.assetdb.remote.urlToUuid(this.data.url);
                    Editor.Ipc.sendToAll('scene:enter-prefab-edit-mode', uuid);
                }
            },
            computed: {},
        });
    }
};