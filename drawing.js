
let draw = {};


draw.zoomIn = function () {
    if (draw.zoom < 10) {
        draw.zoom++;
        draw.cellSize = CELL_SIZE * draw.zoom;
        draw.displacementX = Math.floor(0.5 * WORLD_WIDTH * (draw.zoom - 1) / draw.zoom);
        draw.displacementY = Math.floor(0.5 * WORLD_HEIGHT * (draw.zoom - 1) / draw.zoom);
    }
    else alert("Maximum zoom reached");
}

draw.zoomOut = function () {
    if (draw.zoom > 1) {
        draw.zoom--;
        draw.cellSize = CELL_SIZE * draw.zoom;
        draw.displacementX = Math.floor(0.5 * WORLD_WIDTH * (draw.zoom - 1) / draw.zoom);
        draw.displacementY = Math.floor(0.5 * WORLD_HEIGHT * (draw.zoom - 1) / draw.zoom);
    }
    else alert("Basic zoom reached");
}



draw.init = function (canvas) {
    draw.canvas = canvas;
    draw.ctx = canvas.getContext("2d");
    draw.staticColorTheme = true;
    draw.cellRGB = [100, 100, 100];
    draw.colorStepVal = 20;
    draw.cellSize = CELL_SIZE;
    draw.zoom = 1;
    draw.displacementX = 0;
    draw.displacementY = 0;
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
    let bigint = parseInt(hex, 16);
    resArrRGB[2] = bigint % 256;
    bigint -= resArrRGB[2];
    bigint /= 256;
    resArrRGB[1] = bigint % 256;
    bigint -= resArrRGB[1];
    resArrRGB[0] = bigint / 256;
}


//dynamicTheme call:
draw.setDynamicTheme = function () {
    draw.staticColorTheme = !(draw.staticColorTheme);
    if (!(draw.staticColorTheme)) {
        draw.dynamicTheme = draw.themes[draw.currentThemeNum];
        hexToRgb(draw.dynamicTheme.cellColor.slice(1), draw.cellRGB);
        let y = 0.2126 * draw.cellRGB[0] + 0.7152 * draw.cellRGB[1] + 0.0722 * draw.cellRGB[2];
        if (y > 0.95) {
            draw.cellRGB[0] -= draw.colorStepVal;
            draw.cellRGB[1] -= draw.colorStepVal;
            draw.cellRGB[2] -= draw.colorStepVal;
        }
        if (y < 0.05) {
            draw.cellRGB[0] += draw.colorStepVal;
            draw.cellRGB[1] += draw.colorStepVal;
            draw.cellRGB[2] += draw.colorStepVal;
        }
    }
}
//color dynamics:
draw.colorStep = function () {
    let done = false;
    while (!done) {
        let deltaR = Math.round((Math.random() - 0.5) * draw.colorStepVal);
        let deltaG = Math.round((Math.random() - 0.5) * draw.colorStepVal);
        let deltaB = - (deltaR + deltaG);

        let enoughSpaceR = (draw.cellRGB[0] + deltaR <= 255 && draw.cellRGB[0] + deltaR >= 0);
        let enoughSpaceG = (draw.cellRGB[1] + deltaG <= 255 && draw.cellRGB[1] + deltaG >= 0);
        let enoughSpaceB = (draw.cellRGB[2] + deltaB <= 255 && draw.cellRGB[2] + deltaB >= 0);

        if (enoughSpaceR && enoughSpaceG && enoughSpaceB) {
            draw.cellRGB[0] += deltaR;
            draw.cellRGB[1] += deltaG;
            draw.cellRGB[2] += deltaB;
            done = true;
        }
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
    this.drawGrid(draw.cellSize, 1, this.gridColor());
}
//функция рисования массива:  
draw.drawArray = function (array) {
    for (i = 0; i < Math.ceil(WORLD_WIDTH / draw.zoom); i++)
        for (j = 0; j < Math.ceil(WORLD_HEIGHT / draw.zoom); j++) {
            if (array[i + draw.displacementX][j + draw.displacementY] == 1) {
                draw.drawCell(i, j, draw.cellSize, this.cellColor());
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

    for (let count = 0; count <= WORLD_WIDTH - 2 * draw.displacementX; count++) {
        this.ctx.moveTo(cellSize * count, 0);
        this.ctx.lineTo(cellSize * count, cellSize * (WORLD_HEIGHT - 2 * draw.displacementY));
        this.ctx.stroke();
    }
    for (count = 0; count <= WORLD_HEIGHT - 2 * draw.displacementY; count++) {
        this.ctx.moveTo(0, cellSize * count);
        this.ctx.lineTo(cellSize * (WORLD_WIDTH - 2 * draw.displacementX), cellSize * count);
        this.ctx.stroke();
    }
}