echo off
echo 结束房间服务器 。。。。
taskkill /im cells.exe /f

echo 结束大厅服务器 。。。。
taskkill /im gs.exe /f
taskkill /im world.exe /f
taskkill /im hall.exe /f


echo 退出完毕，2秒后退出结束控制台
ECHO Wscript.Sleep(2000) > sleep.vbs
START /WAIT wscript.exe sleep.vbs
DEL /Q sleep.vbs
