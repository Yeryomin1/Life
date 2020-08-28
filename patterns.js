let patterns = {};

patterns.checkPosition = function (border, inputX, inputY) {
    if (inputX < border.left || inputX >= WORLD_WIDTH - border.right) {
        patterns.errorMessage("X", border.left + 1, WORLD_WIDTH - border.right);
        return false;
    }
    if (inputY < border.top || inputY > WORLD_HEIGHT - border.bottom) {
        patterns.errorMessage("Y", border.bottom, WORLD_HEIGHT - border.top);
        return false;
    }
    return true;
}

patterns.errorMessage = function (param, minVal, maxVal) {
    alert(`The figure breaks the boundaries of the field.
The value of ${param} must be between ${minVal} and ${maxVal}.`);
}


patterns.glider = function (array, xPosition, yPosition) {
    let size = {};
    size.left = 0;
    size.right = 2;
    size.top = 0;
    size.bottom = 3;

    if (!patterns.checkPosition(size, xPosition, yPosition)) return;

    let x = xPosition;
    let y = yPosition;
    array[x][y] = 1;
    array[x][y + 1] = 1;
    array[x][y + 2] = 1;
    array[x + 1][y + 2] = 1;
    array[x + 2][y + 1] = 1;
}

patterns.smallExploder = function (array, xPosition, yPosition) {
    let size = {};
    size.left = 7;
    size.right = 7;
    size.top = 7;
    size.bottom = 9;

    if (!patterns.checkPosition(size, xPosition, yPosition)) return;

    let x = xPosition;
    let y = yPosition;
    array[x][y + 1] = 1;
    array[x - 1][y + 1] = 1;
    array[x][y + 2] = 1;
    array[x + 1][y + 1] = 1;
    array[x - 1][y] = 1;
    array[x + 1][y] = 1;
    array[x][y - 1] = 1;
}

patterns.gliderGun = function (array, xPosition, yPosition) {
    let size = {};
    size.left = 19;
    size.right = 18;
    size.top = 1;
    size.bottom = 12;

    if (!patterns.checkPosition(size, xPosition, yPosition)) return;

    let x = xPosition;
    let y = yPosition;

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
    let size = {};
    size.left = 0;
    size.right = 0;
    size.top = 0;
    size.bottom = 1;

    if (!patterns.checkPosition(size, xPosition, yPosition)) return;

    array[xPosition][yPosition] = 1;
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