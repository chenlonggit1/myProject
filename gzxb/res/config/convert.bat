
:: 基于修改src code:https://github.com/zdhsoft/excel2json
:: pip install pyinstaller
:: pyinstaller -F excel2conf.py

@echo off

:: delete all *.json
echo del all *.json
del /s *.json

:: covert config
excel2conf.exe config.xlsx

:: mkdir 
md client
md server

:: copy config to target dir
echo f |xcopy basic_cs.json .\client\basic.json /y
echo f |xcopy basic_cs.json .\server\basic.json /y
echo f |xcopy bet_c.json .\client\bet.json /y
echo f |xcopy bet_s.json .\server\bet.json /y
echo f |xcopy box_c.json .\client\box.json /y
echo f |xcopy box_s.json .\server\box.json /y
echo f |xcopy hero_c.json .\client\hero.json /y
echo f |xcopy hero_s.json .\server\hero.json /y
echo f |xcopy monster_c.json .\client\monster.json /y
echo f |xcopy monster_s.json .\server\monster.json /y
echo f |xcopy level_c.json .\client\level.json /y
echo f |xcopy level_s.json .\server\level.json /y
echo f |xcopy story_c.json .\client\story.json /y
echo f |xcopy story_s.json .\server\story.json /y
echo f |xcopy skill_c.json .\client\skill.json /y
echo f |xcopy buff_c.json .\client\buff.json /y
echo f |xcopy assets_c.json .\client\assets.json /y
echo f |xcopy role_attribute_c.json .\client\role_attribute.json /y
echo f |xcopy skill_effect_c.json .\client\skill_effect.json /y


:: delete cur dir *.json
del *.json

:: copy client config to client dir
xcopy .\client\*.json ..\..\trunk\client\WorkingCell\assets\resources\json\ /y

:: copy server config to server dir
xcopy .\server\*.json ..\..\trunk\server\bin\launcher\game\cells\ /y

pause
