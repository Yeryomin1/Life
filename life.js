window.onload = function () {

    var canvas = document.getElementById("drawingCanvas");
    var context = canvas.getContext("2d");

    draw.init(canvas);

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
        draw.render(game.model);
        plot.draw(game.plotData, game.stepNum, context, draw.gridColor(), draw.cellColor());
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


    //обработка нажатий на кнопки:
    //главное меню:
    setStop.onclick = function () {
        game.setStop(true);
    }

    setStart.onclick = function () {
        game.setStop(false);
    }

    clear.onclick = function () {
        patterns.clear(game.model);
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

    colorModalWindow.onclick = function () {
        game.windows._modal.style.display = "block";
        game.windows.colorModal.style.display = "block";
    }


    randomize.onclick = function () {
        let intensity = Number(prompt("Enter the intensity (%) of randomization", 40));
        while (isNaN(intensity) || intensity <= 0 || intensity > 100) {
            alert("Enter a number from 1 to 100");
            intensity = Number(prompt("Enter the intensity (%) of randomization", 40));
        }
        patterns.random(game.model, intensity);
    }

    //patterns adding:
    addGlider.onclick = function () {
        let userX = Number(prompt("Enter the abscissa of the upper-left corner of the glider", String(WORLD_WIDTH * 0.5 - 2))) - 1;
        let userY = Number(prompt("Enter the ordinate of the upper-left corner of the glider", String(WORLD_HEIGHT * 0.5 - 2)));
        patterns.glider(game.model, userX, WORLD_HEIGHT - userY);
    }
    addSmallExploder.onclick = function () {
        let userX = Number(prompt("Enter the abscissa of the center of the Exploder", String(WORLD_WIDTH * 0.5 - 2))) - 1;
        let userY = Number(prompt("Enter the ordinate of the center of the Exploder", String(WORLD_HEIGHT * 0.5 - 2)));
        patterns.smallExploder(game.model, userX, WORLD_HEIGHT - userY);
    }
    addGrosperGun.onclick = function () {
        let userX = Number(prompt("Enter the abscissa of the center of the gun", String(WORLD_WIDTH * 0.5 - 2))) - 1;
        let userY = Number(prompt("Enter the ordinate of the center of the gun", String(WORLD_HEIGHT * 0.5 - 2)));
        patterns.gliderGun(game.model, userX, WORLD_HEIGHT - userY);
    }
    addCell.onclick = function () {
        let userX = Number(prompt("Enter the abscissa of the cell", String(WORLD_WIDTH * 0.5 - 2))) - 1;
        let userY = Number(prompt("Enter the ordinate of the cell", String(WORLD_HEIGHT * 0.5 - 2)));
        patterns.cell(game.model, userX, WORLD_HEIGHT - userY);
    }
    //frequency control:
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

    //color control:
    previousTheme.onclick = function () {
        draw.previousTheme();
    }

    nextTheme.onclick = function () {
        draw.nextTheme();
    }

    dynamicTheme.onclick = function () {
        draw.setDynamicTheme();
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



    //модальное окно для управления:
    game.windows._modal = document.getElementById("modalWindow");
    //дочерние окна управления:
    game.windows.speedModal = document.getElementById("speedWindow");
    game.windows.addModal = document.getElementById("addWindow");
    game.windows.colorModal = document.getElementById("colorWindow");



    //"Х" закрытия окон:
    let close = document.getElementsByClassName("closeModalWindow");
    game.windows.speedSpan = close[0];
    game.windows.addSpan = close[1];
    game.windows.colorSpan = close[2];




    //окно скорости:   
    game.windows.speedSpan.onclick = function () {
        game.windows.speedModal.style.display = "none";
        if (game.windows.addModal.style.display != "block" &&
            game.windows.colorModal.style.display != "block") {
            game.windows._modal.style.display = "none";
        }
    }
    //окно добавления:
    game.windows.addSpan.onclick = function () {
        game.windows.addModal.style.display = "none";
        if (game.windows.speedModal.style.display != "block" &&
            game.windows.colorModal.style.display != "block") {
            game.windows._modal.style.display = "none";
        }

    }
    //окно цветов:
    game.windows.colorSpan.onclick = function () {
        game.windows.colorModal.style.display = "none";
        if (game.windows.addModal.style.display != "block" &&
            game.windows.speedModal.style.display != "block") {
            game.windows._modal.style.display = "none";
        }

    }

    //клик по фону, закрытие окон:   
    window.onclick = function (event) {
        if (event.target == game.windows._modal) game.windows._modal.style.display = "none";
    }

};