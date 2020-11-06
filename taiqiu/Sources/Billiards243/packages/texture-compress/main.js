'use strict';
const path = require('path');
var texturePacker = require('./texture-pack');

module.exports = {

  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {

    // 'editor:build-finished': function (event, target) {
    //   Editor.log("Start handle compress texture... ");
    //   // if (configs.enable) {
    //   //   Editor.log('开始压缩纹理...');
    //   //   // texPacker.startPack();
    //   // } else {
    //   //   Editor.log('纹理压缩已关闭，不进行纹理压缩。');
    //   // }
    // },

    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('texture-compress');
    },

    //开始打包texture.
    'packtex'() {
      let log = function (...args) {
        let txts = "";
        args.forEach((txt, i) => {
          txts += txt + (i != args.length ? "\t" : "");
        })
        var time = new Date();
        Editor.log("[" + time.toLocaleString() + "]: " + txts);
      }
      const userDefaultPath = Editor.Project.path + path.sep + "settings/plugin_etc_cfg.json";
      Editor.log('开始压缩纹理...');
      texturePacker.startPack(userDefaultPath, log);
    }
  },
};