var net = require("net");
var GameConfig = require('GameConfig');
var EventManager = require("EventManager")
var WindowManager = require("WindowManager")

cc.Class({
    extends: cc.Component,

    properties: {
        vedioPrefab: {
            default: null,
            type: cc.Prefab,
        }
    },

    onLoad: function () {
        this.node.getChildByName("MaskLayer").on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        }, this.node);
        this.node.getChildByName("Background").on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        }, this.node);

        this.loadingTips = this.node.getChildByName("LoadingTips");
        this.playVideoBtn = this.node.getChildByName("Player").getChildByName("PlayerVedioBtn");
    },

    start() {
        this.isVedioComplete = false;
    },

    initData: function (name, data) {
        this.name = name;
    },

    //开始播放
    playVideo: function () {
        var video = document.getElementsByClassName("cocosVideo") || [];
        if (video.length > 0) {
            for (var i = 0; i < video.length; i++) {
                video[i].parentNode.removeChild(video[i]);
            }
        }

        var btn = document.getElementById("videoClostButton");
        if (btn) {
            btn.parentNode.removeChild(btn);
        }

        if (this.isVedioPlaying || DataManager.instance.adVertisementUrl == "") {    
            return;
        }

        this.isVedioPlaying = true;
        this.loadingTips.active = true;
        this.playVideoBtn.active = false;
        var videoPlay = cc.instantiate(this.vedioPrefab);
        this.node.addChild(videoPlay);
        videoPlay.getComponent(cc.VideoPlayer).remoteURL = DataManager.instance.adVertisementUrl;
        videoPlay.getComponent(cc.VideoPlayer).play();

        //全屏处理 
        video = document.getElementsByClassName("cocosVideo");
        if (video && video.length > 0) {
            video[0].muted = true;
            video[0].setAttribute('x5-video-player-type', 'h5');
        }

        //播放结束处理
        videoPlay.on("completed", function (event) {
            videoPlay.getComponent(cc.VideoPlayer).play();
            this.scheduleOnce(function () {
                videoPlay.getComponent(cc.VideoPlayer).pause();
            }, 0.5);
            var countDown = document.getElementById("countDownDiv");
            if (countDown)
                countDown.parentNode.removeChild(countDown);
            this.isVedioComplete = true;
            var resetGetAward = function () {
                var btn = document.getElementById("videoClostButton");
                if (!btn) {
                    this.unschedule(resetGetAward)
                    this.onPlayVedioBtnClicked();
                }
            };
            this.schedule(resetGetAward, 0.5);
        }.bind(this));

        videoPlay.on("clicked", function (event) {
            if (DataManager.instance.adJumplink != "") {
                window.open(DataManager.instance.adJumplink);
            }
        }.bind(this));

        videoPlay.on("ready-to-play", function (event) {
            this.creatCloseVideo();
            this.videoCountDown(videoPlay);
            this.loadingTips.active = false;
            this.playVideoBtn.active = true;
        }.bind(this));

        this.isVedioPlaying = false;

        EventManager.Dispatch("StartPlayVedio");
    },

    //创建一个div放播放倒计时
    videoCountDown: function (videoPlay) { 
        var closeBtn = document.getElementById("videoClostButton");
        var totalTime = Math.ceil(videoPlay.getComponent(cc.VideoPlayer).getDuration());
        //默认15s
        if (totalTime == 0) {
            totalTime = 15;
        }

        if (totalTime > 0) {
            var closeBtnFuc = function () {
                var btn = document.getElementById("videoClostButton");
                if (btn) {
                    btn.parentNode.removeChild(btn);
                }
            }

            var countDownDiv = document.createElement("div");
            countDownDiv.setAttribute("id", "countDownDiv");
            countDownDiv.innerHTML = "<span class='countDownSpan'>" + totalTime + "秒</span>";
            closeBtn.appendChild(countDownDiv);

            function updateCountDown() {
                var video = document.getElementsByClassName("cocosVideo");
                if (video.length == 0) {
                    closeBtnFuc();
                    this.unschedule(updateCountDown);
                    return;
                }

                var total = videoPlay.getComponent(cc.VideoPlayer).getDuration();
                if (total == 0) {
                    total = 15;
                }

                var time = Math.ceil(total - videoPlay.getComponent(cc.VideoPlayer).currentTime);
                if (time <= 1) {
                    this.unschedule(updateCountDown); 
                }

                countDownDiv.innerHTML = "<span class='countDownSpan'>" + time + "秒</span>";
            }

            this.schedule(updateCountDown, 1);
        }
    },

    //退出视频 
    creatCloseVideo: function () {
        var closeBtn = document.createElement("div");
        closeBtn.setAttribute("id", "videoClostButton");
        document.getElementById("Cocos2dGameContainer").appendChild(closeBtn);

        //创建底层div
        var rightDiv = document.createElement("div");
        rightDiv.setAttribute("id", "rightDiv");
        closeBtn.appendChild(rightDiv);

        //创建音效按钮 
        var audioBtn = document.createElement("img");
        audioBtn.setAttribute("id", "audioImg");
        audioBtn.setAttribute("src", GameConfig.hostUrl + "config/audioBtnd.png");

        var isAudioFunc = function () {
            var video = document.getElementsByClassName("cocosVideo");
            var aBtn = document.getElementById("audioImg");
            if (video && video.length > 0) {
                video[0].muted = !video[0].muted;
                if (video[0].muted) {
                    aBtn.src = GameConfig.hostUrl + "config/audioBtnd.png";
                } else {
                    aBtn.src = GameConfig.hostUrl + "config/audioBtn.png";
                }
            }
        }
        audioBtn.setAttribute("onclick", "videoClostClick(" + isAudioFunc + ")");
        rightDiv.appendChild(audioBtn);

        //创建关闭按钮
        var button = document.createElement("div");
        button.setAttribute("id", "closeButton");
        button.innerHTML = "<span class='countDownSpan' style='margin-top:0px'>关闭广告</span>";

        var callback = function () {
            var video = document.getElementsByClassName("cocosVideo");
            for (var i = 0; i < video.length; i++) {
                video[i].parentNode.removeChild(video[i]);
            }
            var btn = document.getElementById("videoClostButton");
            btn.parentNode.removeChild(btn);
        }

        button.setAttribute("onclick", "videoClostClick(" + callback + ")");
        rightDiv.appendChild(button);
    },

    //播放按钮事件
    onPlayVedioBtnClicked: function () {
        if (this.isVedioComplete) {
            this.closeView();
            net.CS_DrawAidMoney();
        } else {
            this.playVideo();
        }
    },

    //关闭界面
    closeView: function () {
        this.node.getChildByName("MaskLayer").off(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        }, this.node);
        this.node.getChildByName("Background").off(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation()
        }, this.node);

        WindowManager.instance.closeWindow(this.name);
        this.node.destroy();
    }
});