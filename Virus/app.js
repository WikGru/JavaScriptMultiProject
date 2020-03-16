var start = document.getElementById('start');
var stop = document.getElementById('stop');
var canvas = document.getElementById('canvas');
var interval = 0;
var ctx = canvas.getContext('2d');

function draw(human) {
    ctx.save();
    ctx.translate(human.pos.x, human.pos.y);
    ctx.rotate(Math.PI / 180 * 90 + Math.atan2(human.dir.y, human.dir.x));
    ctx.fillStyle = human.activeColor;
    ctx.beginPath();
    ctx.lineTo(0, -human.size);
    ctx.lineTo(human.size/2, human.size/2);
    ctx.lineTo(0, human.size/5)
    ctx.lineTo(-human.size/2, human.size/2);
    ctx.fill();
    ctx.restore();

    human.move();
}


var humans = []
for (var i = 0; i < 150; i++) {
    // health =  Math.random() > 0.9
    humans.push(new Human(Math.random() * canvas.width - 50, Math.random() * canvas.height - 50, Math.random() * 2 - 1, Math.random() * 2 - 1, false, { w: canvas.width, h: canvas.height }));
}
humans.push(new Human(Math.random() * canvas.width - 50, Math.random() * canvas.height - 50, Math.random() * 2 - 1, Math.random() * 2 - 1, true, { w: canvas.width, h: canvas.height }));

function drawHumans() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    humans.forEach((human) => {
        human.detectCollisions(humans);
        draw(human);
    })
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

