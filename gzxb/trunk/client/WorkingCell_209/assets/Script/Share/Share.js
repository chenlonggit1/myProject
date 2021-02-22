var net = require("net")
var GameConfig = require("GameConfig");

cc.Class({
    extends: cc.Component,

    onLoad: function () {
        //添加为不销毁节点
        cc.game.addPersistRootNode(this.node);
    },

    getConfig: function () {
        let self = this;
        let url = location.href.split("#")[0];

        net.GetWeChatConfigWithPost(url, function (data) {
            let config = JSON.parse(data)
            if (config.res == "sucess") {
                self.initConfig(config.noncestr, config.appId, config.timestamp, config.signature)
            }
        }, null)
    },

    initConfig: function (noncestr, appid, timestamp, singature) {
        if (typeof (wx) == "undefined") {
            return;
        }

        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appid, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noncestr, // 必填，生成签名的随机串 
            signature: singature, // 必填，签名，见附录1   
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ",
                "onMenuShareWeibo",
                "onMenuShareQZone",
                "chooseWXPay"
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2    
        });

        wx.ready(function () {
            var title = "亲朋战斗细胞";
            var linkUrl = GameConfig.shareAddress;
            var iconUrl = GameConfig.shareIconAddress;
            var desc = "为了身体健康，我们要消灭细菌，冲鸭！";

            //分享朋友圈
            wx.onMenuShareTimeline({
                title: title,
                link: linkUrl,
                imgUrl: iconUrl, // 自定义图标
                trigger: function (res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回.
                    //alert('click shared');
                },
                success: function (res) {
                    //alert('shared success');
                    //some thing you should do
                },
                cancel: function (res) {
                    //alert('shared cancle');
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                }
            });

            //分享给朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述   
                link: linkUrl,
                imgUrl: iconUrl, // 分享图标 
                type: 'link', // 分享类型,music、video或link，不填默认为link 
                dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空  
                success: function () {
                    // 用户确认分享后执行的回调函数
                    EventManager.Dispatch("CloseShareTipWindow");
                    net.activateFootballerReq(userManager.User.unlockHeroId);
                    // alert("分享成功");
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    EventManager.Dispatch("CloseShareTipWindow");
                    EventManager.Dispatch("ShareFailed");
                    // alert("取消分享");
                },
                fail: function () {
                    // 用户分享失败后执行的回调函数
                    EventManager.Dispatch("CloseShareTipWindow");
                    EventManager.Dispatch("ShareFailed");
                    // alert("分享失败");
                }
            });

            //分享到QQ
            wx.onMenuShareQQ({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: linkUrl, // 分享链接
                imgUrl: iconUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            //分享到腾讯微博
            wx.onMenuShareWeibo({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: linkUrl, // 分享链接
                imgUrl: iconUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            //分享到QQ空间
            wx.onMenuShareQZone({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: linkUrl, // 分享链接
                imgUrl: iconUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }.bind(this));

        wx.error(function (err) {});
    },
});