class Node {
	constructor(x, y, size = 0) {
		this.x = x;
		this.y = y;
		this.posx = this.x * size;
		this.posy = this.y * size;
		this.size = size;
		this.red = Math.random() * 255;
		this.green = Math.random() * 255;
		this.blue = Math.random() * 255;
	}

	draw() {
		var ctx = document.getElementById('canvas').getContext('2d');
		ctx.fillStyle = 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
		ctx.fillRect(this.posx, this.posy, this.posx + this.size, this.posy + this.size);
	}

	getSimilarity(r, g, b) {
		return Math.hypot(this.red - r, this.green - g, this.blue - b);
	}

	getDistance(winner) {
		return Math.hypot(this.x - winner.x, this.y - winner.y);
	}

	adaptWeights(neighborhoodRange, distance, learning, r, g, b) {
		if (distance < 2) distance = 2;
		distance = 1 - distance / neighborhoodRange;
		var multiplier = learning * distance;

		var rdiff = Math.abs(this.red - r);
		var gdiff = Math.abs(this.green - g);
		var bdiff = Math.abs(this.blue - b);

		if (this.red < r) {
			this.red += rdiff * multiplier;
		} else {
			this.red -= rdiff * multiplier;
		}

		if (this.green < g) {
			this.green += gdiff * multiplier;
		} else {
			this.green -= gdiff * multiplier;
		}

		if (this.blue < b) {
			this.blue += bdiff * multiplier;
		} else {
			this.blue -= bdiff * multiplier;
		}

		if (this.red < 0) this.red = 0;
		if (this.green < 0) this.green = 0;
		if (this.blue < 0) this.blue = 0;

		if (this.red > 255) this.red = 255;
		if (this.green > 255) this.green = 255;
		if (this.blue > 255) this.blue = 255;

		this.red = Math.floor(this.red);
		this.green = Math.floor(this.green);
		this.blue = Math.floor(this.blue);
	}
}
