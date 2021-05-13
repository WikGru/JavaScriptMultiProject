class Feromone {

    constructor(pos, dir, type) {
        this.type = type
        this.pos = {x: pos.x, y: pos.y}
        this.dir = { x: dir.x, y: dir.y }
        if (type == e_Type.FOOD) this.strength = 20
        else this.strength = 10
    }

    ManageLife(deltaTime) {
        this.strength -= deltaTime
        if (this.strength < 0) this.strength = 0
    }
}