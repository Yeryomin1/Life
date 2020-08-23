window.onload = function () {

    var canvas = document.getElementById("drawingCanvas");
    var context = canvas.getContext("2d");


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

    //поля:        
    game.model = arr;//сделать "закрытым" полем
    game._stop = true;
    game._freq = 2;        //частота обновления:
    game.prescribedFreq = 2;
    game.windows = {};
    game.plotData = [];
    game.stepNum = 0;
    game.fullElapsed = 0;

    //интерфейс объекта:
    game.freqUp = function () {

        this._freq *= 2;
        clearInterval(interval);
        interval = setInterval(this.run, 1000 / this._freq);
        game.lastFreqChangeTime = performance.now();

        document.getElementById("frequency").innerHTML =
            "Current frequency: " + this._freq + " Hz" + "<br>"
            + "Prescribed frequency: " + this.prescribedFreq + " Hz";
    };

    game.freqDown = function () {

        this._freq /= 2;
        clearInterval(interval);
        interval = setInterval(this.run, 1000 / this._freq);
        game.lastFreqChangeTime = performance.now();

        document.getElementById("frequency").innerHTML =
            "Current frequency: " + this._freq + " Hz" + "<br>"
            + "Prescribed frequency: " + this.prescribedFreq + " Hz";
    }

    game.setStop = function (command) {
        game._stop = command;
    }

    game.run = function () {

        //timing:
        if (game.stepNum) {
            game.fullElapsed = (performance.now() - game.current) / 1000;
        }
        game.current = performance.now();

        //рисование:
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        //перерисовка:
        drawLife(game.model);
        plot.draw(game.plotData, game.stepNum, context);
        game.model = game.nextGenerationModel();



        //time auto control:
        //iteration time, seconds:
        game.elapsed = (performance.now() - game.current) / 1000;
        //check, full iteration time and time from the moment of frequency increase
        if (1.1 / game.fullElapsed < game._freq
            && game.current - game.lastFreqChangeTime > 2000)
            game.freqDown();
        //compare current frequency and required one
        //check full iteration time, possibility of acceleration

        if (game.prescribedFreq > game._freq
            && 0.4 / game.elapsed > game._freq
            && game.current - game.lastFreqChangeTime > 2000)
            game.freqUp();

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
        document.getElementById("frequency").innerHTML =
            "Current frequency: " + game._freq + " Hz" + "<br>"
            + "Prescribed frequency: " + game.prescribedFreq + " Hz";
    }

    addModalWindow.onclick = function () {
        game.windows._modal.style.display = "block";
        game.windows.addModal.style.display = "block";
    }

    //кнопки окон:
    faster.onclick = function () {
        if (this._freq * 2 > 1 / game.elapsed) alert("Maximum speed reached");
        else {
            game.prescribedFreq = game._freq * 2;
            game.freqUp();
        }

    }

    slower.onclick = function () {
        game.prescribedFreq = game._freq / 2;
        game.freqDown();
    }

    //цикл игры: 

    let interval = setInterval(game.run, 1000 / game._freq);

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