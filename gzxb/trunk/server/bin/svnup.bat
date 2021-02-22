
echo "update svn code ..."
cd ../../../../../../go_work/src
svn up

echo "update svn config ..."
cd ../../hys/work_cells/gzxb/res/config
svn up
.\convert.bat

pause

