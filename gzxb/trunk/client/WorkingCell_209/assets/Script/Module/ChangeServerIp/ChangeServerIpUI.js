var net = require("net");
var EventManager = require("EventManager");
var CacheManager = require("CacheManager");
var WindowManager = require("WindowManager");


cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function () {
        this.itemPrefab = this.node.getChildByName("Item");
        this.selectServerBtnText = this.node.getChildByName("SelectServerBtn").getChildByName("Text").getComponent(cc.Label);
        this.content = this.node.getChildByName("Servers").getChildByName("view").getChildByName("content");
        this.addConfigView = this.node.getChildByName("AddConfigView");
        this.serverIpInput = this.addConfigView.getChildByName("Input").getComponent(cc.EditBox);
        this.tips = this.addConfigView.getChildByName("Tips")
        this.tipsText = this.tips.getChildByName("Text").getComponent(cc.Label);

        this.selectIndex = CacheManager.instance.debugServerDatas["selectIndex"];
        this.serverDatas = CacheManager.instance.debugServerDatas["serverDatas"];

        this.items = [];

        this.updateCurrentSelectServerInfo(this.selectIndex);

        this.updateItems();
    },

    //初始化数据
    initData: function (name) {
        this.name = name;
    },

    updateItems: function () {
        for (let index = 0; index < this.serverDatas.length; index++) {
            let item = this.items[index];
            if (item == null) {
                item = {};
                item.gameObject = cc.instantiate(this.itemPrefab);
                item.gameObject.parent = this.content;
                item.text = item.gameObject.getChildByName("Text").getComponent(cc.Label);

                var clickItemHandler = new cc.Component.EventHandler();
                clickItemHandler.target = this.node;
                clickItemHandler.component = "ChangeServerIpUI";
                clickItemHandler.handler = "onItemClickHandler";
                clickItemHandler.customEventData = index;
                item.gameObject.getComponent(cc.Button).clickEvents.push(clickItemHandler);
                item.gameObject.active = true;

                this.items.push(item);
            }

            item.text.string = this.serverDatas[index];
        }
    },

    updateCurrentSelectServerInfo: function (index) {
        this.selectServerBtnText.string = "当前连接的IP：" + this.serverDatas[index];
        this.selectIndex = index;
    },

    onItemClickHandler: function (event, customEventData) {
        this.content.active = false;
        this.updateCurrentSelectServerInfo(customEventData);
    },

    onSelectServerBtnClick: function () {
        this.content.active = !this.content.active;
    },

    onConfirmBtnClick: function () {
        net.ServerIp = this.serverDatas[this.selectIndex];

        this.node.active = false;

        WindowManager.instance.closeWindow(this.name);

        CacheManager.instance.saveDebugServerDatas(this.selectIndex, this.serverDatas);

        EventManager.Dispatch("ChangeServerIpSuccess")
    },

    onAddConfigBtnClick: function () {
        this.addConfigView.active = true;
    },

    closeAddConfigView: function () {
        this.addConfigView.active = false;
    },

    onAddConfigCloseBtnClick: function () {
        if (this.serverIpInput.string == "") {
            this.showTips("请输入正确的服务器IP");
            return;
        }

        if (this.serverIpInput.string.indexOf(" ") != -1) {
            this.showTips("输入框的内容包含了空格，请重新输入！");
            return;
        }

        this.serverDatas.push(this.serverIpInput.string);
        CacheManager.instance.saveDebugServerDatas(this.selectIndex, this.serverDatas);

        this.addConfigView.active = false;

        this.updateItems();
    },

    showTips: function (text) {
        this.tipsText.string = text;
        this.tips.active = true;
        this.scheduleOnce(function () {
            this.closeTips();
        }, 2);
    },

    closeTips: function () {
        this.tips.active = false;
    },
});