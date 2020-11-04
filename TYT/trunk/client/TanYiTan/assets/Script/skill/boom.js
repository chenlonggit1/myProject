cc.Class({
    extends: cc.Component,

    properties: {
        curIndex: 0,
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
    },

    //碰撞开始
    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到左右墙
            case 2://球碰到地面
            case 3://球碰到外层墙
                if (this.curIndex == 0) { this.gameCtl.onBoomContactWall(self.node, other.node); }
                else if (this.curIndex == 2) { this.gameCtl.onLaserContactWall(self.node, other.node); }
                break;
            case 4://碰到物体
            case 5://加球
            case 6://加大
                if (this.curIndex == 0) { this.gameCtl.onBoomContactWall(self.node, other.node); }
                else if (this.curIndex == 1) { this.gameCtl.onBoomCopyContactGeometry(self.node, other.node); }
                else if (this.curIndex == 2) { this.gameCtl.onLaserContactGeometry(self.node, other.node); }
                break;
        }
    },

    onEndContact(contact, self, other) {
        switch (other.tag) {
            case 4://碰到物体
            case 5://加球
            case 6://加大
                if (this.curIndex == 2) { this.gameCtl.onLaserContactEndGeometry(self.node, other.node); }
                break;
        }
    },
});
