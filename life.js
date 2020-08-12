        window.onload = function(){
            var canvas = document.getElementById("drawingCanvas");
            var context = canvas.getContext("2d");

        //код рисования
        //размер поля:
        const CELL_SIZE = 10;
        const WORLD_WIDTH = 640/CELL_SIZE;
        const WORLD_HEIGHT = 480/CELL_SIZE;


        //массив клеток:
        let arr = [];
        let i = 0;
        let j = 0;

        for( ;i<WORLD_WIDTH; i++)
        arr.push([]);
        for(i = 0;i<WORLD_WIDTH; i++)       
        for(j = 0;j<WORLD_HEIGHT; j++)
        arr[i].push(0);
//объект игры:
        let game = {};
    //поля:        
        game.model = arr;//сделать "закрытым" полем
        game._stop = true;
        game._freq = 2;        //частота обновления:
        game.windows = {};

    //интерфейс объекта:
        game.freqUp = function(){
            if(this._freq==32) alert("Maximum speed reached");
            else {
                this._freq *= 2;
                clearInterval(interval);
                interval = setInterval(this.draw, 1000/this._freq);
            }
            document.getElementById("frequency").innerHTML = "Частота обновления: " + this._freq + " Гц";
        };
        
        game.freqDown = function(){
            if(this._freq==1) alert("Minimum speed reached");
            else {
                this._freq /= 2;
                clearInterval(interval);
                interval = setInterval(this.draw, 1000/this._freq);
            }
            document.getElementById("frequency").innerHTML = "Частота обновления: " + this._freq + " Гц";
        }

        game.setStop = function(command){
            game._stop = command;
        }

        game.draw = function() {
            //рисование:
            context.clearRect(0, 0, canvas.width, canvas.height);

            //перерисовка:
            drawLife(game.model);
            game.model = game.nextGenerationModel(game.model);           
        }



        //функция преобразования массива на шаг вперед:        
        game.nextGenerationModel = function (array){//лишняя передача аргумента, для метода не нужно
            //проверка состояния "Пауза":
            if(game._stop) return array;
            //реализуются правила игры:
            let result = [];
            for (let i = 0; i < array.length; i++)
            result.push(array[i].slice());
    
            let summs = summArray(array);
            for(i = 0;i<WORLD_WIDTH; i++)
                for(j = 0;j<WORLD_HEIGHT; j++){
                    if(array[i][j]==1){
                        if(summs[i][j]!=2&&summs[i][j]!=3)
                        result[i][j] = 0;
                    }
                    else if(summs[i][j]==3)result[i][j] = 1;
                }
        return result;
        }

        game.addGlider = function (xPosition, yPosition){//переместить определение функции к собратьям
                x = xPosition||(WORLD_WIDTH*0.5-2);
                y = yPosition||(WORLD_HEIGHT*0.5-2);
                game.model[x][y] = 1;
                game.model[x][y+1] = 1;
                game.model[x][y+2] = 1;
                game.model[x+1][y+2] = 1;
                game.model[x+2][y+1] = 1;   
        }

            //обработка нажатий на кнопки:
                //главное меню:
        setStop.onclick = function(){
                game.setStop(true);
        }
        
        setStart.onclick = function(){
                game.setStop(false);
        }

        addGlider.onclick = function(){
            game.addGlider();
        }

        add.onclick =  function(){
            let userX = Number(prompt("Введите х левого верхнего угла глайдера", String(WORLD_WIDTH*0.5-2)))-1;
            let userY = Number(prompt("Введите y левого верхнего угла глайдера",String(WORLD_HEIGHT*0.5-2)));            
            game.addGlider(userX, WORLD_HEIGHT-userY);
        }

        speedModalWindow.onclick = function () {        
            game.windows._modal.style.display = "block";
            game.windows.speedModal.style.display = "block";            
            document.getElementById("frequency").innerHTML = "Частота обновления: " + game._freq + " Гц"; 
        }

        addModalWindow.onclick = function () {      
            game.windows._modal.style.display = "block";
            game.windows.addModal.style.display = "block";
        }

                //кнопки окон:
        faster.onclick = function(){
            game.freqUp();
        }

        slower.onclick = function(){
            game.freqDown();
        }
//цикл игры: 
                
        let interval = setInterval(game.draw, 1000/game._freq);


//глобальные функции(не сделать ли методами?)
        function summArray(array){
            let res = [];
            for (let i = 0; i < array.length; i++)
            res.push(array[i].slice());

            for(i = 1;i<WORLD_WIDTH - 1; i++)//перебор игнорирует граничные столбцы и строки, чтобы не цеплять undefined
                for(j = 1;j<WORLD_HEIGHT - 1; j++){
                    res[i][j] = array[i-1][j-1]+array[i][j-1]+array[i+1][j-1]+
                                array[i-1][j]       +         array[i+1][j]+
                                array[i-1][j+1]+array[i][j+1]+array[i+1][j+1];
                }             
            return res;
        }
        //функция рисования всего:
        function drawLife(array){
            drawArray(array);
            drawGrid(10, 1, "rgb(100, 100, 100)");            
        }
         //функция рисования массива:  
         function drawArray(array){
            for(i = 0;i<WORLD_WIDTH; i++)
                for(j = 0;j<WORLD_HEIGHT; j++){
                    if (array[i][j]==1){
                        drawCell(i, j, 10, "rgb(255, 0, 0)");                              
                    }
                }             
            }    
        //функция рисования клетки:
        function drawCell(xPos, yPos, cellSize, cellColor){
            context.beginPath();
            //настройка линии:            
            context.lineWidth = cellSize;
            context.strokeStyle = cellColor;
            context.lineCap = "butt"; 

            context.moveTo(cellSize*xPos, cellSize*(yPos+0.5));
            context.lineTo(cellSize*(xPos+1),cellSize*(yPos+0.5));
            context.stroke();            
        }        
        //функция рисования сетки:
        function drawGrid(cellSize, thickness, gridColor){
            context.beginPath();
            //настройка линии:            
            context.lineWidth = thickness;
            context.strokeStyle = gridColor;
            context.lineCap = "butt";

            for(let count = 0; count<WORLD_WIDTH; count++){
                context.moveTo(cellSize*count, 0);
                context.lineTo(cellSize*count,cellSize*WORLD_HEIGHT);
                context.stroke();                
            }
            for(count = 0; count<WORLD_HEIGHT; count++){
                context.moveTo(0, cellSize*count);
                context.lineTo(cellSize*WORLD_WIDTH,cellSize*count);
                context.stroke();                
            } 
        }
        
//модальное окно для управления:
    game.windows._modal = document.getElementById("modalWindow");
    //дочерние окна управления:
    game.windows.speedModal = document.getElementById("speedWindow");
    game.windows.addModal = document.getElementById("addWindow");
    //"Х" закрытия окон:
    game.windows.speedSpan = document.getElementsByClassName("closeModalWindow")[0];
    game.windows.addSpan = document.getElementsByClassName("closeModalWindow")[1];

    //окно скорости:   
    game.windows.speedSpan.onclick = function () {
        game.windows.speedModal.style.display = "none";        
        if(game.windows.speedModal.style.display == game.windows.addModal.style.display){
        game.windows._modal.style.display = "none";            
        }
    }
    //окно добавления:
    game.windows.addSpan.onclick = function () {
        game.windows.addModal.style.display = "none";        
        if(game.windows.speedModal.style.display == game.windows.addModal.style.display){
        game.windows._modal.style.display = "none";            
        }

    }    
    //клик по фону, закрытие окон:   
    window.onclick = function (event) {
       if (event.target == game.windows._modal) game.windows._modal.style.display = "none";
   }
          
    };
    

