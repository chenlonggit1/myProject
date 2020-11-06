'use strict';

const fs = require('fs');
const path = require('path');
const Electron = require('electron');
// const texPacker = require(Editor.url('packages://texture-compress/pack.js'));
const texturePacker = require(Editor.url('packages://texture-compress/texture-pack.js'));

// const userDefaultPath = Editor.url('packages://texture-compress/panel/userdefault.json');
const userDefaultPath = Editor.Project.path + path.sep + "settings/plugin_etc_cfg.json";
Editor.Panel.extend({
  // css style for panel
  style: fs.readFileSync(Editor.url('packages://texture-compress/panel/index.css', 'utf8')) + "",
  template: fs.readFileSync(Editor.url('packages://texture-compress/panel/index.html', 'utf8')) + "",
  // element and variable binding
  $: {
    logTextArea: '#logTextArea'
  },
  // method executed when template and styles are successfully loaded and initialized
  ready() {
    let logTextArea = this.$logTextArea;
    new window.Vue({
      el: this.shadowRoot,
      created: function () {
        this._loadConfig();
      },
      init: function () {
      },
      data: {
        attributes: {
          androidEnabled: true,
          iOSEnabled: false,
          zlibEnabled: true,
          alphaEnabled: true,
          textureEnabled: true,
          pathOfPVR: "/Applications/CocosCreator/Creator/2.4.3-rc.7/CocosCreator.app/Contents/Resources/static/tools/texture-compress/PVRTexTool/OSX_x86",
          pathOfETC: "/Applications/CocosCreator/Creator/2.4.3-rc.7/CocosCreator.app/Contents/Resources/static/tools/texture-compress/mali/OSX_x86",
          pathOfTarget: "/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/build/jsb-link/assets/CatchFish",
          handlePaths: [],
        },
        androidEnabled: true,
        iOSEnabled: false,
        zlibEnabled: true,
        alphaEnabled: true,
        textureEnabled: true,
        pathOfPVR: "/Applications/CocosCreator/Creator/2.4.3-rc.7/CocosCreator.app/Contents/Resources/static/tools/texture-compress/PVRTexTool/OSX_x86",
        pathOfETC: "/Applications/CocosCreator/Creator/2.4.3-rc.7/CocosCreator.app/Contents/Resources/static/tools/texture-compress/mali/OSX_x86",
        pathOfTarget: "/Users/berwin/Documents/XJGKS/Workspaces/Doudizhu/build/jsb-link/assets/CatchFish",
        handlePaths: [],

        tests: ["a", "b", "c"],

        logTexts: "",
      },
      methods: {
        _loadConfig() {
          if (fs.existsSync(userDefaultPath)) {
            this.log("读取配置:" + userDefaultPath);
            var saveData = fs.readFileSync(userDefaultPath, 'utf-8');
            let data;
            try {
              data = JSON.parse(saveData);
            } catch (e) {
              this.log("读取配置错误:" + saveData);
              this.log(e.toString());
              return;
            }
            for (const key in this.attributes) {
              const value = data[key] != null ? data[key] : this.attributes[key];
              this[key] = value;
            }
          } else {
            this.log("配置文件不存在:" + userDefaultPath);
          }
        },
        _saveConfig() {
          var data = {};
          for (const key in this.attributes)
            data[key] = this[key];
          fs.writeFileSync(userDefaultPath, JSON.stringify(data));
          this.log("保存成功");
        },
        log(...args) {
          let txts = "";
          args.forEach((txt, i) => {
            txts += txt + (i != args.length ? "\t" : "");
          })
          var time = new Date();
          this.logTexts += "[" + time.toLocaleString() + "]: " + txts + "\n";
          Editor.log("[" + time.toLocaleString() + "]: " + txts);
          // logTextArea.value = this.logTexts;
          logTextArea.scrollTop = logTextArea.scrollHeight;
        },
        onSelectPVRRootDir() {
          let result = Editor.Dialog.openFile({
            title: "选择PVR工具目录",
            defaultPath: this.pathOfPVR === "" ? Editor.Project.path : this.pathOfPVR,
            properties: ['openDirectory'],
          });
          if (result != -1) {
            this.pathOfPVR = result[0];
            this._saveConfig();
          } else {
            this.log("选择文件目录错误");
          }
        },
        onOpenPVRDir() {
          if (!fs.existsSync(this.pathOfPVR)) {
            Electron.shell.beep();
            this.log("PVR目录不存在：" + this.pathOfPVR);
            return;
          }
          Electron.shell.showItemInFolder(this.pathOfPVR);
        },
        onSelectETCRootDir() {
          let result = Editor.Dialog.openFile({
            title: "选择ETC工具目录(bin目录)",
            defaultPath: this.pathOfETC === "" ? Editor.Project.path : this.pathOfETC,
            properties: ['openDirectory'],
          });
          if (result != -1) {
            this.pathOfETC = result[0];
            this._saveConfig();
          } else {
            this.log("选择文件目录错误");
          }
        },
        onOpenETCDir() {
          if (!fs.existsSync(this.pathOfETC)) {
            Electron.shell.beep();
            this.log("ETC目录不存在：" + this.pathOfETC);
            return;
          }
          Electron.shell.showItemInFolder(this.pathOfETC);
        },
        onSelectTargetRootDir() {
          let result = Editor.Dialog.openFile({
            title: "选择处理纹理目录",
            defaultPath: this.pathOfTarget === "" ? Editor.Project.path : this.pathOfTarget,
            properties: ['openDirectory'],
          });
          if (result != -1) {
            this.pathOfTarget = result[0];
            this._saveConfig();
          } else {
            this.log("选择文件目录错误");
          }
        },
        onOpenTargetDir() {
          if (!fs.existsSync(this.pathOfTarget)) {
            Electron.shell.beep();
            this.log("纹理目录不存在：" + this.pathOfTarget);
            return;
          }
          Electron.shell.showItemInFolder(this.pathOfTarget);
        },
        onWorkbench() {
          let buildPath = Editor.Project.path + "/build/jsb-default/";
          if (!fs.existsSync(buildPath)) {
            buildPath = Editor.Project.path + "/build/jsb-link/";
          }
          let android = buildPath + texturePacker.WORKBENCH_ANDROID + path.sep
          let ios = buildPath + texturePacker.WORKBENCH_IOS + path.sep
          this.log("Android:" + android + "   目录" + (fs.existsSync(android) ? "存在" : "不存在"));
          this.log("iOS:" + ios + "   目录" + (fs.existsSync(ios) ? "存在" : "不存在"));
          Electron.shell.showItemInFolder(android);
          Electron.shell.showItemInFolder(ios);
        },
        onClearLog() {
          this.logTexts = "";
        },
        onTiggerSaveConfig() {
          this._saveConfig();
        },
        onETCPvrClicked() {
          if (!this.textureEnabled) {
            this.alphaEnabled = false;
          }
          this.onTiggerSaveConfig();
        },
        onAlphaClicked() {
          if (this.alphaEnabled) {
            this.textureEnabled = true;
          }
          this.onTiggerSaveConfig();
        },
        onClickCompress() {
          if (!this.androidEnabled && !this.iOSEnabled) {
            this.log("没有平台需要处理");
            return;
          }
          if (this.pathOfTarget === "") {
            this.log("纹理目录为空");
            return;
          }
          this._saveConfig();
          this.onClearLog();
          // texPacker.startPack(userDefaultPath, this.log);
          texturePacker.startPack(userDefaultPath, this.log);
        },
        // handlePaths
        onHandleAddClicked() {
          let defaultPath = Editor.Project.path + "/build/jsb-default/"
          if (!fs.existsSync(defaultPath)) {
            defaultPath = Editor.Project.path + "/build/jsb-link/";
            defaultPath = fs.existsSync(defaultPath) ? defaultPath : Editor.Project.path;
          }
          let result = Editor.Dialog.openFile({
            title: "选择处理纹理目录",
            defaultPath: defaultPath,
            properties: ['openDirectory'],
          });
          if (result != -1) {
            this.handlePaths.push(result[0]);
            this._saveConfig();
          } else {
            this.log("选择文件目录错误");
          }
        },
        onHandleDeleteClicked(idx) {
          this.handlePaths.splice(idx, 1);
          this._saveConfig();
        },
        onHandleModifyClicked(idx) {
          let path = this.handlePaths[idx];
          let result = Editor.Dialog.openFile({
            title: "选择处理纹理目录",
            defaultPath: path || Editor.Project.path,
            properties: ['openDirectory'],
          });
          if (result != -1) {
            this.handlePaths[idx] = result[0];
            this.handlePaths = [].concat(this.handlePaths);
            this.log("修改:" + JSON.stringify(this.handlePaths));
            this._saveConfig();
          } else {
            this.log("选择文件目录错误");
          }
        },
        onHandleOpenClicked(idx) {
          let path = this.handlePaths[idx];
          if (!fs.existsSync(path)) {
            Electron.shell.beep();
            this.log("目录不存在：" + path);
            return;
          }
          Electron.shell.showItemInFolder(path);
        }

      },
    });
  },

  // register your ipc messages here
  messages: {

    'texture-compress:logmsg'(event, msg) {
      let time = new Date();
      msg = "[" + time.toLocaleString() + "]: " + msg + "\n";
      let content = this.$textArea.value;
      content += msg;
      this.$textArea.value = content;

      let textArea = this.$textArea;
      textArea.scrollTop = textArea.scrollHeight;
    },
  }
});