var Buff = require("Buff")
var GameConfig = require("GameConfig")
var EventManager = require("EventManager")

cc.Class({
    extends: cc.Component,

    properties: {
        entityID: 0,
    },

    onLoad: function () {
        this.buffList = [];
    },

    //初始化数据
    init: function (entity_id) {
        this.entityID = entity_id;
    },

    //注册事件
    initEvent: function () {
        EventManager.Add("TriggerBuff", function (event, data) {
            if (data.entity_id == event.entityID) {
                event.removeBuff(data.id);
            }
        }, this);
        EventManager.Add("BuffEnd", function (event, data) {
            if (data.target_entity_id == event.entityID) {
                event.removeBuff(data.id);
            }
        }, this);
    },

    //移除事件
    removeEvent: function () {
        EventManager.Remove("TriggerBuff", this);
        EventManager.Remove("BuffEnd", this);
    },

    //添加Buff
    addBuff: function (buff_id) {
        let node = new cc.Node("Buff_" + buff_id);
        let tempBuff = node.addComponent(Buff);
        let buffInfo = GameConfig.getBuffInfoWithID(buff_id)
        tempBuff.init(buffInfo, this.entityID);
        this.buffList.push(tempBuff)

        tempBuff.enabled = true;

        tempBuff.buffTrigger();
    },

    //移除Buff
    removeBuff: function (buff_id) {
        for (let index = this.buffList.length - 1; index >= 0; index--) {
            if (this.buffList[index].getBuffID() == buff_id) {
                this.buffList[index].enabled = false;
                this.buffList[index].bActive = false;
                this.buffList.splice(index, 1);
            }
        }
    },

    //获取Buff
    getBuffWithID: function (buff_id) {
        for (let index = 0; index < this.buffList.length; index++) {
            if (this.buffList[index].getBuffID() == buff_id) {
                return this.buffList[index];
            }
        }

        return null;
    },

    //获取Buff列表
    getBuffList: function () {
        return this.buffList;
    },

    //节点被销毁时调用
    onDestroy: function () {
        this.removeEvent();
    },
});