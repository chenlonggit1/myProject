var DataManager = require("DataManager");
var ResourceManager = require("ResourceManager")

var AudioManager = cc.Class({
    extends: cc.Component,

    properties: {},

    statics: {
        instance: null,
    },

    onLoad: function () {
        this.backgroundAudioId = -1;
        this.currentVolume = 1;
        this.isGameRunInBack = false;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            this.isGameRunInBack = true;
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            this.isGameRunInBack = false;
        }, this);

        //设置单例
        AudioManager.instance = this;


        this.audioClips = {};
    },

    initAudio: function () {
        this.loadAudioClip("bgm");
        this.loadAudioClip("plotBgm");
        this.loadAudioClip("xiaochouBgm");
    },

    //加载音频
    loadAudioClip: function (audioName, callback) {
        let self = this;
        let assetPath = this.getAudioAssetPath(audioName);
        cc.loader.load(assetPath, function (err, audioClip) {
            if (err != null) {
                console.log("loadAudio err = " + err)
                return;
            }

            if (!audioClip) {
                return;
            }

            self.audioClips[audioName] = audioClip;

            if (callback != null) {
                callback(audioClip);
            }
        });
    },

    //获取音频片段
    getAudioClip: function (audioName, callback) {
        if (this.audioClips[audioName]) {
            callback(this.audioClips[audioName]);
        } else {
            this.loadAudioClip(audioName, callback);
        }
    },

    //获取音频资源路径
    getAudioAssetPath: function (audioName) {
        return cc.url.raw("resources/audio/" + audioName + ".mp3");
    },

    //播放背景音效
    playGameBackgroundAudio: function (audioName, loop = true, volume = 0.85) {
        //先暂停所有的音效
        this.stopAllAudio();

        if (!DataManager.instance.isPlayMusic)
            return;

        this.getAudioClip(audioName, function (audioClip) {
            cc.audioEngine.play(audioClip, loop, volume);
        });
    },

    stopAllAudio: function () {
        //停止音乐   
        cc.audioEngine.stopAll();
    },

    //播放其它音效
    playotherAudio: function (audioName, loop = false, volume = 0.85) {
        if (this.isGameRunInBack)
            return;

        if (!DataManager.instance.isPlayMusic)
            return;

        let self = this;
        this.getAudioClip(audioName, function (audioClip) {
            self.playAudio(audioClip, loop, volume);
        });
    },

    //播放音效
    playAudio: function (audio, loop, volume) {
        //播放音效
        cc.audioEngine.play(audio, loop, volume);
    },

    //静音背景音效的音量
    muteBackgroundAudio: function () {
        cc.audioEngine.setVolume(this.backgroundAudioId, 0);
    },

    //恢复背景音效的音量
    resumeBackgroundAudio: function (volume = 0.85) {
        this.setBackgroundAudioVolume(this.currentVolume);
    },

    //设置背景音效的音量
    setBackgroundAudioVolume: function (volume) {
        cc.audioEngine.setVolume(this.backgroundAudioId, volume);
    },
});