class Ant {
    purpose = e_Type.FOOD
    velocity = 60
    dirStrength = 0
    feromoneDelay = 2
    lastFeromone = 0
    prevFeromone = new Feromone({x: 500, y: 300}, {x: 0, y: 0}, e_Type.HOME)
    feromoneInfluenceDelay = 0.3


    constructor(posx, posy, dir) {
        this.lastFeromone = 0
        this.pos = { x: posx, y: posy }
        this.dir = dir
        this.NormalizeDir()
    }

    ManageTime(deltaTime){
        //Decrease dirStrength
        this.dirStrength -= deltaTime
        if (this.dirStrength < 0) this.dirStrength = 0

        //Place feromone
        this.lastFeromone -= deltaTime
        this.feromoneInfluenceDelay -= deltaTime
    }

    GetPurpose() {
        return this.e_purpose
    }

    DeviateDir(deltaTime){
        if (this.dirStrength > 0) return
        var newDir = {x: 0.5 - Math.random(), y: 0.5 - Math.random()}
        this.dir.x = this.dir.x + (newDir.x * 10) * deltaTime
        this.dir.y = this.dir.y + (newDir.y * 10) * deltaTime
        if(this.dir.x == 0 && this.dir.y == 0) this.dir.x = 0.5 - Math.random()
        this.NormalizeDir()
    }

    NormalizeDir() {
        if (Math.abs(this.dir.x + this.dir.y)) {
            var length = Math.abs(this.dir.x) + Math.abs(this.dir.y)
            this.dir.x = this.dir.x / length
            this.dir.y = this.dir.y / length
        }
    }

    SteerTowardsDir(dir, strength) {
        // 1 - 10
        this.dir.x += dir.x * (strength / 5);
        this.dir.y += dir.y * (strength / 5);

        this.NormalizeDir()
    }

    Move(deltaTime, feromoneList, wallList, foodList) {
        if (this.purpose == e_Type.HOME && this.DistanceToObject(new Wall(500, 300)) < 100){
            this.purpose = e_Type.FOOD
            this.dir.x = -this.dir.x
            this.dir.y = -this.dir.y
            this.prevFeromone.pos = {x: 500, y: 300}
            this.dirStrength = 10
            this.feromoneDelay = 1.5
        }

        this.ManageFeromoneInfluence(feromoneList)
        this.DeviateDir(deltaTime)
        var newPosX = this.pos.x + this.dir.x * (this.velocity * deltaTime)
        var newPosY = this.pos.y + this.dir.y * (this.velocity * deltaTime)
        var newPos = new Wall(newPosX, newPosY)

        this.ManageCollisions(wallList, newPos)
        foodList = this.ManageFoodGathering(foodList)

        this.pos.x = newPosX
        this.pos.y = newPosY

        if (this.lastFeromone < 0) this.PlaceFeromone(feromoneList)

        if (this.pos.x < 0 || this.pos.x > 1000 || this.pos.y < 0 || this.pos.y > 600) {
            this.pos.x = 500
            this.pos.y = 300
        }
        

        this.ManageTime(deltaTime)
        return foodList, feromoneList
    }

    PlaceFeromone(feromoneList){
        this.lastFeromone = 1 + Math.random() * this.feromoneDelay
        var newFeromone = new Feromone(this.pos, this.DirTowards(this.prevFeromone), this.purpose)
        feromoneList.push(newFeromone)
        this.prevFeromone.pos = {x: newFeromone.pos.x, y: newFeromone.y}
        return feromoneList
    }

    ManageFeromoneInfluence(feromoneList){
        feromoneList.forEach((feromone) => {
            if (this.DistanceToObject(feromone) < 6 && feromone.type != this.purpose && this.feromoneInfluenceDelay < 0) {
                this.SteerTowardsDir(feromone.dir, feromone.strength)
                this.dirStrength = 10
                this.feromoneInfluenceDelay = 0.3
                // this.dir = feromone.dir
            }
        })
    }

    ManageCollisions(wallList, newPos){
        // wallList.forEach((wall) => {
        //     var distance = this.DistanceToObject(wall)
        //     if (distance < 25 && this.DistanceToObject(wall) > this.DistanceBetweenObjects(newPos, wall)){
        //         this.dirStrength = 0
        //     } 
        // })
    }

    ManageFoodGathering(foodList){
        if (this.purpose == e_Type.FOOD) {
            foodList.forEach((food) => {
                var dist = this.DistanceToObject(food)
                if (dist < 12) {
                    foodList.splice(foodList.indexOf(food), 1)
                    this.purpose = e_Type.HOME
                    this.dir.x = -this.dir.x
                    this.dir.y = -this.dir.y
                    this.dirStrength = 10
                    this.feromoneDelay = 0.5
                    return foodList
                } else if (dist < 40){
                    this.SteerTowardsDir(this.DirTowards(food), 5)
                    return foodList
                }
            })
        }
        return foodList
    }

    DistanceToObject(obj) {
        var distx = Math.abs(this.pos.x - obj.pos.x)
        var disty = Math.abs(this.pos.y - obj.pos.y)
        return Math.sqrt(distx**2 + disty**2)
    }

    DistanceBetweenObjects(source, destination) {
        var distx = Math.abs(source.pos.x - destination.pos.x)
        var disty = Math.abs(source.pos.y - destination.pos.y)
        return Math.sqrt(distx**2 + disty**2)
    }

    DirTowards(obj){
        var radian = Math.atan2(obj.pos.y - this.pos.y, obj.pos.x - this.pos.x )
        return {x: Math.cos(radian), y: Math.sin(radian)}
    }
}