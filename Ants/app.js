var start = document.getElementById('start');
var stop = document.getElementById('stop');
var simSpeedInput = document.getElementById('speed');
var drawType = document.getElementById('draw');
var drawGreenPheromones = document.getElementById('drawGreenPheromones');
var drawRedPheromones = document.getElementById('drawRedPheromones');
var canvas = document.getElementById('canvas');
var interval = 0;
var ctx = canvas.getContext('2d');

//DRAWING VARS
var isDrawing = false;
var dot_flag = false;
var currX = 0;
var currY = 0;
var x = "black";
var y = 2;
//////////////


//OBJECT LISTS
var data = new Model()
//////////////

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
        case "Pheromone":
            if((drawRedPheromones.checked && entity.type == e_Type.TOWARDS_HOME) || (drawGreenPheromones.checked && entity.type == e_Type.TOWARDS_FOOD)){
                ctx.globalAlpha = entity.strength / 10
                switch(entity.type){
                    case e_Type.TOWARDS_FOOD:
                        ctx.fillStyle = 'rgba(22, 181, 48)'
                        break;
                    case e_Type.TOWARDS_HOME:
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


function run() {
    PushNewStaticObjects()
    
    var dt = simSpeedInput.value / 1000
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(244, 247, 176)'
    ctx.beginPath();
    ctx.arc(500, 300, data.HOME_RADIUS, 0, 2 * Math.PI);
    ctx.fill();

    data.food.forEach((food) => {
        draw(food);
    })
    data.ants.forEach((ant) => {
        ant.Update(dt, data)
        draw(ant);
    })
    data.walls.forEach((wall) => {
        draw(wall);
    })
    data.pheromones.forEach((pheromone) => {
        pheromone.Update(dt, data)
        if(pheromone.strength <= 0){
            data.pheromones.splice(data.pheromones.indexOf(pheromone), 1)
        }
        draw(pheromone)
    })
}

start.onclick = function () {
    Init()
    console.log("Start");
    if (!interval) {
        interval = setInterval(run, 30);
    }
}

stop.onclick = function () {
    clearInterval(interval);
    interval = null;
}

function Init() {
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
    data.GenerateAnts()
}

function PushNewStaticObjects() {
    if (isDrawing) {
        var type = drawType.value
        switch(parseInt(type)){
            case 0:
                //Wall
                data.AddWall(currX, currY)
                break;
            case 1:
                //Food
                data.AddFood(currX, currY)
                break;
            default:
                console.log("Invalid drawing type", drawType.value)    
        }
        // console.log(currX, currY)
    }
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        isDrawing = true;
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
        isDrawing = false;
    }
    if (res == 'move') {
        if (isDrawing) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            PushNewStaticObjects();
        }
    }
}
