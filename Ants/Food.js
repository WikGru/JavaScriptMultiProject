class Food {

    constructor(posX, posY) {
        this.pos = { x: posX, y: posY };
        this.amount = 500
    }

    DecreaseAmount() {
        this.amount -= 1
    }
}