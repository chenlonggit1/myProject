import { loadResLayer } from 'LoadResLayer';
import { GameTools } from 'GameTools';
import { UserManager } from 'userManager';
import { config } from 'Config';

const shareTitle = ['超好玩的弹一弹消除游戏，只为带你回忆童趣时光。',
    '来回磕磕碰碰、层层跌跌撞撞，碰撞中隐藏着无限可能。',
    '以一当百！小小弹球也有远大梦想，碰撞出属于你的未来。',
    '由小变大、从慢到快、聚少成多，弹珠给你最励志的剧本。',];

cc.Class({
    extends: cc.Component,

    properties: {
        ballManage: require('BallManage'),      //弹球管理
        geometry: require('Geometry'),          //几何体
        gameSkill: require('Skill'),            //技能
        ballPrefab: cc.Prefab,                  //球
        skillPrefab: [cc.Prefab],               //技能 激光、炸弹、炸弹爆炸
        gameNextLevel: cc.Prefab,               //下一关
        gameEndPrb: cc.Prefab,                  //结束
        gameMenuPrb: cc.Prefab,                 //菜单
        selectLevel: cc.Prefab,                 //选关
        gameBox: cc.Prefab,                     //盒子
        gameAD: cc.Prefab,                      //广告
        gameGold: cc.Prefab,                    //金币
        gameProperty: cc.Prefab,                //人物属性
        gamePiaofen: cc.Prefab,                 //飘分
        gameTest: cc.Prefab,                    //测试
        monster: cc.Node,                       //怪物
        gameContent: cc.Node,                   //游戏内容
        ballParent: cc.Node,                    //球父节点
        effectNode: cc.Node,                    //动画节点
        effectPrb: [cc.Prefab],                 //动画预制 激光、炸弹、炸弹爆炸
        ballLink: cc.Node,                      //指引线
        ranking: cc.Sprite,                     //子域排行
        lbGuanqia: cc.Label,                    //关卡
        lbTargetGold: cc.Label,                 //关卡目标
        nodeRole: cc.Node,                      //角色属性
    },

    onLoad: function () {
        //适配
        let rate = cc.view.getVisibleSize().width / cc.view.getVisibleSize().height;
        let canvas = this.node.getComponent(cc.Canvas);
        let isMoreWidth = rate > (1136 / 640);
        canvas.fitWidth = !isMoreWidth;
        canvas.fitHeight = isMoreWidth;
        //iPhoneX适配
        if (window.bIsIPhoneX) {
            let tempNode = this.gameContent.getChildByName("Wall");
            let topNode = this.gameContent.getChildByName("topWall");
            tempNode.runAction(cc.moveTo(0.01, cc.v2(tempNode.x, tempNode.y + 40)));
            topNode.runAction(cc.moveTo(0.01, cc.v2(topNode.x, topNode.y + 1)));
            let feidie = this.node.getChildByName("background").getChildByName("feidie");
            feidie.runAction(cc.moveTo(0.01, cc.v2(feidie.x, feidie.y - 25)));
        }

        //物理系统默认是关闭的，先打开物理系统
        cc.director.getPhysicsManager().enabled = true;
        //球对象池
        this.enemyPool = new cc.NodePool();
        for (let i = 0; i < 200; ++i) {
            let enemy = cc.instantiate(this.ballPrefab);
            this.enemyPool.put(enemy);
        }
        //金币对象池
        this.goldPool = new cc.NodePool();
        for (let i = 0; i < 60; i++) {
            let gold = cc.instantiate(this.gameGold);
            this.goldPool.put(gold);
        }
        this.init();
        canvas.alignWithScreen();
    },

    //初始化数据
    init() {
        this.userInfo = UserManager;       //用户信息
        this.readData();
        this.ballNumber = window.ballNum;       //球数量
        this.rollbackNum = 0;                   //回滚数量
        this.ballScore = this.userInfo.ballScore;//游戏分数
        this.goldNum = this.userInfo.goldNum;   //金币数量
        this.curGoldNum = 0;                    //本轮金币数量
        this.splitBallNum = 0;                  //分裂球数量
        this.addBallNum = 0;                    //加球
        this.tempAddBall = 0;                   //本次加球
        this.bIsStartBall = true;               //是否可以开始发球
        this.serveSpeed = 100;                  //发球速度
        this.doubleNum = 0;                     //双倍球球数量
        this.splitProbBallNum = 0;              //击中普通几何触发分裂球个数
        this.getGoldProbability = 0.4;          //销毁物体触发获取金币概率
        this.gameBoxNum = 0;                    //游戏过程中盒子球个数
        this.topsNum = this.userInfo.tops;      //游戏过程中上装属性额外添加球
        this.nextTopsNum = 0;                   //上次升级的球数
        this.bIsRefresh = false;                //子域是否刷新
        this.bIsHitBoss = false;                //是否正在打boss
        this.bIsGuanqia = false;                //是否通过关卡
        this.tempLevelNum = 0;                  //当前关卡
        this.bIsHundred = false;                //最后一关
        this.isTestOpen = false;                 //是否打开测试

        this.bCurSkill = new Array();           //这轮是否有技能 双倍球球、激光、炸弹
        this.bNextSkill = new Array();          //下轮是否有技能 双倍球球、激光、炸弹
        for (let i = 0; i < 3; i++) {
            this.bCurSkill[i] = false;
            this.bNextSkill[i] = false;
        }
        //初始化鼠标事件
        this.gameContent.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.touchStart(event);
        }.bind(this), this);

        this.gameContent.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.touchMove(event);
        }.bind(this), this);

        this.gameContent.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.touchEnd(event);
        }.bind(this), this);
        this.geometry.clearGeometry();
        this.setTopsBallNum();

        //初始化其他Js
        this.ballManage.init(this);
        this.ballManage.setBallNumber(this.ballNumber);
        this.geometry.init(this);
        this.gameSkill.init(this);
        this.gameSkill.onBtnClick = this.skillClick.bind(this);

        this.lbGuanqia.string = this.userInfo.guanqiaNum;
        this.lbTargetGold.string = this.userInfo.score + "分";

        for (let i = 0; i < 3; ++i) {
            if (this.userInfo.skillNum[i] === 0) {
                this.setSkillBtnState(i);
            }
        }

        if (this.isTestOpen) {
            let testNode = cc.instantiate(this.gameTest);
            this.node.addChild(testNode);
            testNode.getComponent("Test").init(this);
        }

        if (CC_WECHATGAME) {
            // this.ranking.enabled = true;
            // this.tex = new cc.Texture2D();
            // window.sharedCanvas.width = 720;
            // window.sharedCanvas.height = 1280;
            // GameTools.updateScore(this.ballScore, true);

            wx.onHide((res) => {
                this.saveData();
            });
        }
    },

    //读取数据
    readData() {
        let readData = config.getSetting();
        if (readData != "" && readData != null && readData != undefined) {
            if (!readData.highguanqiaNum) {
                readData.highguanqiaNum = 1;
            }
            this.userInfo.highguanqiaNum = readData.highguanqiaNum;
            this.userInfo.guanqiaNum = readData.highguanqiaNum;
            if (!readData.highguanqiaNum) {
                this.userInfo.grade = [1, 1, 1, 1, 1, 1];
                this.userInfo.goldNum = 100;
                this.userInfo.skillNum = [2, 2, 2];
            } else {
                this.userInfo.grade = readData.grade;
                this.userInfo.goldNum = readData.goldNum;
                this.userInfo.skillNum = readData.skillNum;
            }
            if (readData.bHundredBoss) {
                this.bHundredBoss = readData.bHundredBoss;
            } else {
                this.bHundredBoss = false;
            }
            if (this.userInfo.guanqiaNum > 1) {
                this.userInfo.setUserInfo();
                this.userInfo.ballScore = this.userInfo.getFrontIntNum();
            }
            for (let i = 0; i < 6; i++) {
                this.userInfo.initEquipGrade(i, this.userInfo.grade[i]);
            }
        }
        this.userInfo.goldNum += window.awardGoldNum;
        for (let i = 0; i < 3; ++i) {
            this.userInfo.skillNum[i] += window.awardSkillNum[i];
        }
        // cc.log(this.userInfo.skillNum);
    },

    //保存数据
    saveData() {
        let obj = {};
        obj.goldNum = this.goldNum;
        obj.grade = this.userInfo.grade;
        obj.highguanqiaNum = this.userInfo.highguanqiaNum;
        obj.skillNum = this.gameSkill.skillNum;
        if (this.bHundredBoss) {
            obj.bHundredBoss = this.bHundredBoss;
        }
        config.saveSetting(obj);

        GameTools.submitScore(this.ballScore); //提交得分
        // GameTools.updateScore(this.ballScore, true);
    },

    //清除缓存 测试
    clearData() {
        this.userInfo.goldNum = 100;
        this.userInfo.grade = [1, 1, 1, 1, 1, 1];
        this.userInfo.guanqiaNum = 1;
        this.userInfo.highguanqiaNum = 1;
        this.userInfo.ballScore = 0;
        this.userInfo.setUserInfo();
        for (let i = 0; i < 6; i++) {
            this.userInfo.setDetailVal(i);
        }
        this.userInfo.skillNum = [2, 2, 2];
        let obj = null;
        config.saveSetting(obj);

        config.saveSignIn(obj);
    },

    // //刷新子域的纹理
    // _updateSubDomainCanvas() {
    //     if (window.sharedCanvas != undefined && this.tex) {
    //         this.tex.initWithElement(window.sharedCanvas);
    //         this.tex.handleLoadedTexture();
    //         this.ranking.spriteFrame = new cc.SpriteFrame(this.tex);
    //     }
    // },

    // //刷新子域排行榜
    // update() {
    //     if (CC_WECHATGAME) {
    //         let self = this;
    //         if (!self.bIsRefresh) {
    //             let interval = setInterval(fun, 500);
    //             self.bIsRefresh = true;
    //             function fun() {
    //                 self._updateSubDomainCanvas();
    //                 self.bIsRefresh = false;
    //                 clearInterval(interval);
    //             }
    //         }
    //     }
    // },

    //初始化一个球
    initOneBall(velocity, nodeColor, ballPos, curGravityScale, nodeScale) {
        let tempBall = null;
        if (this.enemyPool.size() <= 0) { cc.log("实例化球"); }
        tempBall = this.enemyPool.size() > 0 ? this.enemyPool.get() : cc.instantiate(this.ballPrefab);
        tempBall.position = ballPos != undefined ? cc.v2(ballPos.x, ballPos.y) : cc.v2(0, -16);
        tempBall.color = nodeColor;
        tempBall.getComponent(cc.RigidBody).gravityScale = curGravityScale != undefined ? curGravityScale : 1;
        tempBall.scale = nodeScale != undefined ? nodeScale : this.userInfo.bottoms / 10;

        tempBall.getComponent(cc.RigidBody).linearVelocity = velocity;
        tempBall.parent = this.ballParent;
        tempBall.getComponent("Ball").init(this);
    },

    //初始化技能
    initSkill(skillIndex, velocity, curPosition) {
        let skillPab = cc.instantiate(this.skillPrefab[skillIndex]);
        this.ballParent.addChild(skillPab);
        if (velocity) { skillPab.getComponent(cc.RigidBody).linearVelocity = velocity; }
        if (curPosition) { skillPab.setPosition(curPosition); }
        skillPab.getComponent("boom").init(this);
    },

    //回收球
    onBallKill: function (enemy) {
        this.enemyPool.put(enemy);
    },

    //初始化金币
    initGold: function (tempPosX, tempPosY, bIsPiaofen, getGoldNum) {
        let tempGold = null;
        if (this.goldPool.size() <= 0) { cc.log("实例化金币"); }
        tempGold = this.goldPool.size() > 0 ? this.goldPool.get() : cc.instantiate(this.gameGold);
        this.effectNode.addChild(tempGold);
        let offsetx = Math.ceil(Math.random() * 50) - 25;
        tempGold.setPosition(tempPosX + offsetx, tempPosY);

        let targetNode = this.nodeRole.convertToWorldSpaceAR(cc.v2(0, 0));
        let goldPrbNode = tempGold.convertToWorldSpaceAR(cc.v2(0, 0));

        let curPosX = targetNode.x - goldPrbNode.x;
        let curPosY = targetNode.y - goldPrbNode.y;

        tempGold.runAction(cc.sequence(cc.delayTime(0.3), cc.moveTo(1, cc.v2(tempGold.x + curPosX, tempGold.y + curPosY)), cc.delayTime(0.3), cc.callFunc(function () {
            this.onGoldKill(tempGold);

            if (bIsPiaofen) {
                let curPiaofen = cc.instantiate(this.gamePiaofen);
                this.nodeRole.addChild(curPiaofen);
                curPiaofen.getComponent(cc.Label).string = "+" + getGoldNum;
                curPiaofen.runAction(cc.sequence(
                    cc.moveTo(0.5, cc.v2(curPiaofen.x, 130)),
                    cc.fadeOut(0.3),
                    cc.callFunc(() => curPiaofen.destroy())));
            }
        }.bind(this))));
    },

    //回收金币
    onGoldKill: function (gold) {
        this.goldPool.put(gold);
    },

    //复活(暂时为消三行)
    revive() {
        this.geometry.revive();
    },

    //默认
    onBallContactDefault(ballNode, brickNode) {
        if (ballNode.getComponent("Ball").bIsContact) {
            ballNode.getComponent(cc.RigidBody).gravityScale = 8;
        }
    },

    //球碰触到左右墙
    onBallContactWall(ballNode, brickNode) {
        if (ballNode.getComponent("Ball").bIsContact) {
            ballNode.getComponent(cc.RigidBody).gravityScale = 8;
        }
    },

    //球碰触到地面
    onBallContactGround(ballNode, groundNode) {
        ballNode.getComponent(cc.RigidBody).gravityScale = 800;
        let ballPosX = ballNode.x >= 0 ? 292 : -292;
        ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(ballPosX, -850);
    },

    //球碰触到外层墙
    onBallContactOutWall(ballNode, groundNode) {
        if (ballNode.getComponent(cc.PhysicsCircleCollider).sensor == false) {
            ballNode.getComponent(cc.PhysicsCircleCollider).sensor = true;
            ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            ballNode.getComponent(cc.RigidBody).gravityScale = 0;
            let finished = cc.callFunc(function () {
                ballNode.getComponent(cc.PhysicsCircleCollider).sensor = false;
                ballNode.color = cc.Color.WHITE;
                this.onBallKill(ballNode);
                this.rollbackNum++;
                if (this.ballNumber + this.splitBallNum + this.addBallNum + this.doubleNum + this.splitProbBallNum == this.rollbackNum) {
                    this.gameEnd();
                }
            }.bind(this));
            ballNode.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(ballNode.x, 600)), finished));
        }
    },

    //球碰触到几何体
    onBallContactGeometry(ballNode, groundNode) {
        this.ballScore += Math.random() < this.userInfo.belt / 100 ? 4 : 2;
        this.ballManage.setBallScore(this.ballScore);
        if (this.ballScore >= this.userInfo.score) {
            this.bIsGuanqia = true;
        }
        // if (CC_WECHATGAME) {
        //     GameTools.updateScore(this.ballScore, true);
        // }
        let geometryNode = groundNode.parent;
        let jsGeometryItem = geometryNode.getComponent("GeometryItem");
        jsGeometryItem.clickNum--;
        if (jsGeometryItem.clickNum >= 0) {
            jsGeometryItem.setGeometryNum(jsGeometryItem.clickNum);
        }
        ballNode.getComponent(cc.RigidBody).gravityScale = 8;
        let geometryLayout = geometryNode.parent;
        if (jsGeometryItem.clickNum == 0) {
            let tempGoldProb = Math.random();
            if (tempGoldProb < this.getGoldProbability) {

                let curPos = groundNode.convertToWorldSpaceAR(cc.v2(0, 0));
                let curPos1 = this.effectNode.convertToWorldSpaceAR(cc.v2(0, 0));
                let tempPosX = curPos.x - curPos1.x;
                let tempPosY = curPos.y - curPos1.y;

                let randomNum = Math.ceil(Math.random() * 20) + 90;
                let curGold = Math.round(this.userInfo.dropGold * randomNum / 100);
                this.curGoldNum += curGold;
                this.goldNum += curGold;
                let getGoldNum = Math.ceil(Math.random() * 10);

                for (let i = 0; i < getGoldNum; i++) {
                    this.initGold(tempPosX, tempPosY, i == getGoldNum - 1, curGold);
                }
            }
            this.geometry.onGeometryKill(geometryNode);
            if (geometryLayout && geometryLayout.childrenCount == 0) {
                this.geometry.onGeometryLayoutKill(geometryLayout);
            }
        }
        else {
            //几何体震动
            let tempPosX = groundNode.x;
            groundNode.stopAllActions();
            groundNode.runAction(cc.sequence(cc.moveTo(0.05, cc.v2(tempPosX, -3)), cc.moveTo(0.05, cc.v2(tempPosX, 0))));
        }
    },

    //球碰触到几何体
    onBallContactEndGeometry(ballNode, groundNode) {
        let curLinearVelocity = ballNode.getComponent(cc.RigidBody).linearVelocity;
        ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(curLinearVelocity.x + 25, curLinearVelocity.y);
        curLinearVelocity = ballNode.getComponent(cc.RigidBody).linearVelocity;
        let curTempPosX = curLinearVelocity.x - ballNode.x;
        let curTempPosY = curLinearVelocity.y - ballNode.y;

        let xx = Math.abs(curTempPosX);
        let yy = Math.abs(curTempPosY);
        let zz = Math.sqrt(xx * xx + yy * yy);

        if (zz < 800) {
            ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(curLinearVelocity.x * 2, curLinearVelocity.y * 2);
            ballNode.getComponent(cc.RigidBody).gravityScale = 5;
        }
        else if (zz > 1800) {
            ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(curLinearVelocity.x * 0.8, curLinearVelocity.y * 0.8);
        }
        if (!cc.Color.YELLOW.equals(ballNode.color) && ballNode.getComponent("Ball").ballSplitNum < 3) {
            let tempSplitNum = Math.random();
            if (tempSplitNum < this.userInfo.weapon / 100) {
                //有概率分裂
                this.splitProbBallNum++;
                ballNode.getComponent("Ball").ballSplitNum++;

                let addBallVelocity = ballNode.getComponent(cc.RigidBody).linearVelocity;
                addBallVelocity.x = -addBallVelocity.x;
                let ballColor = cc.Color.YELLOW;

                this.initOneBall(addBallVelocity, ballColor, cc.v2(ballNode.x, ballNode.y), ballNode.getComponent(cc.RigidBody).gravityScale);
            }
        }
    },

    //加球
    onBallContactAddBall(ballNode, groundNode) {
        this.tempAddBall++;
        ballNode.getComponent(cc.RigidBody).gravityScale = 8;
        let geometryNode = groundNode._parent;
        let geometryLayout = geometryNode.parent;
        this.geometry.onGeometryKill(geometryNode);
        if (geometryLayout && geometryLayout.childrenCount == 0) {
            this.geometry.onGeometryLayoutKill(geometryLayout);
        }
    },

    //分裂
    onBallContactLargenBall(ballNode, groundNode) {
        this.splitBallNum++;
        ballNode.getComponent(cc.RigidBody).gravityScale = 8;
        let geometryNode = groundNode._parent;
        let geometryLayout = geometryNode.parent;
        this.geometry.onGeometryKill(geometryNode);
        if (geometryLayout && geometryLayout.childrenCount == 0) {
            this.geometry.onGeometryLayoutKill(geometryLayout);
        }
    },

    //分裂
    onBallContactLargenEndBall(ballNode, groundNode) {
        //获取球的线性速度和世界坐标，实例化一个球，回收时需要加上这个球
        let addBallVelocity = ballNode.getComponent(cc.RigidBody).linearVelocity;
        addBallVelocity.x = -(addBallVelocity.x);
        let ballColor = cc.Color.YELLOW;
        this.initOneBall(addBallVelocity, ballColor, cc.v2(ballNode.x, ballNode.y), ballNode.getComponent(cc.RigidBody).gravityScale);
    },

    //打怪
    onBallContactMonster(ballNode, groundNode) {
        let self = this;
        let tempRandom = Math.random();
        ballNode.getComponent(cc.RigidBody).gravityScale = 8;
        if (tempRandom < 0.2) {
            let qi1 = groundNode.getChildByName("danzhu_qi");
            let qi2 = groundNode.getChildByName("danzhu_qi2");
            if (tempRandom < 0.1) {
                if (!qi1.active) {
                    qi1.active = true;
                    qi1.runAction(cc.sequence(
                        cc.fadeIn(0.3),
                        cc.delayTime(0.2),
                        cc.fadeOut(0.3),
                        cc.callFunc(() => qi1.active = false)));
                }

            } else {
                if (!qi2.active) {
                    qi2.active = true;
                    qi2.runAction(cc.sequence(
                        cc.fadeIn(0.3),
                        cc.delayTime(0.2),
                        cc.fadeOut(0.3),
                        cc.callFunc(() => qi2.active = false)));
                }
            }
            let curRandomVal = (Math.ceil(Math.random() * 20) + 10) / 100;
            let curRandomGold = Math.ceil(curRandomVal * self.randomGold);
            if (self.randomGold > 0) {
                let curPos = ballNode.convertToWorldSpaceAR(cc.v2(0, 0));
                let curPos1 = self.effectNode.convertToWorldSpaceAR(cc.v2(0, 0));
                let tempPosX = curPos.x - curPos1.x;
                let tempPosY = curPos.y - curPos1.y;

                if (curRandomGold == 0) {
                    curRandomGold = self.randomGold;
                    self.randomGold -= curRandomGold;
                    // this.setPiaofen(curRandomGold);
                } else {
                    if (self.randomGold > curRandomGold) {
                        self.randomGold -= curRandomGold;
                        // this.setPiaofen(curRandomGold);
                    }
                    else {
                        curRandomGold = self.randomGold;
                        self.randomGold -= curRandomGold;
                        // this.setPiaofen(curRandomGold);
                    }
                }
                let getGoldNum = Math.ceil(Math.random() * 3);
                for (let i = 0; i < getGoldNum; i++) {
                    this.initGold(tempPosX, tempPosY, i == getGoldNum - 1, curRandomGold);
                }
            }
            if (self.randomGold == 0) {
                groundNode.runAction(cc.sequence(cc.delayTime(0.8), cc.moveTo(1, cc.v2(groundNode.x, -1100)), cc.callFunc(() => {
                    groundNode.active = false;
                })));
            }
        }
    },

    setPiaofen(goldVal) {
        let self = this;
        let curPiaofen = cc.instantiate(self.gamePiaofen);
        self.nodeRole.addChild(curPiaofen);
        curPiaofen.getComponent(cc.Label).string = "+" + goldVal;
        this.curGoldNum += goldVal;
        this.goldNum += goldVal;
        curPiaofen.runAction(cc.sequence(
            cc.moveTo(0.5, cc.v2(curPiaofen.x, 130)),
            cc.fadeOut(0.3),
            cc.callFunc(() => curPiaofen.destroy())));
    },

    //激光碰触到墙
    onLaserContactWall(laserNode, groundNode) {
        laserNode.destroy();
    },

    //激光碰到几何体
    onLaserContactGeometry(laserNode, groundNode) {
        if (groundNode.parent.name != "addBall" && groundNode.parent.name != "largenBall") {
            this.ballScore += groundNode.parent.getComponent("GeometryItem").clickNum;
            this.ballManage.setBallScore(this.ballScore);
            if (this.ballScore >= this.userInfo.score) {
                this.bIsGuanqia = true;
            }
            // if (CC_WECHATGAME) {
            //     GameTools.updateScore(this.ballScore, true);
            // }
        }

        let geometryNode = groundNode._parent;
        let geometryLayout = geometryNode.parent;
        this.geometry.onGeometryKill(geometryNode);
        if (geometryLayout && geometryLayout.childrenCount == 0) {
            this.geometry.onGeometryLayoutKill(geometryLayout);
        }

        this.curLinearVelocity = laserNode.getComponent(cc.RigidBody).linearVelocity;
        let ballWorldPos = laserNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let ballParentWorldPos = this.ballParent.convertToWorldSpaceAR(cc.v2(0, 0));
        let tempPosX = ballWorldPos.x - ballParentWorldPos.x;
        let tempPosY = ballWorldPos.y - ballParentWorldPos.y;

        laserNode.destroy();
        this.initSkill(0, this.curLinearVelocity, cc.v2(tempPosX, tempPosY));
    },

    onLaserContactEndGeometry(laserNode, groundNode) {
    },

    //炸弹碰到墙和物体
    onBoomContactWall(boomNode, groundNode) {
        let ballWorldPos = boomNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let ballParentWorldPos = this.ballParent.convertToWorldSpaceAR(cc.v2(0, 0));
        let boomPosX = ballWorldPos.x - ballParentWorldPos.x;
        let boomPosY = ballWorldPos.y - ballParentWorldPos.y;
        boomNode.destroy();
        let self = this;
        let bomb = cc.instantiate(self.effectPrb[2]);
        self.effectNode.addChild(bomb);
        bomb.runAction(cc.moveTo(0.01, boomNode.getPosition()));
        self.initSkill(2, null, cc.v2(boomPosX, boomPosY));
        let interval = setInterval(fun, 500);
        function fun() {
            self.bCurSkill[2] = false;
            self.bIsGuanqia ? self.gameEnd() : self.initNewGame();
            // self.initNewGame();
            clearInterval(interval);
        }
    },

    //炸弹
    onBoomCopyContactGeometry(boomNode, groundNode) {
        if (groundNode.parent.name != "addBall" && groundNode.parent.name != "largenBall") {
            this.ballScore += groundNode.parent.getComponent("GeometryItem").clickNum;
            this.ballManage.setBallScore(this.ballScore);
            if (this.ballScore >= this.userInfo.score) {
                this.bIsGuanqia = true;
            }
            // if (CC_WECHATGAME) {
            //     GameTools.updateScore(this.ballScore, true);
            // }
        }
        boomNode.destroy();
        let geometryNode = groundNode._parent;
        let geometryLayout = geometryNode.parent;
        this.geometry.onGeometryKill(geometryNode);
        if (geometryLayout && geometryLayout.childrenCount == 0) {
            this.geometry.onGeometryLayoutKill(geometryLayout);
        }
    },

    touchStart: function (event) {
        this.setAngle(event);
    },

    touchMove: function (event) {
        this.setAngle(event);
    },

    setAngle: function (event) {
        if (this.bIsStartBall) {
            this.ballLink.active = true;
            let touchPos = event.touch._point;
            let ballLinkPos = this.ballLink.convertToWorldSpaceAR(cc.v2(0, 0));
            let tempPosX = touchPos.x - ballLinkPos.x;
            let tempPosY = touchPos.y - ballLinkPos.y;

            let x = Math.abs(tempPosX);
            let y = Math.abs(tempPosY);
            let z = Math.sqrt(x * x + y * y);
            this.ballLink.height = parseInt(z) + 20;
            let jiaodu = Math.round((Math.asin(y / z) / Math.PI * 180));//最终角度
            if (jiaodu <= 10) {
                jiaodu = 10;
            }
            if (tempPosX == 0) {
                this.ballLink.rotation = 0;
            }
            else if (tempPosX > 0) {
                this.ballLink.rotation = -(90 - jiaodu);
            }
            else if (tempPosX < 0) {
                this.ballLink.rotation = 90 - jiaodu;
            }

            let tempVal = Math.abs(this.ballLink.rotation);
            if (this.ballLink.rotation != 0) {
                this.ballLink.getComponent(cc.Layout).spacingY = 23 - 6 * tempVal / 80;
            } else {
                this.ballLink.getComponent(cc.Layout).spacingY = 23;
            }
        }
    },

    touchEnd: function (event) {
        let self = this;
        if (self.bIsStartBall) {
            self.bIsStartBall = false;
            self.ballLink.active = false;
            let touchPos = event.touch._point;
            let ballLinkPos = self.ballLink.convertToWorldSpaceAR(cc.v2(0, 0));
            let tempPosX = touchPos.x - ballLinkPos.x;
            let tempPosY = touchPos.y - ballLinkPos.y;

            //均匀球线性速度
            tempPosY = tempPosY > -1 ? -1 : tempPosY;
            tempPosY = tempPosY < -1500 ? -1500 : tempPosY;

            let curTempPosY = tempPosY * ((-1500) / tempPosY);
            let curTempPosX = tempPosX * ((-1500) / tempPosY);
            let xx = Math.abs(curTempPosX);
            let yy = Math.abs(curTempPosY);
            let zz = Math.sqrt(xx * xx + yy * yy);

            if (zz > 1500) {
                let tempVal = zz / 1500;
                curTempPosY /= tempVal;
                curTempPosX /= tempVal;
            }

            if (this.bCurSkill[2]) {
                let boom = cc.instantiate(self.effectPrb[1]);
                self.effectNode.addChild(boom);
                boom.getComponent("boom").init(this);
                boom.getComponent(cc.RigidBody).linearVelocity = cc.v2(curTempPosX, curTempPosY);
            }
            else if (this.bCurSkill[1]) {
                self.initSkill(0, cc.v2(curTempPosX * 2, curTempPosY * 2));
                let laser = cc.instantiate(self.effectPrb[0]);
                self.effectNode.addChild(laser);
                laser.rotation = self.ballLink.rotation;
                let interval = setInterval(() => {
                    laser.destroy();

                    self.bCurSkill[1] = false;
                    self.bIsGuanqia ? self.gameEnd() : self.initNewGame();
                    // self.initNewGame();
                    clearInterval(interval);
                }, 1100);
            }
            else {
                if (self.doubleNum <= 0) {
                    let tempRandom = Math.random();
                    if (tempRandom < self.userInfo.head / 100) {
                        self.doubleNum = self.ballNumber;
                        self.ballManage.setBallNumber(self.ballNumber + self.doubleNum);
                    }
                }
                let timesRun = 0;
                let interval = setInterval(fun, self.serveSpeed);
                function fun() {
                    timesRun++;
                    self.ballManage.setBallNumber(self.ballNumber + self.doubleNum - timesRun + self.addBallNum);

                    let doubleColor = timesRun > (self.ballNumber + self.addBallNum) ? cc.Color.RED : cc.Color.WHITE;
                    self.initOneBall(cc.v2(curTempPosX * (1 + self.userInfo.grade[5] / 200), curTempPosY * (1 + self.userInfo.grade[5] / 200)), doubleColor);
                    if (timesRun == (self.ballNumber + self.doubleNum + self.addBallNum)) {
                        self.ballManage.setAddBallScore(0);
                        clearInterval(interval);
                    }
                }
            }
        }
    },

    showBox: function () {
        let curGameBox = cc.instantiate(this.gameBox);
        this.node.addChild(curGameBox);
        curGameBox.getComponent("GameBox").init(this);
    },

    //技能点击
    skillClick: function (event) {
        let btnName = event.target.name;
        if (btnName === "speedup") {
            let curGameProperty = cc.instantiate(this.gameProperty);
            this.node.addChild(curGameProperty);
            curGameProperty.getComponent("GameProperty").init(this);
        }
        else if (btnName === "doubleSkill") {
            if (this.gameSkill.skillNum[0] <= 0) {
                loadResLayer.prototype.addSystemTip("暂无可用次数");
            } else if (this.getRestBtnState(0)) {
                loadResLayer.prototype.addSystemTip("您正在使用其他技能");
            } else if (this.gameSkill.skillNum[0] > 0 && !this.bCurSkill[0] && !this.bNextSkill[0]) {

                if (this.bIsStartBall) {
                    loadResLayer.prototype.addSystemTip("您使用了双倍球球");
                    this.gameSkill.skillNum[0]--;
                    this.bCurSkill[0] = true;
                    this.doubleNum = this.bCurSkill[0] ? this.ballNumber : 0;
                    this.ballManage.setBallNumber(this.ballNumber + this.doubleNum);

                    if(this.gameSkill.skillNum[0] === 0){
                        this.setSkillBtnState(0);
                    }
                } else {
                    // this.bNextSkill[0] = true;
                }
            }
        }
        else if (btnName === "laserSkill") {
            if (this.gameSkill.skillNum[1] <= 0) {
                loadResLayer.prototype.addSystemTip("暂无可用次数");
            } else if (this.getRestBtnState(1)) {
                loadResLayer.prototype.addSystemTip("您正在使用其他技能");
            } else if (this.gameSkill.skillNum[1] > 0 && !this.bCurSkill[1] && !this.bNextSkill[1]) {

                if (this.bIsStartBall) {
                    loadResLayer.prototype.addSystemTip("您使用了激光");
                    this.gameSkill.skillNum[1]--;
                    this.bCurSkill[1] = true;

                    if(this.gameSkill.skillNum[1] === 0){
                        this.setSkillBtnState(1);
                    }
                } else {
                    // this.bNextSkill[1] = true;
                }
            }
        }
        else if (btnName === "boomSkill") {
            if (this.gameSkill.skillNum[2] <= 0) {
                loadResLayer.prototype.addSystemTip("暂无可用次数");
            } else if (this.getRestBtnState(2)) {
                loadResLayer.prototype.addSystemTip("您正在使用其他技能");
            } else if (this.gameSkill.skillNum[2] > 0 && !this.bCurSkill[2] && !this.bNextSkill[2]) {

                if (this.bIsStartBall) {
                    loadResLayer.prototype.addSystemTip("您使用了炸弹");
                    this.gameSkill.skillNum[2]--;
                    this.bCurSkill[2] = true;

                    if(this.gameSkill.skillNum[2] === 0){
                        this.setSkillBtnState(2);
                    }
                } else {
                    // this.bNextSkill[2] = true;
                }
            }

        }
        else if (btnName === "chearSkill") {
            let selectLevelPrb = cc.instantiate(this.selectLevel);
            this.node.addChild(selectLevelPrb);
            selectLevelPrb.getComponent("SelectLevel").init(this);
            // loadResLayer.prototype.addSystemTip("选关正在开发中");
        }
    },

    //获取其他按钮状态
    getRestBtnState: function (btnIndex) {
        if (btnIndex == 0) {
            return (this.bCurSkill[1] || this.bNextSkill[1] || this.bCurSkill[2] || this.bNextSkill[2]);
        } else if (btnIndex == 1) {
            return (this.bCurSkill[0] || this.bNextSkill[0] || this.bCurSkill[2] || this.bNextSkill[2]);
        } else if (btnIndex == 2) {
            return (this.bCurSkill[0] || this.bNextSkill[0] || this.bCurSkill[1] || this.bNextSkill[1]);
        }
    },

    setSkillBtnState: function (btnIndex) {
        let skillBtnNode = this.node.getChildByName("skill").getChildByName("skillLayout");
        if (btnIndex === 0) {
            skillBtnNode.getChildByName("doubleSkill").getComponent(cc.Button).interactable = false;
        } else if (btnIndex === 1) {
            skillBtnNode.getChildByName("laserSkill").getComponent(cc.Button).interactable = false;
        } else if (btnIndex === 2) {
            skillBtnNode.getChildByName("boomSkill").getComponent(cc.Button).interactable = false;
        }
    },

    //按钮点击
    onButtonClick: function (event) {
        let btnName = event.target;
        if (btnName.name === "menu") {
            let gameMenuNode = cc.instantiate(this.gameMenuPrb);
            this.node.addChild(gameMenuNode);
            gameMenuNode.getComponent("GameMenu").init(this);
        }
        else if (btnName.name === "adBtn") {
            let curTitle = this.getRandomShare();
            if (CC_WECHATGAME) {
                wx.shareAppMessage({
                    title: curTitle,
                    imageUrl: window.sharePath,
                    success: function (res) {
                        loadResLayer.prototype.addSystemTip('分享成功');
                        if (window.shareThreeNum < 3) {
                            window.shareThreeNum++;
                        }
                    },
                    fail: function (res) {
                        loadResLayer.prototype.addSystemTip('分享失败');
                    }
                });
            }
            else {
                if (window.shareThreeNum < 3) {
                    window.shareThreeNum++;
                }
            }
        }
        else if (btnName.name === "shareBtn") {
            this.showBox();
        }
    },

    //获取随机分享标题
    getRandomShare: function () {
        let tempRandom = Math.floor(Math.random() * 4);
        return shareTitle[tempRandom];
    },

    //单轮游戏结束
    gameEnd: function () {
        let self = this;
        self.endDataInit();
        if (this.bIsGuanqia) {
            if (this.userInfo.highguanqiaNum == this.userInfo.guanqiaNum && this.userInfo.guanqiaNum % 5 == 0 && !this.bIsHitBoss && !this.bHundredBoss) {
                if (this.userInfo.highguanqiaNum == 100) {
                    this.bHundredBoss = true;
                }
                this.bIsHitBoss = true;
                this.monster.active = true;
                this.monster.stopAllActions();
                this.monster.y = -1100;
                this.geometry.clearGeometry();
                this.monster.runAction(cc.sequence(cc.moveTo(1, cc.v2(this.monster.x, -700)), cc.callFunc(() => {
                    self.bIsStartBall = true;
                    self.rollbackNum = 0;
                    let randomNum = 2 + Math.random();
                    self.randomGold = parseInt(this.userInfo.dropGold * randomNum);
                })));
            }
            else {
                if (this.bIsHitBoss) {
                    this.bIsHitBoss = false;
                }
                let gameNextLevelNode = cc.instantiate(this.gameNextLevel);
                this.node.addChild(gameNextLevelNode);
                let gameEndJs = gameNextLevelNode.getComponent("GameNextLevel");
                gameEndJs.init(this);
            }

        } else {
            this.initNewGame();
        }
    },

    //单轮结束初始化数据
    endDataInit: function () {
        let self = this;
        for (let i = 0; i < self.ballParent.childrenCount; i++) {
            let tempNode = self.ballParent._children[i];
            self.onBallKill(tempNode);
        }
        self.rollbackNum = 0;
        self.splitBallNum = 0;
        if (self.tempAddBall > 0) {
            self.addBallNum += self.tempAddBall;
            self.tempAddBall = 0;
        }
        self.ballManage.setAddBallScore(self.addBallNum);
        self.ballManage.setBallNumber(self.ballNumber);
        self.doubleNum = 0;
        self.splitProbBallNum = 0;
        for (let i = 0; i < 3; i++) {
            self.bCurSkill[i] = false;
            if (self.bNextSkill[i]) {
                self.bNextSkill[i] = false;
                self.bCurSkill[i] = true;
                if (i == 0) {
                    self.doubleNum = self.bCurSkill[0] ? self.ballNumber : 0;
                    self.ballManage.setBallNumber(self.ballNumber + self.doubleNum);
                }
            }
        }
    },

    //初始化新的一局
    initNewGame: function () {
        this.bIsStartBall = true;
        this.geometry.initGeometry();
        if (this.geometry.getGameIsEnd()) {
            let gameEndNode = cc.instantiate(this.gameEndPrb);
            this.node.addChild(gameEndNode);
            let gameEndJs = gameEndNode.getComponent("GameEnd");
            gameEndJs.init(this);
        }
        if (this.gameBoxNum > 0) {
            this.ballNumber += this.gameBoxNum;
            this.ballManage.setBallNumber(this.ballNumber);
            this.gameBoxNum = 0;
        }
        this.setTopsBallNum();
    },

    //设置属性上装增加球
    setTopsBallNum: function () {
        if (this.topsNum > 0) {
            this.ballNumber += (this.topsNum - this.nextTopsNum);
            this.nextTopsNum = 0;
            this.ballManage.setBallNumber(this.ballNumber);
            this.topsNum = 0;
        }
    },

    //设置关卡
    setGuanqia() {
        this.bIsGuanqia = false;
        this.addBallNum = 0;
        this.ballManage.setAddBallScore(0);
        if (this.userInfo.guanqiaNum == 100 && this.bIsHundred) {
            this.userInfo.guanqiaNum = 1;
            this.userInfo.score = 0;
            this.ballScore = 0;
            this.ballManage.setBallScore(this.ballScore);
        }
        this.userInfo.setUserInfo();

        this.lbGuanqia.string = this.userInfo.guanqiaNum;
        this.lbTargetGold.string = this.userInfo.score + "分";

        this.geometry.clearGeometry();
        this.initNewGame();
    },



});
