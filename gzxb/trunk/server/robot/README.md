# 亲朋战斗细胞机器人


## **压测**
   ```
修改批处理启动机器人个数为 单组上限250  -cout=250，共8组
配置文件 AutoRun 改为true
启动批处理

备注:
	每组250个机器人，启动后s登录5个，预计50s后一组全部登入游戏
	可以在服务器world日志里 搜"IV_iUserCount="，会看到实际的总的在线人数，1分钟打印一次
	
   ```
2.**封包测试**

   ```
   修改批处理启动机器人个数为 1  -cout=1
   配置文件 AutoRun 改为false
   启动批处理

协议测试命令列表
logout -- 登出
start  -- 使用命令后 回合就会开始
restart -- 回合重新初始化 即刷新功能
setratio {"Ratio":10}   -- 对应SetRatioReq Ratio:配置
equip {"Position":0,"RoleID":201}   -- 对应EquipHeroReq  Position:[0,4],RoleID:配置id
unequip {"Position":0}   -- 对应UnEquipHeroReq
changeposition {"SourcePosition":0,"TargetPosition":2}   -- 对应ChangePositionReq
opencard {"CardIndex":0,"Times":10,"Ratio":10}   -- 对应OpenOneCardReq  CardIndex:[0,14], Times:[10,20]
usecard {"CardIndex":0}   -- 对应UseOneCardReq 仅限怪物卡牌(itemtypeid 3,Status:CT_ALREADY_OPEND )
attackentity {"AttackerID":10,"BeAttackerID":200300,"Times":10,"Ratio":10}   -- 对应AttackEntityReq
killentity {"EntityID":10}   -- 对应KillEntityReq 

allergenattack {"Index":10}   -- 过敏原剧情 攻击 对应AttackEntityReq  

clownopencard {"Round":1}   -- 小丑剧情 打开对应轮卡牌 对应ClownOpenAllCardReq
   ```