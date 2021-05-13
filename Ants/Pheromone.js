class Pheromone {

    constructor(pos, dir, type, strength) {
        this.type = type
        this.pos = {x: pos.x, y: pos.y}
        this.dir = {x: dir.x, y: dir.y}
        this.strength = strength
    }

    Update(dt, data) {
        this.strength -= dt
        if (this.strength < 0) this.strength = 0
        // if (this.strength <= 0) data.pheromones.splice(data.pheromones.indexOf(this), 1)
        // delete this
    }
}