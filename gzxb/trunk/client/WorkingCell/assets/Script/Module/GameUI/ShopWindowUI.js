var net = require("net");
var DataManager = require("DataManager");
var EventManager = require('EventManager');
var WindowManager = require("WindowManager");
var GameConfig = require("GameConfig");
var CacheManager = require("CacheManager");
const PriceConfig = {
    1: 2,
    2: 12,
    3: 30,
    4: 100,
    5: 500,
}
cc.Class({
    extends: cc.Component,

    properties: {
        progress: 0,
        isPayIng: false
    },

    onLoad: function () {

        this.slider = this.node.getChildByName("duihuan").getChildByName("slider");
        this.mask = this.node.getChildByName("duihuan").getChildByName("dhProgress").getChildByName("Mask");
        this.voucherNum = this.node.getChildByName("duihuan").getChildByName("dianquan").getChildByName("num");
        this.goldNum = this.node.getChildByName("duihuan").getChildByName("gold").getChildByName("num");
        this.dianjuan = this.node.getChildByName("topBg").getChildByName("myDianquan").getChildByName("dianquan");
        this.goldVal = this.node.getChildByName("topBg").getChildByName("myGold").getChildByName("gold");
        this.dianjuan.getComponent(cc.Label).string = DataManager.instance.getVoucher();
        this.goldVal.getComponent(cc.Label).string = DataManager.instance.getClientMoney();

        this.MaskNode = this.node.getChildByName("Mask");

        this.initEvent();
        this.node.getChildByName("topBg").getChildByName("toggle").getComponent(cc.Toggle).isChecked = DataManager.instance.audtoDuiHuan;
    },

    initEvent: function () {
        EventManager.Add("changeVoucher", function (event) {
            if (event.dianjuan) {
                event.dianjuan.getComponent(cc.Label).string = DataManager.instance.getVoucher();
            }
        }, this);

        //改变金币
        EventManager.Add("changeMoney", function (event, data) {
            if (event.goldVal) {
                event.goldVal.getComponent(cc.Label).string = DataManager.instance.getClientMoney();
            }
        }, this);
    },

    onDestroy: function () {
        EventManager.Remove("changeVoucher", this);
        EventManager.Remove("changeMoney", this);
    },

    initData: function (name, data) {
        this.name = name;
    },

    sliderUpdate: function () {
        this.progress = this.slider.getComponent(cc.Slider).progress;
        this.resetProgress();
    },

    plusExchange: function () {
        this.progress = this.progress + (1 / DataManager.instance.getVoucher());
        if (this.progress > 1)
            this.progress = 1;
        this.resetProgress();
    },

    minusExchange: function () {
        this.progress = this.progress - (1 / DataManager.instance.getVoucher());
        if (this.progress < 0)
            this.progress = 0;
        this.resetProgress();
    },

    resetProgress: function () {
        this.slider.getComponent(cc.Slider).progress = this.progress;
        this.mask.width = 380 * this.progress;
        this.updateDuiHuan();
    },

    updateDuiHuan: function () {
        var voucher = Math.round(DataManager.instance.getVoucher() * this.progress);
        var gold = Math.round(DataManager.instance.getVoucher() * this.progress) * 2000;
        this.voucherNum.getComponent(cc.Label).string = voucher;
        this.goldNum.getComponent(cc.Label).string = gold;
    },

    duihuanOkBtn: function () {
        var voucher = DataManager.instance.getVoucher();
        var num = Math.round(voucher * this.progress);
        var self = this;
        if (num <= 0) {
            WindowManager.instance.showTips({
                "desc": "兑换点券必须大于0"
            });
            return;
        }
        net.ticketExchangeGoldReq(net.PlayerId, Math.round(voucher * this.progress), function (data) {
            //请求成功后处理 
            if (data) {
                var result = JSON.parse(data);
                if (result.result.value == 0) {
                    WindowManager.instance.showTips({
                        "desc": `兑换成功，获得${result.result.data.ChargeValue}金币！`
                    });
                    // self.goldNum.getComponent(cc.Label).string = 0;
                    EventManager.Dispatch('refreshUserDianJuan');
                } else {
                    WindowManager.instance.showTips({
                        "desc": `${result.result.message}`
                    });
                }
            }
        });
    },

    togglerClick: function () {
        DataManager.instance.audtoDuiHuan = !DataManager.instance.audtoDuiHuan;
        CacheManager.instance.saveGameData();
    },

    shopBuyClick: function (event, type) {
        var money = PriceConfig[type];
        // DataManager.instance.openid = "o-37M0dzvK4eNkHz1fifDYlBm95I";
        if (DataManager.instance.openid == "") {
            WindowManager.instance.showTips({
                "desc": `错误信息`
            });
            return;
        }
        if (this.isPayIng) return;
        this.MaskNode.active = true;
        this.isPayIng = true;
        var callback = function (result) {
            if (result) {
                var data = JSON.parse(result);
                console.log(data);
                // alert("data.Result=" + data.Result);
                if (data.Result == 0) {
                    var wxData = data.Data;
                    self.pullUpPayment(wxData); //拉起支付   
                } else if (data.Result == 13) { //未实名认证  
                    // self.windowManager.PreventAddictionTip(2, 0, "未实名认证,请先实名认证！");
                    WindowManager.instance.showTips({
                        "desc": "未实名认证,请先实名认证！",
                        "confirmCallBack": function () {
                            cc.sys.openURL(GameConfig.tAntiAddictionAddressInfo);
                        },
                    })
                } else {
                    WindowManager.instance.showTips({
                        "desc": `下单失败,请重新登陆后尝试!`
                    });
                }
                self.unschedule(payEndFunc);
                self.isPayIng = false;
                self.MaskNode.active = false;
            }
        }
        var isZDduihuan = 0;
        if (DataManager.instance.audtoDuiHuan) {
            isZDduihuan = 1;
        }
        net.sendWxPay(DataManager.instance.openid, net.PlayerId, money, isZDduihuan, GameConfig.gameId, callback);
        var self = this;
        var payEndFunc = function () {
            if (self.isPayIng) {
                self.isPayIng = false;
                self.MaskNode.active = false;
                WindowManager.instance.showTips({
                    "desc": `充值失败`
                });
            }
        }
        self.scheduleOnce(payEndFunc, 10);
    },

    pullUpPayment: function (data) {
        var self = this;

        function jsApiCall() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', data,
                function (res) {
                    // alert(res.err_code + res.err_desc + res.err_msg);
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。 
                        WindowManager.instance.showTips({
                            "desc": `支付成功`
                        });
                        EventManager.Dispatch('refreshUserDianJuan');
                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        WindowManager.instance.showTips({
                            "desc": `取消成功`
                        });
                    } else {

                    }
                }
            );
        }

        function callpay() {
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                    document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                }
            } else {
                jsApiCall();
            }
        }
        callpay();
    },

    closeWindow: function () {
        WindowManager.instance.closeWindow(this.name);
        this.node.destroy();
    },
});