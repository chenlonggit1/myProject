
cd ../

start "Cells_HALL" hall.exe -c ./launcher/hall/ -o ./launcher/hall/
start "Cells_GS" gs.exe -c ./launcher/ -f ./launcher/game/cells/ 
start "Cells_WORLD" world.exe -c ./launcher/qp/

ping -n 4 127.0.0.1
start "Cells_Game-1-1" cells.exe -c ./launcher/game/cells/ -g 10095 -a 1 -i 1 -f ./launcher/
start "Cells_Game-1-2" cells.exe -c ./launcher/game/cells/ -g 10095 -a 1 -i 2 -f ./launcher/

start "Cells_Game-1-3" cells.exe -c ./launcher/game/cells/ -g 10095 -a 1 -i 3 -f ./launcher/
start "Cells_Game-1-4" cells.exe -c ./launcher/game/cells/ -g 10095 -a 1 -i 4 -f ./launcher/

rem start "Cells_Game-2-1" cells.exe -c ./launcher/game/cells/ -g 10095 -a 2 -i 1 -f ./launcher/
rem start "Cells_Game-2-2" cells.exe -c ./launcher/game/cells/ -g 10095 -a 2 -i 2 -f ./launcher/

