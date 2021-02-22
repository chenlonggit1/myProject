## -*- coding: utf-8 -*-
#coding=utf-8

import pymssql
import decimal

class MSSQL:
    def __init__(self,host,user,pwd,db):
        self.host = host
        self.user = user
        self.pwd = pwd
        self.db = db

    def __GetConnect(self):
        if not self.db:
            raise(NameError,"没有设置数据库信息")
        self.conn = pymssql.connect(host=self.host,user=self.user,password=self.pwd,database=self.db,charset="utf8")
        cur = self.conn.cursor()
        if not cur:
            raise(NameError,"连接数据库失败")
        else:
            return cur

    def ExecQuery(self,sql):
        cur = self.__GetConnect()
        cur.execute(sql)
        resList = cur.fetchall()

        #查询完毕后必须关闭连接
        self.conn.close()
        return resList

    def ExecNonQuery(self,sql):
        cur = self.__GetConnect()
        cur.execute(sql)
        self.conn.commit()
        self.conn.close()

class SQLHelper(object):
    def __init__(self, host, user, pwd):
        self.host = host
        self.user = user
        self.pwd = pwd

    # 查询玩家dbid是否存在
    def query_user_exist(self, user_dbid):
        # strSql = 'update test_tbl set nick = \'%s\'where id = %d' %(nick,id)
        strSql = 'SELECT * FROM Coin.Money WHERE iUserID = %d;' %(user_dbid)
        dbname = "SY_Money"
        ms = MSSQL(host=self.host,user=self.user,pwd=self.pwd,db=dbname)
        result = ms.ExecQuery(strSql.encode('utf-8'))
        if result == []:
            return False
        else:
            return True

    # 查询玩家金币
    def query_user_gold(self, user_dbid):
        # strSql = 'update test_tbl set nick = \'%s\'where id = %d' %(nick,id)
        strSql = 'SELECT biAmount FROM Coin.Money WHERE iUserID = %d;' %(user_dbid)
        dbname = "SY_Money"
        ms = MSSQL(host=self.host,user=self.user,pwd=self.pwd,db=dbname)
        result = ms.ExecQuery(strSql.encode('utf-8'))
        if result == []:
            return False, 0
        else:
            return True, result[0][0]

    # 修改玩家金币数量
    def update_user_gold(self, user_dbid, gold_count):
        strSql = 'UPDATE Coin.Money SET biAmount= %d WHERE iUserID = %d;' %(gold_count, user_dbid)
        dbname = "SY_Money"
        ms = MSSQL(host=self.host,user=self.user,pwd=self.pwd,db=dbname)
        ms.ExecNonQuery(strSql.encode('utf-8'))


    # 查询玩家钻石
    def query_user_diamond(self, user_dbid):
        strSql = 'SELECT biAmount FROM Coin.ExtendUserCoin WHERE tiCoinTypeID = 1 AND iUserID = %d;' %(user_dbid)
        dbname = "SY_Money"
        ms = MSSQL(host=self.host,user=self.user,pwd=self.pwd,db=dbname)
        result = ms.ExecQuery(strSql.encode('utf-8'))
        if result == []:
            return False, 0
        else:
            return True, result[0][0]

    # 修改玩家钻石数量
    def update_user_diamond(self, user_dbid, diamond_count):
        strSql = 'UPDATE Coin.ExtendUserCoin SET biAmount = %d WHERE tiCoinTypeID = 1 AND iUserID = %d;' %(diamond_count, user_dbid)
        dbname = "SY_Money"
        ms = MSSQL(host=self.host,user=self.user,pwd=self.pwd,db=dbname)
        ms.ExecNonQuery(strSql.encode('utf-8'))

    # 解除账号锁
    def delete_user_lock(self, user_dbid):
        strSql = 'SELECT * FROM GameInfo.UserOnline WHERE iUserID = %d;' %(user_dbid)
        dbname = "SY_Money"
        ms = MSSQL(host=self.host,user=self.user,pwd=self.pwd,db=dbname)
        result = ms.ExecQuery(strSql.encode('utf-8'))
        print result
        if result == []:
            return False

        strSql = 'DELETE FROM GameInfo.UserOnline WHERE iUserID = %d;' %(user_dbid)
        dbname = "SY_Money"
        ms = MSSQL(host=self.host,user=self.user,pwd=self.pwd,db=dbname)
        ms.ExecNonQuery(strSql.encode('utf-8'))
        return True

    # 清理游戏缓存
    def clean_game_data(self, user_dbid, game_db_name):
        strSql = 'DELETE FROM dbo.MKeyValue WHERE Id = \'%s\';' %(str(user_dbid))
        dbname = game_db_name
        ms = MSSQL(host="172.13.0.58:39000",user="sa",pwd="hy7961pl.NET",db=dbname)
        ms.ExecNonQuery(strSql.encode('utf-8'))
        return True


