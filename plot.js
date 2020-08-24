
//const ORIGIN_Y = 20;
//const ORIGIN_X = 40;

let plot = {};
plot.maxVal = 20;
plot.originX = 40;
plot.originY = 20;


plot.draw = function (data, steps, context) {
    plot.ctx = context;
    plot.setRanges(data);
    plot.drawAxisX(steps);
    plot.drawAxisY();
    plot.drawData(data, steps);
}

plot.setRanges = function (data) {
    plot.xRange = plot.range(100);


    if (plot.maxVal < data[data.length - 1]) {
        plot.maxVal = data[data.length - 1];
        plot.maxValPos = data.length - 1;
    }
    else plot.maxValPos--;
    if (plot.maxValPos < 0) {
        plot.maxVal = data[0];
        for (let i = 1; i < data.length /*- 1*/; i++)
            if (data[i] > plot.maxVal) {
                plot.maxVal = data[i];
                plot.maxValPos = i;
            }
    }
    plot.yRange = plot.range(plot.maxVal);
}

plot.drawAxisX = function (stepsNumber) {
    plot.ctx.beginPath();
    plot.ctx.lineWidth = 2;
    plot.ctx.strokeStyle = "black";
    plot.ctx.lineCap = "butt";
    //axis line:
    plot.ctx.moveTo(0, CANVAS_HEIGHT - plot.originY);
    plot.ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - plot.originY);
    plot.ctx.stroke();
    //score:
    let scoreStep = (CANVAS_WIDTH - plot.originX) / 6;
    let labelLength = 8;
    for (let i = 1; i < 6; i++) {
        plot.ctx.moveTo(plot.originX + i * scoreStep, CANVAS_HEIGHT - plot.originY - labelLength / 2);
        plot.ctx.lineTo(plot.originX + i * scoreStep, CANVAS_HEIGHT - plot.originY + labelLength / 2);
        plot.ctx.stroke();
    }
    //text labels:
    let displacement = 0;
    if (stepsNumber > 90) displacement = stepsNumber - 90;
    plot.ctx.fillStyle = "black";
    plot.ctx.font = "10pt Arial";
    for (let i = 1; i < 6; i++) {
        plot.ctx.fillText(displacement + i * plot.xRange / 5, plot.originX + i * scoreStep - 5, CANVAS_HEIGHT - plot.originY + labelLength / 2 + 12);
    }


}

plot.drawAxisY = function () {
    plot.ctx.beginPath();
    plot.ctx.lineWidth = 2;
    plot.ctx.strokeStyle = "black";
    plot.ctx.lineCap = "butt";
    //axis line:
    plot.ctx.moveTo(plot.originX, CANVAS_HEIGHT);
    plot.ctx.lineTo(plot.originX, CANVAS_HEIGHT - PLOT_HEIGHT);
    plot.ctx.stroke();
    //score:
    let labels = 5;
    let scoreStep = (PLOT_HEIGHT - plot.originY) / labels;
    let labelLength = 8;
    for (let i = 1; i < labels; i++) {
        plot.ctx.moveTo(plot.originX - labelLength / 2, CANVAS_HEIGHT - plot.originY - i * scoreStep);
        plot.ctx.lineTo(plot.originX + labelLength / 2, CANVAS_HEIGHT - plot.originY - i * scoreStep);
        plot.ctx.stroke();
    }
    //text labels:
    plot.ctx.fillStyle = "black";
    plot.ctx.font = "10pt Arial";
    for (let i = 1; i < labels; i++) {
        plot.ctx.fillText(i * plot.yRange / labels, 10, CANVAS_HEIGHT - plot.originY - i * scoreStep + 5);
    }

}

plot.drawData = function (dataArr, stepsNum) {
    let columnWidth = (CANVAS_WIDTH - plot.originX) / 120;
    plot.ctx.beginPath();
    plot.ctx.lineWidth = 5;
    plot.ctx.strokeStyle = "red";
    plot.ctx.lineCap = "butt";
    let zoom = (PLOT_HEIGHT - plot.originY) / plot.yRange;

    for (let i = 1; i <= stepsNum; i++) {
        //data point column line:

        plot.ctx.moveTo(plot.originX + i * columnWidth, CANVAS_HEIGHT - plot.originY);
        plot.ctx.lineTo(plot.originX + i * columnWidth, CANVAS_HEIGHT - plot.originY - zoom * dataArr[i - 1]);
        plot.ctx.stroke();
    }

}

plot.range = function (maxNum) {
    let powerOfTen = 0;
    while (maxNum > 10) {
        maxNum /= 10;
        powerOfTen++;
    }
    return Math.ceil(maxNum) * Math.pow(10, powerOfTen);
}

