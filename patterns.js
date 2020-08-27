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

patterns.smallExploder = function (array, xPosition, yPosition) {
    x = xPosition || (WORLD_WIDTH * 0.5 - 2);
    y = yPosition || (WORLD_HEIGHT * 0.5 - 2);
    array[x][y + 1] = 1;
    array[x - 1][y + 1] = 1;
    array[x][y + 2] = 1;
    array[x + 1][y + 1] = 1;
    array[x - 1][y] = 1;
    array[x + 1][y] = 1;
    array[x][y - 1] = 1;
}

patterns.gliderGun = function (array, xPosition, yPosition) {
    x = xPosition || (WORLD_WIDTH * 0.5 - 2);
    y = yPosition || (WORLD_HEIGHT * 0.5 - 2);

    //square 1:
    array[x - 18][y + 6] = 1;
    array[x - 17][y + 6] = 1;
    array[x - 18][y + 5] = 1;
    array[x - 17][y + 5] = 1;

    //central:
    array[x - 8][y + 6] = 1;
    array[x - 8][y + 5] = 1;
    array[x - 8][y + 4] = 1;

    array[x - 7][y + 7] = 1;
    array[x - 7][y + 3] = 1;

    array[x - 6][y + 8] = 1;
    array[x - 6][y + 2] = 1;

    array[x - 5][y + 8] = 1;
    array[x - 5][y + 2] = 1;

    array[x - 4][y + 5] = 1;

    array[x - 3][y + 7] = 1;
    array[x - 3][y + 3] = 1;

    array[x - 2][y + 6] = 1;
    array[x - 2][y + 5] = 1;
    array[x - 2][y + 4] = 1;

    array[x - 1][y + 5] = 1;

    //right:
    array[x + 2][y + 8] = 1;
    array[x + 2][y + 7] = 1;
    array[x + 2][y + 6] = 1;

    array[x + 3][y + 8] = 1;
    array[x + 3][y + 7] = 1;
    array[x + 3][y + 6] = 1;

    array[x + 4][y + 5] = 1;
    array[x + 4][y + 9] = 1;

    array[x + 6][y + 4] = 1;
    array[x + 6][y + 5] = 1;
    array[x + 6][y + 9] = 1;
    array[x + 6][y + 10] = 1;

    //sruare 2:
    array[x + 16][y + 7] = 1;
    array[x + 16][y + 8] = 1;
    array[x + 17][y + 7] = 1;
    array[x + 17][y + 8] = 1;
}

patterns.cell = function (array, xPosition, yPosition) {
    x = xPosition || (WORLD_WIDTH * 0.5 - 2);
    y = yPosition || (WORLD_HEIGHT * 0.5 - 2);
    array[x][y] = 1;
}


//not patterns:
patterns.clear = function (array) {
    for (i = 0; i < WORLD_WIDTH; i++)
        for (j = 0; j < WORLD_HEIGHT; j++)
            array[i][j] = 0;
}

patterns.random = function (array) {
    this.clear(array);
    for (i = 0; i < WORLD_WIDTH; i++)
        for (j = 0; j < WORLD_HEIGHT; j++) {
            if (Math.random() < 0.3) array[i][j] = 1;
        }

}