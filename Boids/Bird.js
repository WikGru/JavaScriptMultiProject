class Bird {
    velocity = 3;
    turnSpeed = 0.08;
    pushingInfluence = 5;
    pullingInfluence = 180;
    dirAdjustInfluence = 10;

    constructor(posx, posy, dir) {
        this.pos = { x: posx, y: posy };
        this.dir = dir;
        this.normalizeDir();
    }

    normalizeDir() {
        if (Math.abs(this.dir.x + this.dir.y)) {
            var tempx = this.dir.x;
            var length = Math.abs(this.dir.x) + Math.abs(this.dir.y);
            this.dir.x = this.dir.x / length;
            this.dir.y = this.dir.y / length;
        }
    }

    steerAwayFrom(pos) {
        var dirx = this.pos.x - pos.x;
        var diry = this.pos.y - pos.y;

        if (dirx != 0) dirx = dirx / Math.abs(dirx);
        if (diry != 0) diry = diry / Math.abs(diry);
        this.dir.x += dirx / this.pushingInfluence;
        this.dir.y += diry / this.pushingInfluence;
    }

    steerTowardsPosition(pos) {
        var dirx = this.pos.x - pos.x;
        var diry = this.pos.y - pos.y;

        if (dirx != 0) dirx = dirx / Math.abs(dirx);
        if (diry != 0) diry = diry / Math.abs(diry);
        this.dir.x -= dirx / this.pullingInfluence;
        this.dir.y -= diry / this.pullingInfluence;
    }

    adjustDirTowards(dir) {
        this.dir.x += dir.x / this.dirAdjustInfluence;
        this.dir.y += dir.y / this.dirAdjustInfluence;
    }

    move() {
        this.normalizeDir();
        this.pos.x += this.dir.x * this.velocity;
        this.pos.y += this.dir.y * this.velocity;
    }

    distance(bird) {
        var distx = Math.abs(this.pos.x - bird.pos.x);
        var disty = Math.abs(this.pos.y - bird.pos.y);
        var ret = distx + disty;
        return ret;
    }


}