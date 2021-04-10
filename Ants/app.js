var start = document.getElementById('start');
var stop = document.getElementById('stop');
var simSpeedInput = document.getElementById('speed');
var drawType = document.getElementById('draw');
var drawFeromones = document.getElementById('drawFeromones');
var canvas = document.getElementById('canvas');
var interval = 0;
var ctx = canvas.getContext('2d');

var flag = false;
var currX = 0;
var currY = 0;
var dot_flag = false;
var x = "black";
var y = 2;

function init() {
    w = canvas.width;
    h = canvas.height;
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

var feromoneList = []
var foodList = []
var wallList = []
function AddElements() {
    if (flag) {
        var type = drawType.value
        switch(parseInt(type)){
            case 0:
                //Wall
                wallList.push(new Wall(currX, currY))
                break;
            case 1:
                //Food
                foodList.push(new Food(currX, currY))
                break;
            default:
                console.log("Invalid drawing type", drawType.value)    
        }
    }
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            AddElements();
        }
    }
}

function draw(entity) {
    ctx.save();
    ctx.translate(entity.pos.x, entity.pos.y);
    switch(entity.constructor.name){
        case "Ant":
            ctx.rotate(Math.PI / 180 * 90 + Math.atan2(entity.dir.y, entity.dir.x));
            ctx.fillStyle = 'rgb(88, 130, 250)'
            ctx.beginPath();
            ctx.lineTo(0, -5);
            ctx.lineTo(3, 3);
            ctx.lineTo(0, 1)
            ctx.lineTo(-3, 3);
            ctx.fill();
            break;
        case "Food":
            ctx.fillStyle = 'rgb(50, 168, 82)'
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case "Wall":
            ctx.fillStyle = 'rgb(128, 128, 128)'
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case "Feromone":
            if(drawFeromones.checked){
                ctx.globalAlpha = entity.strength / 10
                switch(entity.type){
                    case e_Type.HOME:
                        ctx.fillStyle = 'rgba(22, 181, 48)'
                        break;
                    case e_Type.FOOD:
                        ctx.fillStyle = 'rgb(252, 19, 3)'
                        break;
                    default:
                        console.log("Invalid entity type.")
                }
                ctx.rotate(Math.PI / 180 * 90 + Math.atan2(entity.dir.y, entity.dir.x));
                ctx.beginPath();
                ctx.lineTo(0, -3);
                ctx.lineTo(1, 1);
                ctx.lineTo(0, 0)
                ctx.lineTo(-1, 1);
                ctx.fill();
            }
            break;
        default:
            console.log("Invalid entity type to draw")
    }
    ctx.globalAlpha = 1
    ctx.restore();
}

var homeSize = 20
var antList = []
for (var i = 0; i < 100; i++) {
    antList[i] = new Ant(500 + (homeSize/2) - Math.random() * homeSize, 300 + (homeSize/2) - Math.random() * homeSize, { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 });
}

function run() {
    AddElements()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(244, 247, 176)'
    ctx.beginPath();
    ctx.arc(500, 300, homeSize, 0, 2 * Math.PI);
    ctx.fill();

    foodList.forEach((food) => {
        draw(food);
    })
    antList.forEach((ant) => {
        draw(ant);
        foodList, feromoneList = ant.Move(simSpeedInput.value / 1000, feromoneList, wallList, foodList);
    })
    wallList.forEach((wall) => {
        draw(wall);
    })
    feromoneList.forEach((feromone) => {
        draw(feromone)
        feromone.ManageLife(simSpeedInput.value / 1000)
        if (feromone.strength <= 0) feromoneList.splice(feromoneList.indexOf(feromone), 1)
    })
}

start.onclick = function () {
    init()
    console.log("Start");
    if (!interval) {
        interval = setInterval(run, 30);
    }
}

stop.onclick = function () {
    clearInterval(interval);
    interval = null;
}
