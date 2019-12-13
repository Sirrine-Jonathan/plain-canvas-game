class Point {
	constructor(x, y){
		this.x = x || 0;
		this.y = y || 0;
	}

	add(velocity){
		this.x += velocity.x;
		this.y += velocity.y;
	}
}