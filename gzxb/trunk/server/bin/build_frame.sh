
echo "build code ..."


cd ../../../../../../go_work/src/git.huoys.com/qp

cd ./hall
echo "build hall ..."
go build
cp hall.exe ./bin
cp hall.exe ../../../../../hys/work_cells/gzxb/trunk/server/bin

cd ../gs
echo "build gs ..."
go build
cp gs.exe ./bin
cp gs.exe ../../../../../hys/work_cells/gzxb/trunk/server/bin

cd ../world
echo "build world ..."
go build
cp world.exe ./bin
cp world.exe ../../../../../hys/work_cells/gzxb/trunk/server/bin


read -p "任意键继续..."

