var in_vertices = document.getElementById('vertices');
var l_vertices = document.getElementById('verticeslabel');
var l_activerule = document.getElementById('activerule');
var start = document.getElementById('start');
var stop = document.getElementById('stop');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var interval = null;

var colors = ['#FF0000', '#FFA500', '#FFFF00', '#7FFF00', '#00FF00', '#00FF7F',
    '#00FFFF', '#007FFF', '#0000FF', '#EE82EE', '#FF00FF', '#FF007F']

var size = 3;
var verticesAmount = in_vertices.value;
var listOfVertices = [];
var previousVertices = [];

var currentPos = { x: 0, y: 0 };

document.getElementById('classic').onclick = function () {
    l_activerule.innerText = 'Classic'
}
document.getElementById('noduplicates').onclick = function () {
    l_activerule.innerText = 'No double vertice'
}
document.getElementById('noneighbour').onclick = function () {
    l_activerule.innerText = 'No neighbour'
}

start.onclick = function () {
    if (interval == null) {
        ctx.fillStyle = '#606060';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setup();
        var rule = document.querySelector('input[name="rules"]:checked').id;
        if (rule == 'noduplicates') interval = setInterval(playNoDuplicates, 10);
        else if (rule == 'noneighbour') interval = setInterval(playNoNeighbour, 10);
        else interval = setInterval(playClassic, 10);
    }
}

stop.onclick = function () {
    if (interval != null) {
        clearInterval(interval);
        interval = null;
    }
}


in_vertices.oninput = function () {
    l_vertices.innerText = this.value;
}

function drawPoint(point, size, color) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = color;
    ctx.fillRect(point.x - (size / 2), point.y - (size / 2), size, size);
    ctx.restore();
}

function setup() {
    verticesAmount = in_vertices.value;
    counter = [];
    previousVertices = [];
    currentPos = { x: 0, y: 0 };
    listOfVertices = [];
    for (var i = 0; i < verticesAmount; i++) {
        var angle = (((Math.PI * 2.0) / verticesAmount) * i) + (45 * Math.PI / 180);
        var color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';
        listOfVertices.push({ x: 300 * Math.cos(angle), y: 300 * Math.sin(angle), col: color });
        drawPoint(listOfVertices[i], 10, colors[i])
        counter[i] = 0;
    }

    currentPos.x = listOfVertices[0].x;
    currentPos.y = listOfVertices[0].y;
}

function getMidPoint(current, given) {
    var dist = Math.hypot(current.x - given.x, current.y - given.y) / 2;
    var x = current.x + (given.x - current.x) / 2;
    var y = current.y + (given.y - current.y) / 2;
    return { x: x, y: y }
}

function playClassic() {
    var number = Math.floor(Math.random() * verticesAmount);
    counter[number]++;
    currentPos = getMidPoint(currentPos, listOfVertices[number]);
    drawPoint(currentPos, size, colors[number]);
}

function playNoDuplicates() {
    var number = Math.floor(Math.random() * verticesAmount);
    if (number == previousVertices[0]) playNoDuplicates();
    else {
        previousVertices.shift();
        previousVertices.push(number);
        currentPos = getMidPoint(currentPos, listOfVertices[number]);
        drawPoint(currentPos, size, colors[number]);
    }
}

function playNoNeighbour() {
    var number = Math.floor(Math.random() * verticesAmount);

    var notAllowedVertices = [];
    if (previousVertices[0] == previousVertices[1]) {
        if (previousVertices[0] - 1 < 0) {
            notAllowedVertices.push(verticesAmount - 1);
            notAllowedVertices.push(previousVertices[0] + 1);
        }
        else if (previousVertices[0] + 1 > verticesAmount - 1) {
            notAllowedVertices.push(0);
            notAllowedVertices.push(previousVertices[0] - 1);
        }
        else {
            notAllowedVertices.push(previousVertices[0] + 1)
            notAllowedVertices.push(previousVertices[0] - 1)
        }
    }

    if (notAllowedVertices.includes(number)) {
        playNoNeighbour();
    } else {
        if (previousVertices.length >= 2) previousVertices.shift();
        previousVertices.push(number);
        currentPos = getMidPoint(currentPos, listOfVertices[number]);
        drawPoint(currentPos, size, colors[number]);
    }
}

ctx.fillStyle = '#606060';
ctx.fillRect(0, 0, canvas.width, canvas.height);