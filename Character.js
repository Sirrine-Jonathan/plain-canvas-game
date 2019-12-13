class Character extends Object {
	constructor(position, velocity){
		super(position, velocity);
		this.size = 10;
		this.color = "#FFFFFF";
	}

	update(){
		this.position.add(this.velocity)
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI*2);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
}