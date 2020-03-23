var start = document.getElementById('start');
var stop = document.getElementById('stop');
var canvas = document.getElementById('canvas');
var interval = 0;
var canvasCtx = canvas.getContext('2d');

var graph = document.getElementById('graph');
var graphsCtx = graph.getContext('2d');

var iteration = 0;

function draw(human) {
    canvasCtx.save();
    canvasCtx.translate(human.pos.x, human.pos.y);
    canvasCtx.rotate(Math.PI / 180 * 90 + Math.atan2(human.dir.y, human.dir.x));
    canvasCtx.fillStyle = human.activeColor;
    canvasCtx.fillRect(-human.size / 2, -human.size / 2, human.size, human.size)
    canvasCtx.restore();

    human.move();
}


var humans = []
for (var i = 0; i < 150; i++) {
    movement = Math.random() > 0.7
    if (movement) {
        humans.push(new Human(Math.random() * canvas.width - 50, Math.random() * canvas.height - 50, Math.random() * 2 - 1, Math.random() * 2 - 1, false, { w: canvas.width, h: canvas.height }));
    } else {
        humans.push(new Human(Math.random() * canvas.width - 50, Math.random() * canvas.height - 50, 0, 0, false, { w: canvas.width, h: canvas.height }));
    }
}
humans.push(new Human(Math.random() * canvas.width - 50, Math.random() * canvas.height - 50, Math.random() * 2 - 1, Math.random() * 2 - 1, true, { w: canvas.width, h: canvas.height }));

function drawHumans() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    humans.forEach((human) => {
        human.detectCollisions(humans);
        draw(human);
    })

    drawGraph(iteration);
    iteration += 1;
    console.log(iteration)
}



function drawGraph(iteration) {
    if (iteration % 10 == 0) {
        sickColor = "#db3623"
        immuneColor = "#52bab1"
        healthyColor = "#65d446"
        sick = 0
        immune = 0
        healthy = 0
        humans.forEach(human => {
            if (human.isSick == true) sick += 1;
            else if (human.wasSick == true) immune += 1;
            else healthy += 1;
        })

        graphsCtx.fillStyle = immuneColor;
        graphsCtx.fillRect(iteration / 5, 0, 2, immune * graph.height/humans.length);
        graphsCtx.fillStyle = healthyColor;
        graphsCtx.fillRect(iteration / 5, immune, 2, healthy * graph.height/humans.length);
        graphsCtx.fillStyle = sickColor;
        graphsCtx.fillRect(iteration / 5, immune + healthy, 2, sick * graph.height/humans.length);
    }
}





start.onclick = function () {
    if (!interval) {
        interval = setInterval(drawHumans, 30);
    }
}

stop.onclick = function () {
    clearInterval(interval);
    interval = null;
}

