    
    let draw = {};
        //функция рисования всего:
        function drawLife(context, array) {
            drawArray(context, array);
            drawGrid(context, 10, 1, "rgb(100, 100, 100)");
        }
        //функция рисования массива:  
        function drawArray(context, array) {
            for (i = 0; i < WORLD_WIDTH; i++)
                for (j = 0; j < WORLD_HEIGHT; j++) {
                    if (array[i][j] == 1) {
                        drawCell(context, i, j, 10, "rgb(255, 0, 0)");
                    }
                }
        }
        //функция рисования клетки:
        function drawCell(context, xPos, yPos, cellSize, cellColor) {
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
    function drawGrid(context, cellSize, thickness, gridColor) {
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