const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;



    const PLOT_HEIGHT = 100;
    const ORIGIN_Y = 20;
    const ORIGIN_X = 40;

    let plot = {};
    plot.maxVal = 20;


    plot.draw = function (data, steps, ctx) {
        plot.setRanges(data);
        plot.drawAxisX(steps, ctx);
        plot.drawAxisY(ctx);
        plot.drawData(data, steps, ctx);
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

    plot.drawAxisX = function (stepsNumber, context) {
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.lineCap = "butt";
        //axis line:
        context.moveTo(0, CANVAS_HEIGHT - ORIGIN_Y);
        context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - ORIGIN_Y);
        context.stroke();
        //score:
        let scoreStep = (CANVAS_WIDTH - ORIGIN_X) / 6;
        let labelLength = 8;
        for (let i = 1; i < 6; i++) {
            context.moveTo(ORIGIN_X + i * scoreStep, CANVAS_HEIGHT - ORIGIN_Y - labelLength / 2);
            context.lineTo(ORIGIN_X + i * scoreStep, CANVAS_HEIGHT - ORIGIN_Y + labelLength / 2);
            context.stroke();
        }
        //text labels:
        let displacement = 0;
        if (stepsNumber > 90) displacement = stepsNumber - 90;
        context.fillStyle = "black";
        context.font = "10pt Arial";
        for (let i = 1; i < 6; i++) {
            context.fillText(displacement + i * plot.xRange / 5, ORIGIN_X + i * scoreStep - 5, CANVAS_HEIGHT - ORIGIN_Y + labelLength / 2 + 12);
        }


    }

    plot.drawAxisY = function (context) {
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.lineCap = "butt";
        //axis line:
        context.moveTo(ORIGIN_X, CANVAS_HEIGHT);
        context.lineTo(ORIGIN_X, CANVAS_HEIGHT - PLOT_HEIGHT);
        context.stroke();
        //score:
        let labels = 5;
        let scoreStep = (PLOT_HEIGHT - ORIGIN_Y) / labels;
        let labelLength = 8;
        for (let i = 1; i < labels; i++) {
            context.moveTo(ORIGIN_X - labelLength / 2, CANVAS_HEIGHT - ORIGIN_Y - i * scoreStep);
            context.lineTo(ORIGIN_X + labelLength / 2, CANVAS_HEIGHT - ORIGIN_Y - i * scoreStep);
            context.stroke();
        }
        //text labels:
        context.fillStyle = "black";
        context.font = "10pt Arial";
        for (let i = 1; i < labels; i++) {
            context.fillText(i * plot.yRange / labels, 10, CANVAS_HEIGHT - ORIGIN_Y - i * scoreStep + 5);
        }

    }

    plot.drawData = function (dataArr, stepsNum, context) {
        let columnWidth = (CANVAS_WIDTH - ORIGIN_X) / 120;
        context.beginPath();
        context.lineWidth = 5;
        context.strokeStyle = "red";
        context.lineCap = "butt";
        let zoom = (PLOT_HEIGHT - ORIGIN_Y) / plot.yRange;

        for (let i = 1; i <= stepsNum; i++) {
            //data point column line:

            context.moveTo(ORIGIN_X + i * columnWidth, CANVAS_HEIGHT - ORIGIN_Y);
            context.lineTo(ORIGIN_X + i * columnWidth, CANVAS_HEIGHT - ORIGIN_Y - zoom * dataArr[i - 1]);
            context.stroke();
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

