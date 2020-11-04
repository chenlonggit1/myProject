
var User = cc.Class(
    {
        ctor: function () {
            this.highguanqiaNum = 1;            //最高关卡数 
            this.guanqiaNum = 1;                //当前关卡数        
            this.score = 340;                   //分值          
            this.minScore = 4;                  //障碍物分数min 
            this.maxScore = 30;                  //障碍物分数max
            this.meanScore = 17;                 //均值          
            this.objectNum = 10;                //障碍物数      
            this.ballNum = 10;                  //球数          
            this.addProperty = 1;               //属性加成      
            this.onceScore = 2;                 //单次得分     
            this.reviveNum = 1;                 //关卡复活次数 
            this.propProbability = 0.2;         //道具刷新概率，20%-10%

            this.grade = [];                    //等级          
            this.consume = 0;                   //消耗          
            this.weapon = 0;                    //武器          
            this.head = 0;                      //头肩          
            this.tops = 0;                      //上装          
            this.bottoms = 13;                  //下装          
            this.belt = 0;                      //腰带          
            this.shoe = 1500;                   //鞋子          

            this.grade = new Array();
            for (let i = 0; i < 6; i++) {
                this.grade[i] = 1;
            }

            this.goldNum = 100;                   //金币
            this.ballScore = 0;                 //分数
            this.skillNum = [2, 2, 2];          //技能个数
            this.dropGold = 10;                 //金币掉落

            this.currentClick = 0;              //当前点击装备
            this.bIsDetail = false;             //当前是否详细装备
        },

        //设置用户信息
        setUserInfo() {
            let guanqiaValue = this.guanqiaNum;
            if (guanqiaValue > 1) {
                this.minScore = 4 + (guanqiaValue - 1) * 2;
                this.maxScore = guanqiaValue < 5 ? 30 + (guanqiaValue - 1) * 20 : 80 + (guanqiaValue - 4) * 20;
                this.meanScore = (this.minScore + this.maxScore) / 2;
                this.objectNum = 10 + guanqiaValue - 1;
                this.addProperty = 1 + (parseInt((guanqiaValue - 2) / 3) + 1) * 0.1;
                let curVal = this.meanScore * this.objectNum * (this.addProperty * 10) * this.onceScore / 10;
                let frontNum = this.getFrontNum();
                this.score = this.setInteger((curVal * 10 + frontNum * 10) / 10);

                this.dropGold = 10 + (guanqiaValue - 1) * 8;

                this.propProbability = 0.2 - (guanqiaValue - 1) * 0.001;
            } else {
                this.score = 340;
                this.minScore = 4;
                this.maxScore = 30;
                this.meanScore = 17;
                this.objectNum = 10;
                this.addProperty = 1;
                this.dropGold = 10;
                this.propProbability = 0.2;
            }
            this.reviveNum = 1;
        },

        //获取之前的分值
        getFrontNum() {
            let guanqiaValue = this.guanqiaNum - 1;
            if (guanqiaValue == 1) {
                return 340;
            }
            else {
                let tempVal = 0;
                for (let i = 2; i <= guanqiaValue; i++) {
                    let curMinScore = 4 + (i - 1) * 2;
                    let curMaxScore = i < 5 ? 30 + (i - 1) * 20 : 80 + (i - 4) * 20;
                    let curMeanScore = (curMinScore + curMaxScore) / 2;
                    let curObjectNum = 10 + i - 1;
                    let curAddProperty = 1 + (parseInt((i - 2) / 3) + 1) * 0.1;
                    let curScore = curMeanScore * curObjectNum * (curAddProperty * 10) * this.onceScore / 10;
                    tempVal = (tempVal * 10 + curScore * 10) / 10;
                }
                tempVal += 340;
                return tempVal;
            }
        },

        getFrontIntNum() {
            let frontNum = this.getFrontNum();
            return this.setInteger(frontNum * 10 / 10);
        },

        //设置整数点
        setInteger(tempScore) {
            let result = 0;
            if (tempScore > 10000000) {
                result = 4;
            } else if (tempScore > 100000) {
                result = 3;
            } else if (tempScore > 1000) {
                result = 2;
            } else if (tempScore > 10) {
                result = 1;
            }
            return parseInt(tempScore / (Math.pow(10, result))) * Math.pow(10, result);
        },

        //初始设置装备
        initEquipGrade(equipIndex, equipGrade) {
            this.grade[equipIndex] = equipGrade;
            this.setDetailVal(equipIndex);
        },

        //设置装备等级
        setEquipGrade(equipIndex, equipGrade) {
            this.grade[equipIndex] += equipGrade;
            this.setDetailVal(equipIndex);
        },

        //设置装备详细数值
        setDetailVal(equipIndex) {
            let curgrade = this.grade[equipIndex];
            if (curgrade > 1) {
                switch (equipIndex) {
                    case 0://武器
                        this.weapon = (4 + 2 * (curgrade - 2)) / 10;
                        break;
                    case 1://头肩
                        this.head = (10 + 5 * (curgrade - 2)) / 100;
                        break;
                    case 2://上装
                        this.tops = (curgrade - 2) + 1;
                        break;
                    case 3://下装
                        this.bottoms = curgrade / 20 + 13;
                        break;
                    case 4://腰带
                        this.belt = (2 + 1 * (curgrade - 2)) / 10;
                        break;
                    case 5://鞋子
                        // this.shoe = curgrade < 6 ? 1200 + (curgrade - 1) * 10 : 1240 + (curgrade - 5) * 8;
                        this.shoe =  1500 + (curgrade - 1) * 10 ;
                        break;
                }
            }
            else {
                switch (equipIndex) {
                    case 0://武器
                        this.weapon = 0;
                        break;
                    case 1://头肩
                        this.head = 0;
                        break;
                    case 2://上装
                        this.tops = 0;
                        break;
                    case 3://下装
                        this.bottoms = 13;
                        break;
                    case 4://腰带
                        this.belt = 0;
                        break;
                    case 5://鞋子
                        this.shoe = 1500;
                        break;
                }
            }
        },

        //获取下一级升级消耗
        getNextEquipConsume(equipIndex) {
            //计算升级消耗参数
            let argumentOne = this.grade[equipIndex] + 1;
            return this.getAnyEquipConsume(argumentOne);
        },

        //获取任意升级消耗
        getAnyEquipConsume(equipGrade) {
            if (equipGrade > 2) {
                let tempVal = 0;
                for (let i = 2; i < equipGrade; i++) {
                    let argumentOne = 1 + (i - 1) * 8;
                    tempVal = tempVal + argumentOne;
                }
                tempVal += 11;
                return tempVal;
            } else {
                return 11;
            }
        },

        //获取当前装备等级
        getEquipGrade(equipIndex) {
            return this.grade[equipIndex];
        },

        //获取后面装备等级
        getNextEquipGrade(equipIndex, equipNum) {
            let curgrade = equipNum ? this.grade[equipIndex] + equipNum : this.grade[equipIndex] + 1;
            if (curgrade > 100) {
                return "等级已满";
            }
            else {
                let result = 0;
                switch (equipIndex) {
                    case 0://武器
                        result = ((4 + 2 * (curgrade - 2)) / 10).toFixed(1);
                        break;
                    case 1://头肩
                        result = ((10 + 5 * (curgrade - 2)) / 100).toFixed(2);
                        break;
                    case 2://上装
                        result = (curgrade - 2) + 1;
                        break;
                    case 3://下装
                        result = (curgrade / 20 + 13).toFixed(2);
                        break;
                    case 4://腰带
                        result = ((2 + 1 * (curgrade - 2)) / 10).toFixed(1);
                        break;
                    case 5://鞋子
                        // result = curgrade < 6 ? 1200 + (curgrade - 1) * 10 : 1240 + (curgrade - 5) * 8;
                        result =  1500 + (curgrade - 1) * 10 ;
                        break;
                }
                if (equipIndex == 0 || equipIndex == 1 || equipIndex == 4) {
                    result += "%";
                }
                return result;
            }
        },
    });

var UserManager = new User();

export { UserManager }