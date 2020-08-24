let patterns = {};


patterns.glider = function (array, xPosition, yPosition) {
    x = xPosition || (WORLD_WIDTH * 0.5 - 2);
    y = yPosition || (WORLD_HEIGHT * 0.5 - 2);
    array[x][y] = 1;
    array[x][y + 1] = 1;
    array[x][y + 2] = 1;
    array[x + 1][y + 2] = 1;
    array[x + 2][y + 1] = 1;
}