def test_sqlhelper():
    helper = SQLHelper("113.106.164.43:32960", "test", "test!@#")
    print(helper.query_user_gold(494381))
    print(helper.clean_game_data(str(494381), "game_qp_cells"))
    # helper.update_user_gold(1001145, 20000)
    # print(helper.query_user_gold(1001145))
    # print (helper.query_user_diamond(1001145))
    # helper.update_user_diamond(1001145, 20000)
    # print (helper.query_user_diamond(1001145))
    #helper = SQLHelper("111.161.123.228", "test", "gtgame@w_design@song")
    #for num in range(1001123,1001173):  
    #    helper.update_user_gold(num, 50000000)
    #    helper.delete_user_lock(num)

#test_sqlhelper()


# 打包为exe
"""
pip install pyinstaller
pyinstaller -F QPSQLTool.py
"""
import Tkinter # import the Tkinter module
from Tkinter import *

class AppView(object):
    def __init__(self, root):
        self.root = root
        self.init_view()
        self.sqlhelper = SQLHelper("113.106.164.43:32960", "test", "test!@#")

    def init_view(self):
        self.root.title("亲朋SQL工具")                           #设置窗口标题
        self.root.geometry('300x200')                        #是x 不是*
        self.root.resizable(width=False, height=False)       #宽不可变, 高可变,默认为True

        # 定义顶部标签
        # Tkinter.Label(root, text='欢迎使用亲朋SQL工具'.decode('gbk').encode('utf8'), font=('Arial', 20)).pack()    
        Tkinter.Label(root, text='欢迎使用此工具', font=('Arial', 20)).pack() 
        Tkinter.Label(root, text='工具制作者:金振涛', font=('Arial', 10)).pack() 
        query_frame = Frame(self.root)
        input_frame = Frame(query_frame)

        Tkinter.Label(input_frame, text='请输入玩家dbid:', font=('Arial', 10)).pack(side=LEFT) 
        self.dbid_edit = Tkinter.Entry(input_frame,show='', width=12,)
        self.dbid_edit.pack(side=RIGHT)
        input_frame.pack(side=LEFT)

        input_btn_frame = Frame(query_frame)
        Tkinter.Button(input_btn_frame, text='查询', width=6, height=1, command=self.on_btn_query_click).pack(side=LEFT)   
        Tkinter.Button(input_btn_frame, text='解锁', width=6, height=1, command=self.on_btn_unlock_click).pack(side=RIGHT) 
        input_btn_frame.pack(side=RIGHT)
        query_frame.pack()
    
        print_frame = Frame(self.root)
        self.var_result = Tkinter.StringVar()
        Tkinter.Label(print_frame, textvariable=self.var_result, bg='green', font=('Arial', 12), width=36, height=2).pack()
        print_frame.pack()

        action_frame = Frame(self.root)
        md_input_fram = Frame(action_frame)
        Tkinter.Label(md_input_fram, text='请输入数量:', font=('Arial', 10)).pack(side=LEFT) 
        self.md_edit = Tkinter.Entry(md_input_fram,show='', width=14)
        self.md_edit.pack(side=LEFT)
        md_input_fram.pack(side=LEFT)

        md_btn_fram = Frame(action_frame)
        Tkinter.Button(md_btn_fram, text='修改金币', width=8, height=1, command=self.on_btn_md_gold_click).pack(side=LEFT) 
        Tkinter.Button(md_btn_fram, text='修改钻石', width=8, height=1, command=self.on_btn_md_diamond_click).pack(side=RIGHT) 
        md_btn_fram.pack(side=RIGHT)
        action_frame.pack()
		
        clean_frame = Frame(self.root)
        clean_input_fram = Frame(clean_frame)
        Tkinter.Label(clean_input_fram, text='请输入游戏库名:', font=('Arial', 10)).pack(side=LEFT) 
        self.clean_edit = Tkinter.Entry(clean_input_fram,show='', width=20)
        self.clean_edit.insert(END,'game_qp_cells')
        self.clean_edit.pack(side=LEFT)
        clean_input_fram.pack(side=LEFT)

        clean_btn_fram = Frame(clean_frame)
        Tkinter.Button(clean_btn_fram, text='清理数据', width=8, height=1, command=self.on_btn_clean_game_data_click).pack()
        clean_btn_fram.pack(side=RIGHT)

        clean_frame.pack()
		

    def on_btn_query_click(self):
        print("on_btn_query_gold_click")
        self.var_result.set("")
        user_dbid = 0
        try:
            user_dbid = int(self.dbid_edit.get())
        except:
            self.var_result.set("输入的dbid格式无效"+ "\n")
            return 
        if not self.sqlhelper.query_user_exist(user_dbid):
            self.var_result.set("输入的dbid不存在"+ "\n")
            return 

        ok, gold = self.sqlhelper.query_user_gold(user_dbid)
        if not ok:
            self.var_result.set("查询金币数量失败"+ "\n")
            return 

        ok, diamond = self.sqlhelper.query_user_diamond(user_dbid)
        if not ok:
            self.var_result.set("查询钻石数量失败"+ "\n")
            return 
        self.var_result.set("查询成功 金币:%d 钻石:%d\n" % (gold, diamond) )

    def on_btn_md_gold_click(self):
        print("on_btn_md_gold_click")
        self.var_result.set("")
        user_dbid = 0
        try:
            user_dbid = int(self.dbid_edit.get())
        except:
            self.var_result.set("输入的dbid格式无效"+ "\n")
            return 
        if not self.sqlhelper.query_user_exist(user_dbid):
            self.var_result.set("输入的dbid不存在"+ "\n")
            return 

        gold_count = 100
        try:
            gold_count = int(self.md_edit.get())
        except:
            self.var_result.set("输入的数量无效"+ "\n")
            return
        self.sqlhelper.update_user_gold(user_dbid, gold_count)
        self.var_result.set("修改成功,请重新查询"+ "\n")

    def on_btn_md_diamond_click(self):
        print("on_btn_md_gold_click")
        self.var_result.set("")
        user_dbid = 0
        try:
            user_dbid = int(self.dbid_edit.get())
        except:
            self.var_result.set("输入的dbid格式无效"+ "\n")
            return 
        if not self.sqlhelper.query_user_exist(user_dbid):
            self.var_result.set("输入的dbid不存在"+ "\n")
            return 

        diamond_count = 100
        try:
            diamond_count = int(self.md_edit.get())
        except:
            self.var_result.set("输入的数量无效"+ "\n")
            return
        self.sqlhelper.update_user_diamond(user_dbid, diamond_count)
        self.var_result.set("修改成功,请重新查询"+ "\n")

    def on_btn_unlock_click(self):
        print("on_btn_unlock_click")
        self.var_result.set("")
        user_dbid = 0
        try:
            user_dbid = int(self.dbid_edit.get())
        except:
            self.var_result.set("输入的dbid格式无效"+ "\n")
            return 
        if not self.sqlhelper.query_user_exist(user_dbid):
            self.var_result.set("输入的dbid不存在"+ "\n")
            return 

        if self.sqlhelper.delete_user_lock(user_dbid):
            self.var_result.set("账号解锁成功"+ "\n")
        else:
            self.var_result.set("账号未被锁"+ "\n")

    def on_btn_clean_game_data_click(self):
        print("on_btn_unlock_click")
        self.var_result.set("")
        user_dbid = 0
        game_db_name = ""
        try:
            user_dbid = int(self.dbid_edit.get())
        except:
            self.var_result.set("输入的dbid格式无效"+ "\n")
            return 
        if not self.sqlhelper.query_user_exist(user_dbid):
            self.var_result.set("输入的dbid不存在"+ "\n")
            return 

        try:
            game_db_name = self.clean_edit.get()
        except:
            self.var_result.set("输入的dbid格式无效"+ "\n")
            return 

        if game_db_name == "":
            self.var_result.set("游戏库名不能为空"+ "\n")
            return 

        try:
            user_dbid = int(self.dbid_edit.get())
            self.sqlhelper.clean_game_data(user_dbid, game_db_name)
            self.var_result.set("清理游戏数据成功"+ "\n")
        except:
            self.var_result.set("清理游戏数据失败"+ "\n")
            return 



root = Tkinter.Tk() # create a root window
appview = AppView(root)
root.mainloop() # create an event loop