window.onload = function () {
    var canvas = document.getElementById("drawingCanvas");
    var context = canvas.getContext("2d");

    //код рисования
    //размер поля:
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const PLOT_HEIGHT = 100;
    const ORIGIN_Y = 20;
    const ORIGIN_X = 40;

    const CELL_SIZE = 10;
    const WORLD_WIDTH = CANVAS_WIDTH / CELL_SIZE;
    const WORLD_HEIGHT = (CANVAS_HEIGHT - PLOT_HEIGHT) / CELL_SIZE;


    //массив клеток:
    let arr = [];
    let i = 0;
    let j = 0;

    for (; i < WORLD_WIDTH; i++)
        arr.push([]);
    for (i = 0; i < WORLD_WIDTH; i++)
        for (j = 0; j < WORLD_HEIGHT; j++)
            arr[i].push(0);
    //объекты:
    let game = {};
    let plot = {};

    //поля:        
    game.model = arr;//сделать "закрытым" полем
    game._stop = true;
    game._freq = 2;        //частота обновления:
    game.windows = {};
    game.plotData = [];
    game.stepNum = 0;

    //интерфейс объекта:
    game.freqUp = function () {
        if (this._freq == 32) alert("Maximum speed reached");
        else {
            this._freq *= 2;
            clearInterval(interval);
            interval = setInterval(this.draw, 1000 / this._freq);
        }
        document.getElementById("frequency").innerHTML = "frequency: " + this._freq + " Hz";//улучшить перевод
    };

    game.freqDown = function () {
        if (this._freq == 1) alert("Minimum speed reached");
        else {
            this._freq /= 2;
            clearInterval(interval);
            interval = setInterval(this.draw, 1000 / this._freq);
        }
        document.getElementById("frequency").innerHTML = "frequency: " + this._freq + " Hz";//улучшить перевод
    }

    game.setStop = function (command) {
        game._stop = command;
    }

    game.draw = function () {
        //рисование:
        context.clearRect(0, 0, canvas.width, canvas.height);

        //перерисовка:
        drawLife(game.model);
        plot.draw(game.plotData, game.stepNum);

        /*
    if(game.stepNum>10){
        alert(game.stepNum);
        alert(game.plotData[game.stepNum]);    
    }
    */


        game.model = game.nextGenerationModel();
    }



    //функция преобразования массива на шаг вперед:        
    game.nextGenerationModel = function () {
        //проверка состояния "Пауза":
        if (game._stop) return this.model;
        game.stepNum++;
        //реализуются правила игры:
        let result = [];
        for (let i = 0; i < this.model.length; i++)
            result.push(this.model[i].slice());
        let total = 0;
        let summs = summArray(this.model);
        for (i = 0; i < WORLD_WIDTH; i++)
            for (j = 0; j < WORLD_HEIGHT; j++) {
                if (this.model[i][j] == 1) {
                    if (summs[i][j] != 2 && summs[i][j] != 3)
                        result[i][j] = 0;
                    else total++;
                }
                else if (summs[i][j] == 3) {
                    result[i][j] = 1;
                    total++;
                }
            }

        if (game.stepNum > 100) game.plotData.shift();
        game.plotData.push(total);
        return result;
    }

    game.addGlider = function (xPosition, yPosition) {//переместить определение функции к собратьям
        x = xPosition || (WORLD_WIDTH * 0.5 - 2);
        y = yPosition || (WORLD_HEIGHT * 0.5 - 2);
        game.model[x][y] = 1;
        game.model[x][y + 1] = 1;
        game.model[x][y + 2] = 1;
        game.model[x + 1][y + 2] = 1;
        game.model[x + 2][y + 1] = 1;
    }

    //обработка нажатий на кнопки:
    //главное меню:
    setStop.onclick = function () {
        game.setStop(true);
    }

    setStart.onclick = function () {
        game.setStop(false);
    }

    addGlider.onclick = function () {
        game.addGlider();
    }

    add.onclick = function () {
        let userX = Number(prompt("Enter the abscissa of the upper-left corner of the glider", String(WORLD_WIDTH * 0.5 - 2))) - 1;
        let userY = Number(prompt("Enter the ordinate of the upper-left corner of the glider", String(WORLD_HEIGHT * 0.5 - 2)));
        game.addGlider(userX, WORLD_HEIGHT - userY);
    }

    speedModalWindow.onclick = function () {
        game.windows._modal.style.display = "block";
        game.windows.speedModal.style.display = "block";
        document.getElementById("frequency").innerHTML = "frequency: " + game._freq + " Hz";
    }

    addModalWindow.onclick = function () {
        game.windows._modal.style.display = "block";
        game.windows.addModal.style.display = "block";
    }

    //кнопки окон:
    faster.onclick = function () {
        game.freqUp();
    }

    slower.onclick = function () {
        game.freqDown();
    }


    //методы графика:
    plot.draw = function (data, steps) {
        plot.drawAxisX(100, steps);
        plot.drawAxisY();
        plot.drawData(data, steps);
    }

    plot.drawAxisX = function (maxX, stepsNumber) {
        let range = maxX;
        let powerOfTen = 0;
        while (range > 10) {
            range /= 10;
            powerOfTen++;
        }

        //alert(range);
        //alert(powerOfTen);
        range = Math.ceil(range) * Math.pow(10, powerOfTen);


        //alert("result " + range);




        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.lineCap = "butt";
        //axis line:
        context.moveTo(0, CANVAS_HEIGHT - ORIGIN_Y);
        context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - ORIGIN_Y);
        context.stroke();
        //score:
        let scoreStep = (CANVAS_WIDTH - ORIGIN_X) / 6;
        let labelLength = 8;
        for (let i = 1; i < 6; i++) {
            context.moveTo(ORIGIN_X + i * scoreStep, CANVAS_HEIGHT - ORIGIN_Y - labelLength / 2);
            context.lineTo(ORIGIN_X + i * scoreStep, CANVAS_HEIGHT - ORIGIN_Y + labelLength / 2);
            context.stroke();
        }
        //text labels:
        let displacement = 0;
        if (stepsNumber > 90) displacement = stepsNumber - 90;
        context.fillStyle = "black";
        context.font = "10pt Arial";
        for (let i = 1; i < 6; i++) {
            context.fillText(displacement + i * range / 5, ORIGIN_X + i * scoreStep - 5, CANVAS_HEIGHT - ORIGIN_Y + labelLength / 2 + 12);
        }


    }

    plot.drawAxisY = function () {
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.lineCap = "butt";
        //axis line:
        context.moveTo(ORIGIN_X, CANVAS_HEIGHT);
        context.lineTo(ORIGIN_X, CANVAS_HEIGHT - PLOT_HEIGHT);
        context.stroke();
        //score:
        let scoreStep = (PLOT_HEIGHT - ORIGIN_Y) / 3;
        let labelLength = 8;
        for (let i = 1; i < 3; i++) {
            context.moveTo(ORIGIN_X - labelLength / 2, CANVAS_HEIGHT - ORIGIN_Y - i * scoreStep);
            context.lineTo(ORIGIN_X + labelLength / 2, CANVAS_HEIGHT - ORIGIN_Y - i * scoreStep);
            context.stroke();
        }

    }

    plot.drawData = function (dataArr, stepsNum) {
        let columnWidth = (CANVAS_WIDTH - ORIGIN_X) / 120;
        context.beginPath();
        context.lineWidth = 5;
        context.strokeStyle = "red";
        context.lineCap = "butt";

        for (let i = 1; i <= stepsNum; i++) {
            //data point column line:

            context.moveTo(ORIGIN_X + i * columnWidth, CANVAS_HEIGHT - ORIGIN_Y);
            context.lineTo(ORIGIN_X + i * columnWidth, CANVAS_HEIGHT - ORIGIN_Y - dataArr[i - 1]);
            context.stroke();
        }

    }



    //цикл игры: 

    let interval = setInterval(game.draw, 1000 / game._freq);


    //глобальные функции(не сделать ли методами?)
    function summArray(array) {
        let res = [];
        for (let i = 0; i < array.length; i++)
            res.push(array[i].slice());

        for (i = 1; i < WORLD_WIDTH - 1; i++)//перебор игнорирует граничные столбцы и строки, чтобы не цеплять undefined
            for (j = 1; j < WORLD_HEIGHT - 1; j++) {
                res[i][j] = array[i - 1][j - 1] + array[i][j - 1] + array[i + 1][j - 1] +
                    array[i - 1][j] + array[i + 1][j] +
                    array[i - 1][j + 1] + array[i][j + 1] + array[i + 1][j + 1];
            }
        return res;
    }
    //функция рисования всего:
    function drawLife(array) {
        drawArray(array);
        drawGrid(10, 1, "rgb(100, 100, 100)");
    }
    //функция рисования массива:  
    function drawArray(array) {
        for (i = 0; i < WORLD_WIDTH; i++)
            for (j = 0; j < WORLD_HEIGHT; j++) {
                if (array[i][j] == 1) {
                    drawCell(i, j, 10, "rgb(255, 0, 0)");
                }
            }
    }
    //функция рисования клетки:
    function drawCell(xPos, yPos, cellSize, cellColor) {
        context.beginPath();
        //настройка линии:            
        context.lineWidth = cellSize;
        context.strokeStyle = cellColor;
        context.lineCap = "butt";

        context.moveTo(cellSize * xPos, cellSize * (yPos + 0.5));
        context.lineTo(cellSize * (xPos + 1), cellSize * (yPos + 0.5));
        context.stroke();
    }
    //функция рисования сетки:
    function drawGrid(cellSize, thickness, gridColor) {
        context.beginPath();
        //настройка линии:            
        context.lineWidth = thickness;
        context.strokeStyle = gridColor;
        context.lineCap = "butt";

        for (let count = 0; count < WORLD_WIDTH; count++) {
            context.moveTo(cellSize * count, 0);
            context.lineTo(cellSize * count, cellSize * WORLD_HEIGHT);
            context.stroke();
        }
        for (count = 0; count < WORLD_HEIGHT; count++) {
            context.moveTo(0, cellSize * count);
            context.lineTo(cellSize * WORLD_WIDTH, cellSize * count);
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
        if (game.windows.speedModal.style.display == game.windows.addModal.style.display) {
            game.windows._modal.style.display = "none";
        }
    }
    //окно добавления:
    game.windows.addSpan.onclick = function () {
        game.windows.addModal.style.display = "none";
        if (game.windows.speedModal.style.display == game.windows.addModal.style.display) {
            game.windows._modal.style.display = "none";
        }

    }
    //клик по фону, закрытие окон:   
    window.onclick = function (event) {
        if (event.target == game.windows._modal) game.windows._modal.style.display = "none";
    }

};