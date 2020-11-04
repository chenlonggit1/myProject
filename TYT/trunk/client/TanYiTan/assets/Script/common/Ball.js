cc.Class({
    extends: cc.Component,

    properties: {

    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.ballSplitNum = 0;
        this.bIsContact = false;        //球是否已经碰撞
    },

    //碰撞开始
    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 0://上方墙，默认不做处理
                this.bIsContact = true;
                this.gameCtl.onBallContactDefault(self.node, other.node);
                break;
            case 1://球碰到左右墙
                this.bIsContact = true;
                this.gameCtl.onBallContactWall(self.node, other.node);
                break;
            case 2://球碰到地面
                this.gameCtl.onBallContactGround(self.node, other.node);
                break;
            case 3://球碰到外层墙
                this.gameCtl.onBallContactOutWall(self.node, other.node);
                break;
            case 4://球碰到物体
                this.gameCtl.onBallContactGeometry(self.node, other.node);
                break;
            case 5://加球
                this.gameCtl.onBallContactAddBall(self.node, other.node);
                break;
            case 6://分裂
                this.gameCtl.onBallContactLargenBall(self.node, other.node);
                break;
            case 7://怪物
                this.gameCtl.onBallContactMonster(self.node, other.node);
                break;
        }
    },

    //碰撞结束
    onEndContact(contact, self, other) {
        switch (other.tag) {
            case 4://球碰到物体
                this.gameCtl.onBallContactEndGeometry(self.node, other.node);
                break;
            case 6://分裂
                this.gameCtl.onBallContactLargenEndBall(self.node, other.node);
                break;
        }
    },

});
