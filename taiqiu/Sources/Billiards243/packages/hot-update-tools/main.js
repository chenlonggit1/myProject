module.exports=
{
    load(){},
    unload(){},
    messages:
    {
        showPanel()
        {
            Editor.Panel.open("hot-update-tools")
        },
        test(t,e)
        {
            Editor.log(e);
            Editor.Ipc.sendToPanel("hot-update-tools","hot-update-tools:onBuildFinished")
        },
        "editor:build-finished":function(t,e)
        {
            let o=require("fire-fs"),a=require("fire-path");
            Editor.log("[HotUpdateTools] build platform:"+e.platform);
            if("win32"===e.platform||"android"===e.platform||"ios"===e.platform||"mac"===e.platform)
            {
                let t=a.normalize(e.dest),i=a.join(t,"main.js");
                o.readFile(i,"utf8",function(t,e)
                {
                    if(t)throw t;
                    let a=e.replace("window.boot = function () {","(function () {\n  if (typeof window.jsb === 'object') {\n    var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');\n    if (hotUpdateSearchPaths) {\n      var paths = JSON.parse(hotUpdateSearchPaths);\n      jsb.fileUtils.setSearchPaths(paths);\n      var fileList = [];\n      var storagePath = paths[0] || '';\n      var tempPath = storagePath + '_temp/';\n      var baseOffset = tempPath.length;\n      if (jsb.fileUtils.isDirectoryExist(tempPath) && !jsb.fileUtils.isFileExist(tempPath + 'project.manifest.temp')) {\n        jsb.fileUtils.listFilesRecursively(tempPath, fileList);\n        fileList.forEach(srcPath => {\n          var relativePath = srcPath.substr(baseOffset);\n          var dstPath = storagePath + relativePath;\n          if (srcPath[srcPath.length] == '/') {\n            cc.fileUtils.createDirectory(dstPath)\n          }\n          else {\n            if (cc.fileUtils.isFileExist(dstPath)) {\n              cc.fileUtils.removeFile(dstPath)\n            }\n            cc.fileUtils.renameFile(srcPath, dstPath);\n          }\n        })\n        cc.fileUtils.removeDirectory(tempPath);\n      }\n    }\n  }\n})();\n\nwindow.boot = function () {\n");
                    var temp = 'settings.server';
                    // 添加原生超时的设置
                    let index = a.lastIndexOf(temp);
                    a = a.slice(0, index + temp.length) + ',\n\t\tjsbDownloaderTimeout: 600 // 超时时长' + a.slice(index + temp.length);
                    o.writeFile(i,a,function(e)
                    {
                        if(t)throw t;
                        Editor.log("[HotUpdateTools] SearchPath updated in built main.js for hot update")
                    })
                })
            }else Editor.log("[HotUpdateTools] don't need update main.js, platform: "+e.platform);
            let i=(new Date).getTime();
            Editor.Ipc.sendToPanel("hot-update-tools","hot-update-tools:onBuildFinished",i);
            Editor.require("packages://hot-update-tools/core/CfgUtil.js").updateBuildTimeByMain(i);
        }
    }
};