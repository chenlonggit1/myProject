module.exports = 
{
    'add-scene-script':function(evt,data)
    {
        let component = data;
        var scene = cc.director.getScene();
        var root = cc.Canvas.instance.node;
		let size = cc.view.getDesignResolutionSize();
		//Editor.log("---->",size.width,size.height);
        if(!root.getComponent(component))
        {
            let c = root.addComponent(component);
			
            if(c["creatLayer"]!=null)
            {
                c["creatLayer"] = true;
                setTimeout(() =>
                {
                    c["creatLayer"] = false;
                    Editor.Ipc.sendToPanel('scene', 'scene:stash-and-save');// 保存场景
                }, 100);
            }else Editor.log("在场景中挂载脚本失败---->",component);
            
        }
        Editor.Selection.select('node', root.uuid);
    }
    // 'get-prefab-root': function (evt,data) 
    // {
    //     var indexs = (data.uuid&&data.uuid!="")?data.uuid.split("/"):[];
    //     let paths = data.path.split("/");
    //     var scene = cc.director.getScene();
    //     var root = scene.children[0];
    //     if(!root||root.name!=paths.shift())return;
    //     let node = root;
    //     for (let i = 0; i < paths.length; i++) 
    //     {
    //         node = node.children[indexs[i]];
    //         if(node.name!=paths[i])
    //         {
    //             Editor.error("未找到对应的节点:",data.path);
    //             return;
    //         }
    //     }
    //     if(node&&node.uuid!=null)
    //     {
    //         Editor.Selection.select('node', node.uuid);
    //         Editor.Ipc.sendToAll('hierarchy:hint', node.uuid);
    //     }
    // }
};