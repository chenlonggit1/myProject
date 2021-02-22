## -*- coding: utf-8 -*-
#coding=utf-8


# 安装 pip install tornado
# 打包为exe
"""
pip install pyinstaller
pyinstaller -F zdxb_web.py
"""

import sys
import json

import tornado.ioloop
import tornado.web
from tornado.options import define, options
tornado.options.parse_command_line()

define("port", default=4000, help="run on the given port", type=int)


class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
    		self.set_header("Access-Control-Allow-Origin", "*"); 
    		self.set_header("Access-Control-Allow-Headers", "x-requested-with,access_token");#这里要填写上请求带过来的Access-Control-Allow-Headers参数，如access_token就是我请求带过来的参数
    		self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE"); #请求允许的方法
    		self.set_header("Access-Control-Max-Age", "3600");#用来指定本次预检请求的有效期，单位为秒，，在此期间不用发出另一条预检请求。
    def options(self):
			pass


class MainHandler(BaseHandler):
    def get(self):
        self.write("Hello, world")


# http://games.bpl.qp.qianz.com/API/GameServerFilter.aspx?gid=10095	
class GsFilter(BaseHandler):
    def get(self):
		f = open("gs.json")
		obj = json.load(f)
		print("/API/GameServerFilter.aspx req result:", json.dumps(obj))
		self.write(json.dumps(obj))		
    def post(self, page):
        pass

# http://mapi.qpgame.com/Services/WechatBind.ashx
class WechatBind(BaseHandler):
    def get(self):
		str = '''{"result":{"value":"0","message":"ok","data":{"errorcode":"0","authcode":"","msg":"success"}}}'''
		self.write(str)		
    def post(self, page):
        pass




def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
		(r"/API/GameServerFilter.aspx", GsFilter),
		(r"/Services/WechatBind.ashx", WechatBind),

    ])

if __name__ == "__main__":
    app = make_app()
    print("server start listen port:" + str(options.port))
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()