

echo "update git code ..."

cd ../../../../../../go_work/src/git.huoys.com

echo "update git.huoys.com/game/common"
cd ./game/common
git checkout master 
git pull

echo "update git.huoys.com/qp/common"
cd ../../qp/common
git checkout master
git pull

echo "update git.huoys.com/qp/hall"
cd ../hall
git checkout master
git pull

echo "update git.huoys.com/qp/gs"
cd ../gs
git checkout master
git pull

echo "update git.huoys.com/qp/world"
cd ../world
git checkout master
git pull


read -p "任意键继续..."


