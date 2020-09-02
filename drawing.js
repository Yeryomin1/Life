
let draw = {};

//color theme:
/*
draw.init = function(){
draw.theme = {gridColor: "red", cellColor: "blue"};
alert("ggg");
alert(this.theme.gridColor);    
}
*/
draw.init = function (canvas) {
    draw.canvas = canvas;
    draw.ctx = canvas.getContext("2d");
    draw.themes = [{ gridColor: "#fdd816", cellColor: "#212a31", background: "#ffffff" },
    { gridColor: "#26295a", cellColor: "#e4524f", background: "#f3e737" },
    { gridColor: "#f8af42", cellColor: "#27509e", background: "#ffffff" },
    { gridColor: "#ffffff", cellColor: "#29b297", background: "#ffffff" },
    ];
    draw.currentThemeNum = 0;
}

draw.nextTheme = function () {
    if (this.currentThemeNum < this.themes.length - 1) this.currentThemeNum++;
    else this.currentThemeNum = 0;
}

//функция рисования всего:
draw.render = function (array) {
    draw.canvas.style.background = this.themes[this.currentThemeNum].background;
    this.drawArray(array);
    this.drawGrid(CELL_SIZE, 1, this.themes[this.currentThemeNum].gridColor);
}
//функция рисования массива:  
draw.drawArray = function (array) {
    for (i = 0; i < WORLD_WIDTH; i++)
        for (j = 0; j < WORLD_HEIGHT; j++) {
            if (array[i][j] == 1) {
                draw.drawCell(i, j, CELL_SIZE, this.themes[this.currentThemeNum].cellColor);
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
    for (count = 0; count <= WORLD_HEIGHT; count++) {
        this.ctx.moveTo(0, cellSize * count);
        this.ctx.lineTo(cellSize * WORLD_WIDTH, cellSize * count);
        this.ctx.stroke();
    }
}