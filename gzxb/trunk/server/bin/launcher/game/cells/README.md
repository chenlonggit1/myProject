{
	
	"SupArenaID": 4,	//体验场的ID
	"SupArenaID": 4,	//体验场的初始金币
	
	"Defend": [{	//免伤 
		"Ratio": 0,
		"Base": 10000
	}, {
		"Ratio": 0,
		"Base": 10000
	}, {
		"Ratio": 0,
		"Base": 10000
	}, {
		"Ratio": 0,
		"Base": 10000
	}],

	
	//合法的倍率
	"Ratios": [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
	
	//有效线的组合
	"EffectiveRoute": [
		"W": [1,1,1,1,1]		//第一列与第五列只为1/2/3 第二列-第四列为1/2/3/4
	],
	
	"SymbolConfig": [{
		"ID": 2,		//图标ID,百搭的图标ID为1
		"Symbol": [{	//百搭不需要填写
				"Idx": 3,		//连续中几个
				"Reward": 30	//奖励的倍率
			}
		],
		"ratio": 9		//元素图标出现的概率分子
	}],
	
	"BigReward": [{		//爆破轮的配置
			"Ratio": 19,				//出现的概率
			"Type": 0,					//奖励的类型:0百搭已加入 1免费次数 2X奖额 3累宝转盘 4小奖池
			"FreeTimesIdx": 0,			//固定的免费次数
			"BigRewardRatios": [2,3,5],	//固定免费次数下百搭出现概率增加的情况
			"FreeTimes": [3],			//免费次数
			"IconResultMulti": [],		//X奖额
			"AccumulativeReward": []	//累宝转盘
		}],
		
	"SamllAwardPool": {	//小奖奖池的配置
		"Min": 15000,	//初始值
		"Max": 20000,	//巅峰值
		"SecMin": 2,	//每隔几秒区间
		"SecMax": 5,
		"UpgradeValueMin": 1,	//每隔几秒增长的区间
		"UpgradeValueMax": 110
	},
	
	"AwardPoolUpdateSec": 60,	//大奖奖池更新的时间间隔
	"AwardPool": {		//大奖池配置
		"Ratio": 10,	//免伤
		"Base": 10000,
		"TriggerValue": 475000,	//奖池开启值
		"TriggerInitFactor": 1,	//奖池状态系数
		"UpgradeValue": 19000,	//奖池每提升多少值，奖池状态系数提升
		"UpgradeFactor": 1,		//奖池状态系数提升值
		"MinValue": 95000		//大奖池保底值
	}
}