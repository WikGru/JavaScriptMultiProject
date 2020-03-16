class Human {
    screen = { w: 0, h: 0 }
    colliderTimeOut = 0.15;
    colliderTimer = 0;
    size = 10;
    speed = 3;
    sickTime = 10;
    wasSick = false;
    isSick = false;

    sickColor = "#8800FF"
    immuneColor = "#00FFFF"
    healthyColor = "#22AA22"

    activeColor = "#FFFFFF"

    constructor(posx, posy, dirx, diry, isSick, screen) {
        this.pos = { x: posx, y: posy }
        this.dir = { x: dirx, y: diry };
        this.isSick = isSick;
        this.screen = screen;
        this.sickTime *= 30;
        this.colliderTimeOut *= 30;
    }

    pickColor() {
        if (this.wasSick) {
            this.activeColor = this.immuneColor
            // console.log("Immune")
        } else if (this.isSick) {
            this.activeColor = this.sickColor
            // console.log("Sick")
        } else {
            this.activeColor = this.healthyColor;
            // console.log("Healthy")
        }
    }

    normalizeDir() {
        if (Math.abs(this.dir.x + this.dir.y)) {
            var length = Math.abs(this.dir.x) + Math.abs(this.dir.y);
            this.dir.x = this.dir.x / length;
            this.dir.y = this.dir.y / length;
        }
    }

    manageSickness() {
        if (this.isSick) {
            this.sickTime -= 1
            if (this.sickTime <= 0) {
                this.isSick = false;
                this.wasSick = true;
            }
        }
    }

    move() {
        this.normalizeDir();
        this.pickColor();

        this.pos = { x: this.pos.x + this.dir.x * this.speed, y: this.pos.y + this.dir.y * this.speed };
        if (this.pos.x > this.screen.w || this.pos.x < 0) this.dir.x *= -1
        if (this.pos.y > this.screen.h || this.pos.y < 0) this.dir.y *= -1
        if (this.isSick) this.manageSickness();
    }

    manageCollisionWith(human) {
        if ((human.isSick && this.isSick) || (!human.isSick || !this.isSick) ) {
            if(this.colliderTimer <=0) {
                this.dir = { x: -this.dir.x, y: -this.dir.y };
                this.colliderTimer = this.colliderTimeOut;
            } else{
                this.colliderTimer -=1;
            }
        }
        if (human.isSick && !this.wasSick) {
            this.isSick = true;
        }
    }

    detectCollisions(humans) {
        humans.forEach((human) => {
            this.dist = Math.hypot(this.pos.x - human.pos.x, this.pos.y - human.pos.y)
            if (this.dist > 0 && this.dist < this.size) {
                this.manageCollisionWith(human);
                console.log(this.dist)
            }
        })
    }

}