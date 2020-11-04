import {loadResLayer} from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        lbBoxBallNum: cc.Label,
        gameCtl: null,
        imgPath: "",
    },

    init(gameCtl, loginLayer) {
        if (gameCtl) {
            this.gameCtl = gameCtl;
        }
        if (loginLayer) {
            this.loginLayer = loginLayer;
        }
        this.lbBoxBallNum.string = `宝箱剩余${window.boxBallNum}球`;
        window.curTime = 0;
    },

    onBtnClick(event) {
        let self = this;
        let btnName = event.target;
        if (btnName.name === "btnClose") {
            this.node.destroy();
        } else if (btnName.name === "btnShare") {
            this.weixinShare();
        } else if (btnName.name === "btnVideo") {
            if (!CC_WECHATGAME) {
                if (window.boxBallNum >= 5) {
                    let time = Date.now();
                    if (time - window.curTime >= 1000 * 60 * 3) {
                        window.boxBallNum -= 5;
                        window.ballNum += 5;
                        self.lbBoxBallNum.string = `宝箱剩余${window.boxBallNum}球`;
                        if (self.gameCtl) {
                            if (self.gameCtl.bIsStartBall) {
                                self.gameCtl.ballNumber += 5;
                                self.gameCtl.ballManage.setBallNumber(self.gameCtl.ballNumber);
                            }
                            else {
                                self.gameCtl.gameBoxNum += 5;
                            }
                        }
                        if (self.loginLayer) {
                            self.loginLayer.setBoxBallNum();
                        }
                        window.curTime = time;
                    }
                    else {
                        // cc.log("冷却时间不足");
                    }
                }
            }
            else {
                loadResLayer.prototype.addSystemTip("暂无广告");
            }
        }
    },

    weixinShare() {
        let self = this;
        let curTitle = this.gameCtl.getRandomShare();
        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                title: curTitle,
                imageUrl: window.sharePath,
                success: function (res) {
                    loadResLayer.prototype.addSystemTip('分享成功！在3分钟内无法连续获得奖励');
                    // console.log(res);
                    if (window.boxBallNum >= 10) {
                        let time = Date.now();
                        if (time - window.curTime >= 1000 * 60 * 3) {
                            window.boxBallNum -= 10;
                            window.ballNum += 10;
                            self.lbBoxBallNum.string = `宝箱剩余${window.boxBallNum}球`;
                            if (self.gameCtl) {
                                if (self.gameCtl.bIsStartBall) {
                                    self.gameCtl.ballNumber += 10;
                                    self.gameCtl.ballManage.setBallNumber(self.gameCtl.ballNumber);
                                }
                                else {
                                    self.gameCtl.gameBoxNum += 10;
                                }
                            }
                            if (self.loginLayer) {
                                self.loginLayer.setBoxBallNum();
                            }
                            window.curTime = time;
                        }
                        else {
                            // cc.log("冷却时间不足");
                        }
                    }
                    else if (window.boxBallNum >= 10) {
                        loadResLayer.prototype.addSystemTip('加球已达到上限');
                    }
                    else {
                        loadResLayer.prototype.addSystemTip('宝箱剩余球不够');
                    }
                    if (window.shareThreeNum < 3) {
                        window.shareThreeNum++;
                    }
                },
                fail: function (res) {
                    loadResLayer.prototype.addSystemTip('游戏分享失败，无法获得+10球');
                    // console.log(res);
                }
            });
        }
        else {
            if (window.boxBallNum >= 10) {
                let time = Date.now();
                if (time - window.curTime >= 1000 * 60 * 3) {
                    window.boxBallNum -= 10;
                    window.ballNum += 10;
                    self.lbBoxBallNum.string = `宝箱剩余${window.boxBallNum}球`;
                    if (self.gameCtl) {
                        if (self.gameCtl.bIsStartBall) {
                            self.gameCtl.ballNumber += 10;
                            self.gameCtl.ballManage.setBallNumber(self.gameCtl.ballNumber);
                        }
                        else {
                            self.gameCtl.gameBoxNum += 10;
                        }
                    }
                    if (self.loginLayer) {
                        self.loginLayer.setBoxBallNum();
                    }
                    window.curTime = time;
                }
                else {
                    // cc.log("冷却时间不足");
                }
            }
            else if (window.boxBallNum >= 10) {
                loadResLayer.prototype.addSystemTip('加球已达到上限');
            }
            else {
                loadResLayer.prototype.addSystemTip('宝箱剩余球不够');
            }
        }
    }

});
