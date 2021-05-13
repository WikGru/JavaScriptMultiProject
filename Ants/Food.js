class Food {

    constructor(posX, posY, amount) {
        this.pos = {x: posX, y: posY};
        this.amount = amount
    }

    DecreaseAmount(food){
        this.amount -= 1
        if (this.amount <= 0) food.splice(food.indexOf(this), 1)
        delete this
    }
}