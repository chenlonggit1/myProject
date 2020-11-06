
### 写入渠道信息
java -jar [jar包路径] put -c [渠道名] [原apk路径] [生成apk路径] -e [扩展信息：key1=val1,key2=val2]
demo: java -jar ./walle-cli-all.jar put -c kys ./doudiju-release.apk ./doudiju-release-out.apk -e id=123,key=val
### 查看渠道信息
java -jar [jar路径] show [apk路径]
demo: java -jar ./walle-cli-all.jar show ./doudiju-kys.apk
### 安装apk
adb install -r [apk路径]
demo: adb install -r ./doudiju-kys.apk