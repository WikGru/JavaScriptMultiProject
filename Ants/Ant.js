class Ant {
    purpose = e_Type.TOWARDS_FOOD
    velocity = 60
    life = {amount: 0, type: this.purpose}
    dirStrength = 0
    pheromoneInfluenceDelay = 0
    pheromoneStandardDelay = 1
    pheromonePlaceDelay = 0
    prevPheromone = new Pheromone({x: 500, y: 300}, {x: 0, y: 0}, e_Type.TOWARDS_HOME)

    constructor(posx, posy, dir, data) {
        this.pheromonePlaceDelay = 0
        this.pos = { x: posx, y: posy }
        this.dir = this.NormalizeDir(dir)
        this.life.amount = data.ANT_LIFE
    }

    GetPurpose() {
        return this.purpose
    }

    NormalizeDir(dir) {
        if (Math.abs(dir.x + dir.y)) {
            var length = Math.abs(dir.x) + Math.abs(dir.y)
            dir.x = dir.x / length
            dir.y = dir.y / length
        }
        return dir
    }

    DeviateDir(dt, data) {
        this.dir.x += (Math.random() - 0.5) * data.DIR_ADJUSTMENT * dt
        this.dir.y += (Math.random() - 0.5) * data.DIR_ADJUSTMENT * dt
        this.dir = this.NormalizeDir(this.dir)
    }

    Update(dt, data) {
        this.life.amount -= dt
        if(this.life.type != this.purpose){
            this.life.type = this.purpose
            this.life.amount = data.ANT_LIFE
        }
        if(this.life.amount <= 0){
            this.TeleportBackHome(data)
        }

        switch(this.purpose){
            case e_Type.TOWARDS_FOOD:
                this.UpdateGoingForFood(dt, data)
                break
            case e_Type.TOWARDS_HOME:
                this.UpdateGoingHome(dt, data)
                break
            default:
                console.log("Invalid purpose.")
        }

        this.dirStrength -= dt
        this.HandlePheromonePlacement(dt, data)
        this.Move(dt)

        if(this.pos.x >= 1000 || this.pos.x <= 0 || this.pos.y >= 600 || this.pos.y <= 0){
            this.TeleportBackHome(data)
        }
    }

    UpdateGoingForFood(dt, data){
        if(this.HandlePickingFood(data.food)){
            this.purpose = e_Type.TOWARDS_HOME
            this.dirStrength = data.DIR_STRENGTH
            this.dir = this.ReverseDir(this.dir)
        } else {
            var pheromone = this.CheckForPheromones(dt, data)
            if(pheromone){
                this.dir = this.SteerDirTowards(this.dir, pheromone, data)
            }
            
            var foodInRange = this.CheckForFood(data)
            if(foodInRange){
                this.dir = this.SteerDirTowards(this.dir, this.GetDirTowardsObject(foodInRange), data)
            } else if(this.dirStrength <= 0) {
                this.DeviateDir(dt, data)
            }
        }
    }

    UpdateGoingHome(dt, data) {
        if(this.DistanceToObject(data.HOME) <= data.HOME_RADIUS){
            this.purpose = e_Type.TOWARDS_FOOD
            this.dirStrength = data.DIR_STRENGTH
            this.dir = this.ReverseDir(this.dir)
        } else {
            var pheromone = this.CheckForPheromones(dt, data)
            if(pheromone.x != 0 || pheromone.y != 0){
                this.dirStrength = data.DIR_STRENGTH
                this.dir = this.SteerDirTowards(this.dir, pheromone, data)
            } else if(this.dirStrength <= 0){
                this.DeviateDir(dt, data)
            }
        }
    }
    
    TeleportBackHome(data){
        this.dirStrength = 0
        this.pheromoneInfluenceDelay = 0
        this.pos = {x: 500, y: 300}
        this.dir = {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
        this.dir = this.NormalizeDir(this.dir)
        this.life.amount = data.ANT_LIFE
    }

    CheckForPheromones(dt, data){
        this.pheromoneInfluenceDelay -= dt
        var pheromoneInRange = {x: 0, y: 0}
        
        if(this.pheromoneInfluenceDelay <= 0){            
            data.pheromones.forEach(element => {
                if(element.type == this.purpose && this.DistanceToObject(element) <= data.ANT_PHEROMONE_SIGHT){
                    pheromoneInRange.x += (element.dir.x * (element.strength / data.PHEROMONE_STRENGTH_TOFOOD))
                    pheromoneInRange.y += (element.dir.y * (element.strength / data.PHEROMONE_STRENGTH_TOFOOD))
                }
            })
            if(this.pheromonePlaceDelay <= 0  && (pheromoneInRange.x != 0 || pheromoneInRange.y != 0)){
                this.pheromoneInfluenceDelay = data.DELAY_AFTER_PHEROMONE_INFLUENCE
                this.dirStrength = data.DIR_STRENGTH
                this.pheromonePlaceDelay = data.PHEROMONE_PLACEMENT_DELAY_TOFOOD
                this.PlacePheromone(data, pheromoneInRange)
            }
        }
        return this.NormalizeDir(pheromoneInRange)
    }

    CheckForFood(data){
        var foodInRange = false
        data.food.forEach(element => {
            if(this.DistanceToObject(element) <= data.ANT_FOOD_SIGHT){
                foodInRange = element
            }
        })
        return foodInRange
    }

    Move(dt){
        this.pos.x += this.dir.x * this.velocity * dt
        this.pos.y += this.dir.y * this.velocity * dt
    }

    HandlePickingFood(food){
        var isFoodPicked = false
        food.forEach(element => {
            if(this.DistanceToObject(element) <= 10){
                isFoodPicked = true
                element.DecreaseAmount(food)
            }
        })
        return isFoodPicked
    }


    PlacePheromone(data, dir){
        var purpose = false
        switch(this.purpose){
            case e_Type.TOWARDS_FOOD:
                purpose = e_Type.TOWARDS_HOME
                break
            case e_Type.TOWARDS_HOME:
                purpose = e_Type.TOWARDS_FOOD
                break
            default:
                console.log("Invalid purpose.")    
        }
        data.AddPheromone(this.pos, dir, purpose)
        Object.assign(this.prevPheromone.pos, this.pos) 
    }

    HandlePheromonePlacement(dt, data){
        this.pheromonePlaceDelay -= dt
        if (this.pheromonePlaceDelay <= 0){
            var delay
            switch(this.purpose){
                case e_Type.TOWARDS_HOME:
                    delay = data.PHEROMONE_PLACEMENT_DELAY_TOHOME
                    break
                case e_Type.TOWARDS_FOOD:
                    delay = data.PHEROMONE_PLACEMENT_DELAY_TOFOOD
                    break
                default:
                    console.log("Invalid purpose.")
            }
            this.pheromonePlaceDelay = 1 + Math.random() * delay
            this.PlacePheromone(data, this.GetDirTowardsObject(this.prevPheromone))
        }
    }

    DistanceBetweenObjects(source, destination) {
        var distx = Math.abs(source.pos.x - destination.pos.x)
        var disty = Math.abs(source.pos.y - destination.pos.y)
        return Math.sqrt(distx*distx + disty*disty)
    }

    DistanceToObject(obj) {
        var distx = Math.abs(this.pos.x - obj.pos.x)
        var disty = Math.abs(this.pos.y - obj.pos.y)
        return Math.sqrt(distx*distx + disty*disty)
    }

    GetDirTowardsObject(obj){
        var radian = Math.atan2(obj.pos.y - this.pos.y, obj.pos.x - this.pos.x )
        return {x: Math.cos(radian), y: Math.sin(radian)}
    }

    SteerDirTowards(original, goal, data) {
        var newDir = {x: 0, y:0}
        newDir.x = original.x + goal.x / data.DIR_ADJUSTMENT;
        newDir.y = original.y + goal.y / data.DIR_ADJUSTMENT;
        return this.NormalizeDir(newDir)
    }

    ReverseDir(dir){
        dir.x *= -1
        dir.y *= -1
        return dir
    }
}