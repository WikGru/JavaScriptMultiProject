var start = document.getElementById('start');
var stop = document.getElementById('stop');
var drawButton = document.getElementById('draw');
var pushInput = document.getElementById('push');
var pushlabel = document.getElementById('pushlabel');
var dirAdjustInput = document.getElementById('adjustDir');
var adjustdirlabel = document.getElementById('adjustdirlabel');
var canvas = document.getElementById('canvas');
var interval = 0;
var ctx = canvas.getContext('2d');

pushInput.value = 10;
dirAdjustInput.value = 40;

pushlabel.innerText = pushInput.value;
adjustdirlabel.innerText = dirAdjustInput.value;

pushInput.oninput = function () {
    pushlabel.innerText = this.value;
}

dirAdjustInput.oninput = function () {
    adjustdirlabel.innerText = this.value;
}

var drawLines = false
function draw(bird) {
    ctx.save();
    ctx.translate(bird.pos.x, bird.pos.y);
    ctx.rotate(Math.PI / 180 * 90 + Math.atan2(bird.dir.y, bird.dir.x));
    ctx.fillStyle = 'rgb(88, 130, 250)'
    ctx.beginPath();
    ctx.lineTo(0, -10);
    ctx.lineTo(6, 6);
    ctx.lineTo(0, 2)
    ctx.lineTo(-6, 6);
    ctx.fill();
    ctx.restore();

    bird.move();
}


var birdList = []
for (var i = 0; i < 500; i++) {
    birdList[i] = new Bird(Math.random() * 1000, Math.random() * 1000, { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 });
}

function flocking(bird) {
    var othersInLongRange = 0;
    var avgLongPosition = { x: 0, y: 0 };

    var othersInShortRange = 0;
    var avgShortPosition = { x: 0, y: 0 };

    if (bird.pos.x > canvas.width - 50) {
        bird.steerAwayFrom({ x: canvas.width * 2, y: bird.pos.y })
        return;
    } else if (bird.pos.x < 50) {
        bird.steerAwayFrom({ x: -canvas.width, y: bird.pos.y })
        return;
    }

    if (bird.pos.y > canvas.height - 50) {
        bird.steerAwayFrom({ x: bird.pos.x, y: canvas.height * 2 });
        return;
    } else if (bird.pos.y < 50) {
        bird.steerAwayFrom({ x: bird.pos.x, y: -canvas.height });
        return;
    }

    birdList.forEach((other) => {
        var distance = bird.distance(other)
        if (distance < 20) {
            avgShortPosition.x += other.pos.x;
            avgShortPosition.y += other.pos.y;
            othersInShortRange++;
            if (drawLines) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = "#FF0000";
                ctx.moveTo(bird.pos.x, bird.pos.y);
                ctx.lineTo(other.pos.x, other.pos.y);
                ctx.stroke();
                ctx.restore();
            }
            bird.steerAwayFrom(other.pos);
        } else if (distance < 45) {
            avgLongPosition.x += other.dir.x;
            avgLongPosition.y += other.dir.y;
            othersInLongRange++;
            if (drawLines) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = "#00FF00";
                ctx.moveTo(bird.pos.x, bird.pos.y);
                ctx.lineTo(other.pos.x, other.pos.y);
                ctx.stroke();
                ctx.restore();
            }
            bird.adjustDirTowards({ x: avgLongPosition.x / othersInLongRange, y: avgLongPosition.y / othersInLongRange });
        }
    })
}

function drawBirds() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    birdList.forEach((bird) => {
        bird.pushingInfluence = pushInput.value;
        bird.dirAdjustInfluence = dirAdjustInput.value;
        flocking(bird);
    })
    birdList.forEach((bird) => {
        bird.dirAdjustInfluence = dirAdjustInput.value;
        bird.pushingInfluence = pushInput.value;
        draw(bird);
    })
}


start.onclick = function () {
    if (!interval) {
        interval = setInterval(drawBirds, 30);
    }
}

stop.onclick = function () {
    clearInterval(interval);
    interval = null;
}


drawButton.onclick = function () {
    drawLines = !drawLines;
}
