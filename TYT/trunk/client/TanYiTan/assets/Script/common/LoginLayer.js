import { GameTools } from 'GameTools';
import { config } from 'Config';

cc.Class({
    extends: cc.Component,
    // mixins: [haha, cc.EventTarget],

    properties: {
        loadNode: cc.Node,          //加载节点
        loadingBar: cc.ProgressBar, //加载进度条
        laodingTip: cc.Label,       //加载进度提示
        loadingSpeed: 0,            //加载速度

        lbVersion: cc.Label,         //版号
        lbID: cc.Label,              //ID
        lbVersion1: cc.Label,        //版号
        lbID1: cc.Label,             //ID
        gameStart: cc.Node,         //游戏开始
        gameBox: cc.Prefab,         //盒子
        signIn: cc.Prefab,          //签到
        startBallNum: cc.Label,     //球数

        //  update开关
        isLoadingStatusChecked: {
            default: false,
            visible: false
        },

    },

    onLoad: function () {
        //适配
        let rate = cc.view.getVisibleSize().width / cc.view.getVisibleSize().height;
        let canvas = this.node.getComponent(cc.Canvas);
        let isMoreWidth = rate > (1136 / 640);

        canvas.fitWidth = !isMoreWidth;
        canvas.fitHeight = isMoreWidth;
        //iPhone X适配
        window.bIsIPhoneX = false;

        let curWinSize = cc.winSize;
        let tempRatio = curWinSize.height / curWinSize.width;
        if (tempRatio > 2) {
            // cc.log("iPhone X");
            window.bIsIPhoneX = true;
        }
        canvas.alignWithScreen();
    },

    start: function () {
        let self = this;
        window.ballNum = 10;                //初始球数量
        window.boxBallNum = 50;             //初始盒子分享球数量
        window.awardGoldNum = 0;            //签到金币奖励
        window.awardSkillNum = [0, 0, 0];   //签到技能奖励
        window.isSignInSevenDays = false;   //是否累计签到七天
        window.shareThreeNum = 0;           //累计分享次数
        let signInData = config.getSignIn();
        if (signInData != "" && signInData != null && signInData != undefined) {
            window.isSignInSevenDays = signInData.isSignInSevenDays;
            window.shareThreeNum = signInData.shareThreeNum == undefined ? 0 : signInData.shareThreeNum;
        }

        window.sharePath = cc.url.raw("resources/res/share.jpg");
        window.userInfoPath = cc.url.raw("resources/res/danzhu_ks_anniu1.png");
        if (cc.loader.md5Pipe) {
            window.sharePath = cc.loader.md5Pipe.transformURL(window.sharePath);
            window.userInfoPath = cc.loader.md5Pipe.transformURL(window.userInfoPath);
        }
        this.updateCheck();
        this.lbVersion.string = "V1.0.5";
        this.lbID.string = "ID 123456";
        this.lbVersion1.string = "V1.0.5";
        this.lbID1.string = "ID 123456";
        // this.lbID.active = false;
        if (CC_WECHATGAME) {
            // wx.setPreferredFramesPerSecond(40);
            wx.showShareMenu({
                success: function (res) {
                    // console.log("showShareMenu" + res);
                },
                fail: function (res) {
                    // console.log("showShareMenu" + res);
                }
            });
            wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                return {
                    title: '超好玩的弹一弹消除游戏，只为带你回忆童趣时光。',
                    imageUrl: window.sharePath,
                }
            });

            wx.getSetting({
                success: (res) => {
                    // console.log("用户信息授权" + res.authSetting['scope.userInfo']);
                    let sysInfo = wx.getSystemInfoSync();
                    let curLeft = sysInfo.screenWidth / 2;
                    let curTop = sysInfo.screenHeight / 2;
                    let curWidth = 145;
                    let curHeight = 60;
                    if (!res.authSetting['scope.userInfo']) {
                        let button = wx.createUserInfoButton({
                            type: 'image',
                            image: window.userInfoPath,
                            style: {
                                left: curLeft - curWidth / 2,
                                top: curTop - curHeight / 2 - 50,
                                width: curWidth,
                                height: curHeight,
                            }
                        })
                        button.onTap((userRes) => {
                            console.log(userRes.userInfo);
                            if (userRes.userInfo) {
                                self.isLoadingStatusChecked = true;
                                button.destroy();
                            } else {
                                // console.log("获取用户信息失败，请重新授权");
                            }
                        })
                    }
                    else {
                        self.isLoadingStatusChecked = true;
                    }
                }
            })
        }
    },

    update: function (dt) {
        if (!this.isLoadingStatusChecked) {
            return;
        }
        this.updateLoadingInfo(dt);
    },

    updateCheck: function () {
        //  进度条置为0
        let setDefaultText = cc.callFunc(() => {
            this.loadingBar.progress = 0;
        });

        //  等待1秒
        let delay = cc.delayTime(1);
        if (cc.sys.isBrowser && !cc.sys.isMobile) {
            // cc.log("Local browser");
            delay = cc.delayTime(0.1);
        }

        //  打开update开关
        let updateResultCheck = cc.callFunc(this.updateResultCheck.bind(this));

        //  按顺序执行上述3个方法
        this.node.runAction(cc.sequence(setDefaultText, delay, updateResultCheck));
    },

    //  打开进入update的开关
    updateResultCheck: function () {
        if (!CC_WECHATGAME) {
            this.isLoadingStatusChecked = true;
        }
    },

    //  进度条加载
    updateLoadingInfo: function (dt) {
        let progress = this.loadingBar.progress;
        progress += dt * this.loadingSpeed; //  模拟加载进度：进度值随时间增加
        this.loadingBar.progress = progress;
        if (this.loadingBar.progress >= 1) {
            progress = 1;
        }
        this.laodingTip.string = "加载中（" + Math.round(progress * 100) + "%）";

        if (this.loadingBar.progress >= 1) {
            // console.log("loading, done");
            this.isLoadingStatusChecked = false;
            this.loadNode.active = false;
            this.gameStart.active = true;
            this.setBoxBallNum();

            if (GameTools.checkInTodaySignIn()) {
                let signInNode = cc.instantiate(this.signIn);
                this.node.getChildByName("date").addChild(signInNode);
            }
        }
    },

    setBoxBallNum: function () {
        this.startBallNum.string = `今日开局${window.ballNum}球`;
    },

    onBtnClick(event) {
        let btnName = event.target;
        if (btnName.name === "upgradeBtn") {
            let boxNode = cc.instantiate(this.gameBox);
            this.node.addChild(boxNode);
            boxNode.getComponent("GameBox").init(null, this);
            // loadResLayer.prototype.addSystemTip("暂无广告");
        }
        else if (btnName.name === "gameStartBtn") {
            cc.director.loadScene("Tyt");
        }
        else if (btnName.name === "topBtn") {
            // loadResLayer.prototype.addSystemTip("排行榜");
            if (CC_WECHATGAME) {
                window.wx.postMessage({// 发消息给子域
                    messageType: 4,
                    MAIN_MENU_NUM: "Classic",
                });
                GameTools.getRankData(this.node);
            }
            else {
                // loadResLayer.prototype.addSystemTip("微信排行榜");
                GameTools.getRankData(this.node);
            }
        }
    }

});
