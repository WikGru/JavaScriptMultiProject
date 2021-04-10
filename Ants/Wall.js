class Wall {

    constructor(posX, posY) {
        this.pos = {x: posX, y: posY};
    }

    GetPosX(){
        return this.pos.x;
    }

    GetPosY(){
        return this.pos.y;
    }
}