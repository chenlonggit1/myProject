echo off
echo 结束机器人 。。。。
taskkill /im CellsRobot.exe /f

echo 退出完毕，2秒后退出结束控制台
ECHO Wscript.Sleep(2000) > sleep.vbs
START /WAIT wscript.exe sleep.vbs
DEL /Q sleep.vbs
