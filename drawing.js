
let draw = {};

//функция рисования всего:
draw.render = function (context, array) {
    this.ctx = context;
    this.drawArray(array);
    this.drawGrid(10, 1, "rgb(100, 100, 100)");
}
//функция рисования массива:  
draw.drawArray = function (array) {
    for (i = 0; i < WORLD_WIDTH; i++)
        for (j = 0; j < WORLD_HEIGHT; j++) {
            if (array[i][j] == 1) {
                draw.drawCell(i, j, 10, "rgb(255, 0, 0)");
            }
        }
}
//функция рисования клетки:
draw.drawCell = function (xPos, yPos, cellSize, cellColor) {
    this.ctx.beginPath();
    //настройка линии:            
    this.ctx.lineWidth = cellSize;
    this.ctx.strokeStyle = cellColor;
    this.ctx.lineCap = "butt";

    this.ctx.moveTo(cellSize * xPos, cellSize * (yPos + 0.5));
    this.ctx.lineTo(cellSize * (xPos + 1), cellSize * (yPos + 0.5));
    this.ctx.stroke();
}
//функция рисования сетки:
draw.drawGrid = function (cellSize, thickness, gridColor) {
    this.ctx.beginPath();
    //настройка линии:            
    this.ctx.lineWidth = thickness;
    this.ctx.strokeStyle = gridColor;
    this.ctx.lineCap = "butt";

    for (let count = 0; count < WORLD_WIDTH; count++) {
        this.ctx.moveTo(cellSize * count, 0);
        this.ctx.lineTo(cellSize * count, cellSize * WORLD_HEIGHT);
        this.ctx.stroke();
    }
    for (count = 0; count < WORLD_HEIGHT; count++) {
        this.ctx.moveTo(0, cellSize * count);
        this.ctx.lineTo(cellSize * WORLD_WIDTH, cellSize * count);
        this.ctx.stroke();
    }
}