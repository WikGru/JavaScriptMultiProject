class Model {
    constructor(){
        this.pheromones = []
        this.walls = []
        this.food = []
        this.ants = []

        this.ANT_AMOUNT = 100
        this.DIR_STRENGTH = 1
        this.DIR_ADJUSTMENT = 4
        this.PHEROMONE_PLACEMENT_DELAY_TOFOOD = 1
        this.PHEROMONE_PLACEMENT_DELAY_TOHOME = 1
        this.PHEROMONE_STRENGTH_TOFOOD = 20
        this.PHEROMONE_STRENGTH_TOHOME = 10
        this.FOOD_AMOUNT = 1000
        this.DELAY_AFTER_PHEROMONE_INFLUENCE = 0

        this.ANT_PHEROMONE_SIGHT = 40
        this.ANT_FOOD_SIGHT = 40
        this.ANT_LIFE = 30


        this.HOME = new Wall(500, 300)
        this.HOME_RADIUS = 30
    }

    GenerateAnts(){
        for (var i = 0; i < this.ANT_AMOUNT; i++) {
            this.ants.push(new Ant(500, 300, { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }, this))
        }
    }

    AddPheromone(pos, dir, type){
        switch(type){
            case e_Type.TOWARDS_FOOD:
                this.pheromones.push(new Pheromone(pos, dir, type, this.PHEROMONE_STRENGTH_TOFOOD))
                break
            case e_Type.TOWARDS_HOME:
                this.pheromones.push(new Pheromone(pos, dir, type, this.PHEROMONE_STRENGTH_TOHOME))
                break
            default:
                console.log("Invalid type.")
        }
    }

    AddWall(posx, posy){
        this.walls.push(new Wall(posx, posy))
    }

    AddFood(posx, posy){
        this.food.push(new Food(posx, posy, this.FOOD_AMOUNT))
    }
}