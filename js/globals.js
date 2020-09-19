//размер поля в пикселях:
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
//размер ячейки в пикселях:
const CELL_SIZE = 5;
//размеры поля в ячейках:
const WORLD_WIDTH = CANVAS_WIDTH / CELL_SIZE;
const PLOT_HEIGHT = 100;//высота графика в пикселях
const WORLD_HEIGHT = (CANVAS_HEIGHT - PLOT_HEIGHT) / CELL_SIZE;