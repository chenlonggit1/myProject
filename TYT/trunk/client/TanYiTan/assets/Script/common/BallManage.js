cc.Class({
    extends: cc.Component,

    properties: {
        ballNumberLb: cc.Label,  //球数量
        ballScoreLb: cc.Label,   //球分数
        addBallLb: cc.Label,     //加球
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.ballNumberLb.string = `${this.gameCtl.ballNumber}`;
        this.ballScoreLb.string = `${this.gameCtl.ballScore}`;
        this.addBallLb.node.active = this.gameCtl.addBallNum > 0;
        if (this.gameCtl.addBallNum > 0) {
            this.addBallLb.string = ` +${this.gameCtl.addBallNum}`;
        }
    },

    //更新球数量
    setBallNumber(curBallNum) {
        this.ballNumberLb.string = `${curBallNum}`;
    },
    //更新分数
    setBallScore(curBallScore) {
        this.ballScoreLb.string = `${curBallScore}`;
    },
    //更新分数
    setAddBallScore(curAddBallScore) {
        this.addBallLb.node.active = curAddBallScore > 0;
        if (curAddBallScore > 0) { this.addBallLb.string = ` +${curAddBallScore}`; }
    },
});

