
let draw = {};


draw.init = function (canvas) {
    draw.canvas = canvas;
    draw.ctx = canvas.getContext("2d");
    draw.staticColorTheme = true;
    draw.cellRGB = [0, 0, 0];
    draw.colorStepVal = 12;
    //static color themes:    
    draw.themes =
        [{ gridColor: "#000000", cellColor: "#505050", background: "#ffffff" },
        { gridColor: "#283905", cellColor: "#98d023", background: "#fbfc37" },
        { gridColor: "#26295a", cellColor: "#e4524f", background: "#f3e737" },
        { gridColor: "#fdd816", cellColor: "#212a31", background: "#ffffff" },
        { gridColor: "#f8af42", cellColor: "#27509e", background: "#ffffff" },
        { gridColor: "#ffffff", cellColor: "#29b297", background: "#ffffff" },
        { gridColor: "#ffffff", cellColor: "#ffffff", background: "#29b297" },
        { gridColor: "#ffffff", cellColor: "#ffffff", background: "#502542" },
        { gridColor: "#ffffff", cellColor: "#ffffff", background: "#e41c2a" },
        { gridColor: "#fbbe18", cellColor: "#e94a54", background: "#20252a" },
        { gridColor: "#2c73b8", cellColor: "#e41d23", background: "#202230" },
        { gridColor: "#2d3439", cellColor: "#f4cb67", background: "#c6ccd2" },
        ];
    draw.currentThemeNum = 0;
}
//dynamic color theme:
//Color format functions:
//RGB->hex:
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
//hex->RGB:
function hexToRgb(hex, resArrRGB) {
    var bigint = parseInt(hex, 16);
    resArrRGB[0] = (bigint >> 16) & 255;
    resArrRGB[1] = (bigint >> 8) & 255;
    resArrRGB[2] = bigint & 255;
}

//dynamicTheme call:
draw.setDynamicTheme = function () {
    draw.staticColorTheme = !(draw.staticColorTheme);
    if (!(draw.staticColorTheme)) {
        draw.dynamicTheme = draw.themes[draw.currentThemeNum];
        hexToRgb(draw.dynamicTheme.cellColor, draw.cellRGB);        
    }
}
//color dynamics:
draw.colorStep = function () {
    draw.cellRGB[0] += draw.colorStepVal;
    if (draw.cellRGB[0] > 255) {
        draw.cellRGB[0] = 255;
        draw.colorStepVal = -12;
    }
    if (draw.cellRGB[0] < 0) {
        draw.cellRGB[0] = 0;
        draw.colorStepVal = 12;
    }

    draw.cellRGB[1] -= draw.colorStepVal/3;
    if (draw.cellRGB[1] > 255) {
        draw.cellRGB[1] = 255;
        draw.colorStepVal = -12;
    }
    if (draw.cellRGB[1] < 0) {
        draw.cellRGB[1] = 0;
        draw.colorStepVal = 12;
    }

    draw.cellRGB[2] -= draw.colorStepVal*2/3;
    if (draw.cellRGB[2] > 255) {
        draw.cellRGB[2] = 255;
        draw.colorStepVal = -12;
    }
    if (draw.cellRGB[2] < 0) {
        draw.cellRGB[2] = 0;
        draw.colorStepVal = 12;
    }


    draw.dynamicTheme.cellColor = rgbToHex(draw.cellRGB[0], draw.cellRGB[1], draw.cellRGB[2]);
}



draw.gridColor = function () {
    if (draw.staticColorTheme) return this.themes[this.currentThemeNum].gridColor;
    else return this.dynamicTheme.gridColor;
}

draw.cellColor = function () {
    if (draw.staticColorTheme) return this.themes[this.currentThemeNum].cellColor;
    else return this.dynamicTheme.cellColor;
}

draw.backgroundColor = function () {
    if (draw.staticColorTheme) return this.themes[this.currentThemeNum].background;
    else return this.dynamicTheme.background;
}


draw.nextTheme = function () {
    if (this.currentThemeNum < this.themes.length - 1) this.currentThemeNum++;
    else this.currentThemeNum = 0;
}

draw.previousTheme = function () {
    if (this.currentThemeNum > 0) this.currentThemeNum--;
    else this.currentThemeNum = this.themes.length - 1;
}

//функция рисования всего:
draw.render = function (array) {
    if (!draw.staticColorTheme) draw.colorStep();
    draw.canvas.style.background = this.backgroundColor();
    this.drawArray(array);
    this.drawGrid(CELL_SIZE, 1, this.gridColor());
}
//функция рисования массива:  
draw.drawArray = function (array) {
    for (i = 0; i < WORLD_WIDTH; i++)
        for (j = 0; j < WORLD_HEIGHT; j++) {
            if (array[i][j] == 1) {
                draw.drawCell(i, j, CELL_SIZE, this.cellColor());
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