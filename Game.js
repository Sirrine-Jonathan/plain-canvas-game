let library = {
point: class Point {
	constructor(x, y){
		this.x = x || 0;
		this.y = y || 0;
	}

	add(velocity){
		this.x += velocity.x;
		this.y += velocity.y;
	}
},
velocity: class Velocity {
	constructor(x, y){
		this.x = x || 0;
		this.y = y || 0;
	}
},
object: class Object {
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
},
character: class Character extends Object {
	constructor(position, velocity){
		super(position, velocity);
		this.size = 10;
		this.color = "#FFFFFF";
	}

	update(){
		this.position.add(this.velocity);
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI*2);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
},
view: class View {
	constructor(canvas_id){
		let canvas = document.getElementById(canvas_id);
		this.width = canvas.width;
		this.height = canvas.height;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}

	initOrigin(){
		this.origin = new Point(this.width / 2, this.height / 2);
	}

	applyDraw(drawFn){
		drawFn(this.ctx);
	}

	reset(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
},
game: class Game {
	constructor(canvas_id){
		this.run = this.run.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.view = new View(canvas_id);
		this.objects = {};
	}

	handleInput(){

	}

	addObject(obj){
		obj.id = this.generateID();
		obj.view = this.view;
		this.objects[obj.id] = obj;
	}

	generateID(){
		let alpha = 'abcdefghijklmnop';
		let numeric = '1234567890';
		let symbol = '!@#$%^&*()';
		let char = [alpha, numeric, symbol];

		let id = '';
		do {
			for (let i = 0; i < 20; i++){
				let num = Math.floor(Math.random() * char.length);
				let index = Math.floor(Math.random() * char[num].length);
				id += char[num][index];
			}
		} while (this.objects[id]);
		return id;
	}

	run(){
		this.view.reset();
		this.handleInput();
		for (let obj in this.objects){
			this.objects[obj].update();
			this.view.applyDraw(this.objects[obj].draw);
		}
		window.requestAnimationFrame(this.run);
	}
}
};