

echo "build debug cells ..."
cd ../../../../../../go_work/src/git.huoys.com/qp
cd ./cells

go build
cp cells.exe ./bin
cp cells.exe ../../../../../hys/work_cells/gzxb/trunk/server/bin

read -p "任意键继续..."

