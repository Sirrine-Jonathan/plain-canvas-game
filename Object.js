class Object {
	constructor(position, velocity){
		this.update = this.update.bind(this);
		this.draw = this.draw.bind(this);
		this.position = position || new Point();
		this.velocity = velocity || new Velocity();
		this.view = null;
	}

	update(){

	}

	draw(){

	}
}