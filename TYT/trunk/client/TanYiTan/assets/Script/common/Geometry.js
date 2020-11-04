import { loadResLayer, ImageRes } from 'LoadResLayer';
cc.Class({
    extends: cc.Component,

    properties: {
        geometryLayout: cc.Prefab,      //几何图形Layout
        geometryArr: [cc.Prefab],       //0方块、1圆形、2三角形、3加球、4加大
    },

    onLoad() {
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.initPool();
        this.createGeometryLayout();
    },

    //初始化对象池
    initPool() {
        //几何父节点对象池
        this.enemyPool = new cc.NodePool();
        let initCount = 10;
        for (let i = 0; i < initCount; ++i) {
            let enemy = cc.instantiate(this.geometryLayout);
            this.enemyPool.put(enemy);
        }
        //几何体对象池
        this.geometryPool = [];
        for (let i = 0; i < 5; i++) {
            this.geometryPool[i] = new cc.NodePool();
            let geometryCount = 20;
            for (let j = 0; j < geometryCount; ++j) {
                let geometry = cc.instantiate(this.geometryArr[i]);
                this.geometryPool[i].put(geometry);
            }
        }
    },

    //创建新的几何父节点
    createGeometryLayout: function () {
        let enemy = null;
        if (this.enemyPool.size() <= 0) { cc.log("实例化物体父节点"); }
        enemy = this.enemyPool.size() > 0 ? this.enemyPool.get() : cc.instantiate(this.geometryLayout);
        if (window.bIsIPhoneX) {
            enemy.y += 100;
        }
        enemy.parent = this.node;
        this.createGeometry(enemy);
    },

    //回收几何父节点
    onGeometryLayoutKill: function (enemy) {
        enemy.setPosition(0, 40);
        this.enemyPool.put(enemy);
    },

    //创建几何体
    createGeometry(geometryParent) {
        let randomNumber = Math.ceil(Math.random() * 3) + 2;
        this.xPos = [];
        this.maxScore = [];
        let tempArr = ["addBall", "largenBall"]; //仅能存在一个的数
        let indexGeometry = []; //目标数据

        let enemy = null;
        do {
            enemy = this.randomGeometry();
            let num = enemy.name;
            if (-1 == tempArr.indexOf(num) || (-1 != tempArr.indexOf(num) && -1 == indexGeometry.indexOf(num))) {
                indexGeometry.push(num);
                this.setGeometry(enemy, geometryParent);
            }
        }
        while (indexGeometry.length < randomNumber)

        if (this.maxScore.length > 0) {
            if (this.maxScore.length > 1) {
                function sortId(a, b) {
                    return b.meanScore - a.meanScore;
                }
                this.maxScore.sort(sortId);
            }
            this.maxScore[0].curGeometry.setScale(1.4);
        }
    },


    //随机几何体
    randomGeometry() {
        //普通物体0.9概率，特殊0.1概率
        let tempRandom = Math.random();
        tempRandom = tempRandom < this.gameCtl.userInfo.propProbability ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 3);
        let enemy = null;
        if (this.geometryPool[tempRandom].size() <= 0) { cc.log("实例化物体" + tempRandom); }
        enemy = this.geometryPool[tempRandom].size() > 0 ? this.geometryPool[tempRandom].get() : cc.instantiate(this.geometryArr[tempRandom]);
        return enemy;
    },

    //设置几何体颜色、坐标、分值
    setGeometry(enemy, geometryParent) {
        //随机坐标
        let randomX = 0;
        do {
            randomX = Math.floor(Math.random() * 5) - 2;
        }
        while (this.xPos.indexOf(randomX) != -1)
        this.xPos.push(randomX);
        let randomY = window.bIsIPhoneX ? Math.floor(Math.random() * 16) - 8 : Math.floor(Math.random() * 6) - 3;
        let offsetX = Math.floor(Math.random() * 16) - 8;
        enemy.setPosition(randomX * 95 + offsetX, randomY);
        enemy.setScale(1.1);

        if (enemy.name === "block" || enemy.name === "circle" || enemy.name === "triangle") {
            //随机颜色
            let randomColor = Math.ceil(Math.random() * 6);
            let sprFrame = ImageRes.geometryAtlas[`${enemy.name}_${randomColor}`];
            enemy.getChildByName("geometryNode").getComponent(cc.Sprite).spriteFrame = sprFrame;

            let curRotation = Math.floor(Math.random() * 60) + 10;
            enemy.setRotation(curRotation);
            enemy.getChildByName("geometryNode").getChildByName("geometryLb").setRotation(-curRotation);
        }
        geometryParent.addChild(enemy);
        if (enemy.name === "block" || enemy.name === "circle" || enemy.name === "triangle") {
            //随机分数
            let section = Math.random();
            let tempVal = 0;
            let chazhi = this.gameCtl.userInfo.maxScore - this.gameCtl.userInfo.minScore;
            if (section < 0.3) {
                tempVal = Math.ceil((Math.random() * parseInt(chazhi * 0.2)));
            } else if (section < 0.7) {
                tempVal = parseInt(chazhi * 0.2) + Math.ceil((Math.random() * parseInt(chazhi * 0.6)));
            } else {
                tempVal = parseInt(chazhi * 0.8) + Math.ceil((Math.random() * parseInt(chazhi * 0.2)));
            }
            let randomScore = tempVal + this.gameCtl.userInfo.minScore;
            enemy.getComponent("GeometryItem").setGeometryNum(randomScore);

            let curClickNum = enemy.getComponent("GeometryItem").clickNum;
            if (curClickNum > this.gameCtl.userInfo.meanScore * 1.4) {
                let obj = {};
                obj.meanScore = curClickNum;
                obj.curGeometry = enemy;
                this.maxScore.push(obj);
            }
        }
    },

    //回收几何体
    onGeometryKill: function (enemy) {
        enemy.setScale(1);
        if (enemy.name === "block") {
            this.geometryPool[0].put(enemy);
        } else if (enemy.name === "circle") {
            this.geometryPool[1].put(enemy);
        } else if (enemy.name === "triangle") {
            this.geometryPool[2].put(enemy);
        } else if (enemy.name === "addBall") {
            this.geometryPool[3].put(enemy);
        } else if (enemy.name === "largenBall") {
            this.geometryPool[4].put(enemy);
        }

    },

    //几何父节点位置上移
    initGeometry() {
        for (let i = 0; i < this.node.childrenCount; i++) {
            this.node._children[i].y = window.bIsIPhoneX ? this.node._children[i].y + 100 : this.node._children[i].y + 90;
            for (let j = 0; j < this.node._children[i].childrenCount; j++) {
                let tempNode = this.node._children[i]._children[j];
                tempNode.getChildByName("geometryNode").y += 0.0001;
            }
        }
        this.createGeometryLayout();
    },

    //游戏是否结束
    getGameIsEnd() {
        let result = false;
        let childrenNode = this.node._children[0];
        let nodeY = childrenNode.y;
        let tempEndY = window.bIsIPhoneX ? 15 : 0;
        if (nodeY >= 760 + tempEndY * 8) {
            let addBallNum = 0;
            let largenNum = 0;
            let geometryNum = 0;
            for (let i = 0; i < childrenNode.childrenCount; i++) {
                let tempNode = childrenNode._children[i];
                if (tempNode.name == "addBall") {
                    addBallNum++;
                }
                else if (tempNode.name == "largenBall") {
                    largenNum++;
                }
                else {
                    geometryNum++;
                }
            }
            if (geometryNum > 0) {
                result = true;
            }
            else {
                //回收分裂球
                this.gameCtl.ballNumber += addBallNum;
                this.gameCtl.ballManage.setBallNumber(this.gameCtl.ballNumber);
                let curGeometry = childrenNode;
                while (curGeometry.childrenCount > 0) {
                    this.onGeometryKill(curGeometry._children[0]);
                }
                this.onGeometryLayoutKill(curGeometry);
            }
        }
        return result;
    },

    //复活(暂时为消三行)
    revive() {
        let self = this;
        self.serveSpeed = 300;
        let interval = setInterval(fun, self.serveSpeed);
        let removeNum = this.node.childrenCount >= 3 ? 3 : this.node.childrenCount;
        this.gameCtl.bIsStartBall = false;
        function fun() {
            if (removeNum > 0) {
                let curGeometry = self.node._children[0];
                if (curGeometry.childrenCount > 0) {
                    var seq = cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 0.6), cc.callFunc(function () {
                        self.onGeometryKill(curGeometry._children[0]);
                    }));
                    curGeometry._children[0].runAction(seq);
                }
                else {
                    removeNum--;
                    self.onGeometryLayoutKill(curGeometry);
                }
            }
            else {
                clearInterval(interval);
                self.gameCtl.initNewGame();
            }
        }
    },

    //清理所有物体，不播放动画
    clearGeometry() {
        while (this.node.childrenCount > 0) {
            let curGeometry = this.node._children[0];
            while (curGeometry.childrenCount > 0) {
                this.onGeometryKill(curGeometry._children[0]);
            }
            this.onGeometryLayoutKill(curGeometry);
        }
    }
});

