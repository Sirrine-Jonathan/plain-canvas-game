let Library = {
Point: class Point {
	constructor(x, y){
		this.x = x || 0;
		this.y = y || 0;
	}

	add(velocity){
		this.x += velocity.x;
		this.y += velocity.y;
		return this;
	}

	multiply = (multiplier) => {
		this.x *= multiplier;
		this.y *= multiplier;
		return this;
	}

	copy(point){
		this.x = point.x;
		this.y = point.y;
		return this;
	}

	set(point){
		this.x = point.x;
		this.y = point.y;
		return this;
	}
},
Velocity: class Velocity {
	constructor(x, y){
		this.x = x || 0;
		this.y = y || 0;
	}

	add(velocity){
		this.x += velocity.x;
		this.y += velocity.y;
		return this;
	}

	multiply = (multiplier) => {
		this.x *= multiplier;
		this.y *= multiplier;
		return this;
	}

	copy(velocity){
		this.x = velocity.x;
		this.y = velocity.y;
		return this;
	}

	set(velocity){
		this.x = velocity.x;
		this.y = velocity.y;
	}
},
Object: class Object {
	constructor(position, velocity){
		this.update = this.update.bind(this);
		this.draw = this.draw.bind(this);
		this.position = position || new Library.Point();
		this.velocity = velocity || new Library.Velocity();
		this.view = null;
	}

	update(){}

	draw(){}

},
Character: class Character extends Object {
	constructor(img_file, position, velocity){
		super(position, velocity);
		this.position = position || new Library.Point();
		this.velocity = velocity || new Library.Velocity();
		this.size = 10;
		this.color = "#000000";
		this.imageLoaded = false;
		this.img = document.createElement('img');
		this.img.src = img_file;
		this.width = 50;
		this.height = 50;
		this.cycle = 0;
		this.total_frames = 4;
		this.movingLeft = false;
		this.movingRight = false;
		this.speed = 2;
		this.wasCrouching = false;
		this.jump = false;
		let self = this;
		this.img.addEventListener('load', function(){
			self.imageLoaded = true;
		})
	}

	update = (interact) => {
		this.crouch = interact.keys['Space'];
		this.wasCrouching = this.crouch;
		if (!this.crouch && this.wasCrouching){
			this.jump = true;
			this.wasCrouching = false;
		}
		if (this.jump){

		} else if (this.crouch){

		} else {
			this.movingLeft  = interact.keys['ArrowLeft'];
			this.movingRight  = interact.keys['ArrowRight'];
			if (this.movingLeft){
				this.velocity.add(new Library.Velocity(-this.speed, 0));
			} else if (this.movingRight){
				this.velocity.add(new Library.Velocity(this.speed, 0));
			} else if (!this.jump) {
				this.velocity.set(new Library.Velocity(0, 0));
			}
		}
		this.position.add(this.velocity);
	}

	clear = (ctx) => {
		ctx.clear
	}

	draw = (ctx) => {
		if (this.imageLoaded){
			if (this.movingRight){
				this.moveRight(ctx);
			} else if (this.movingLeft){
				this.moveLeft(ctx);
			} else {
				ctx.drawImage(
					this.img, 
					this.cycle * this.width, 0, this.width, this.height, 
					this.position.x, this.position.y, this.width, this.height);
			}
		} else {
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI*2);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
	}

	moveLeft = (ctx) => {
		ctx.drawImage(
			this.img, 
			this.cycle * this.width, 0, this.width, this.height, 
			this.position.x, this.position.y, this.width, this.height);
		this.cycle--;
		if (this.cycle < 0)
			this.cycle = this.total_frames - 1;
		//this.cycle = (this.cycle - 1) % this.total_frames;
	}

	moveRight = (ctx) => {
		ctx.drawImage(
			this.img, 
			this.cycle * this.width, 0, this.width, this.height, 
			this.position.x, this.position.y, this.width, this.height);
		this.cycle = (this.cycle + 1) % this.total_frames;
	}


},
View: class View {
	constructor(canvas_id){
		let canvas = document.getElementById(canvas_id);
		this.width = canvas.width;
		this.height = canvas.height;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.ctx.translate(this.width * 0.5, this.height * 0.5);

		this.topLeft = new Library.Point(-(this.width / 2), -(this.height / 2));
		this.topRight = new Library.Point((this.width / 2), -(this.height / 2));
		this.bottomLeft = new Library.Point(-(this.width / 2), (this.height / 2));
		this.bottomRight = new Library.Point((this.width / 2), (this.height / 2));

		this.leftEdge = -(this.width / 2);
		this.rightEdge = (this.width / 2);
		this.topEdge = -(this.height / 2);
		this.bottomEdge = (this.height / 2)
	}

	applyDraw(drawFn){
		drawFn(this.ctx);
	}

	reset = () => {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
},
Game: class Game {
	constructor(canvas_id){
		this.handleInput = this.handleInput.bind(this);
		this.view = new Library.View(canvas_id);
		this.objects = {};
		this.interact = new Library.Interact(this.view);
		this.dev = false;
		this.fps = 20;
		this.time = this.getTime();
		this.normalGravity = new Library.Velocity(0, 2);
	}

	getTime(){
		let timestamp = new Date().getTime();
		return timestamp;
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

	run = () => {
		this.setDelta();
		let self = this;
		setTimeout(function(){
			self.view.reset();
			self.handleInput();
			for (let obj in self.objects){
				self.applyGravity(self.objects[obj]);
				self.objects[obj].update(self.interact);
				self.view.applyDraw(self.objects[obj].draw);
			}
			if (self.dev)
				self.view.applyDraw(self.devDraw);
			window.requestAnimationFrame(self.run);
		}, 1000 / self.fps);
	}

	applyGravity = (obj) => {
		if (!this.isOnFloor(obj)){
			let p = obj.position;
			let v = obj.velocity;
			let dt = this.getDelta();
			let nv = v.multiply(dt);
			let gravityV = new Library.Velocity().copy(this.normalGravity);
			nv.add(gravityV.multiply(dt));
			obj.velocity = nv;
		}
	}

	isOnFloor = (obj) => (
		obj.position.y + obj.height >= this.view.bottomEdge
	)

	setDev(bool){
		this.dev = bool;
	}

	devDraw = (ctx) => {
		let mousePos = this.interact.mousePos;
		ctx.fillText("(" + mousePos.x + ", " + mousePos.y + ")", 10, 50);
	}

	setDelta = () => {
		let prevTime = this.time;
		this.time = this.getTime();
		let delta = this.time - prevTime;
		if (delta > 0.15){
			delta = 0.15;
		}
		this.delta = delta;
	}

	getDelta = () => {
		return this.delta;
	}
},
Interact: class Interact {
	constructor(view){
		this.view = view;
		this.keys = {
			'ArrowUp': false,
			'ArrowDown': false,
			'ArrowRight': false,
			'ArrowLeft': false,
			'Space': false,
			'KeyW': false,
			'KeyA': false,
			'KeyS': false,
			'KeyD': false,
			'Enter': false,
			'Digit0': false,
			'Digit1': false,
			'Digit2': false,
			'Digit3': false,
			'Digit4': false,
			'Digit5': false,
			'Digit6': false,
			'Digit7': false,
			'Digit8': false,
			'Digit9': false,
			'Numpad0': false,
			'Numpad1': false,
			'Numpad2': false,
			'Numpad3': false,
			'Numpad4': false,
			'Numpad5': false,
			'Numpad6': false,
			'Numpad7': false,
			'Numpad8': false,
			'Numpad9': false,
		}
		this.mousePos = { x: null, y: null };
		this.init = this.init.bind(this);
		this.init();
	}

	init(){
		let self = this;
		document.addEventListener('keydown', function(e){
			self.keys[e.code] = true;
			//console.log(self.keys);
		});

		document.addEventListener('keyup', function(e){
			self.keys[e.code] = false;
			//console.log(self.keys);
		});

		this.view.canvas.addEventListener('mousemove', function(e){
			self.mousePos = self.getMousePos(self.view.canvas, e);
		})
	}

	getMousePos(canvas, e){
		let rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left - (canvas.width * 0.5),
			y: e.clientY - rect.top - (canvas.height * 0.5)
		}
	}

	static getKeys = () => {
		return this.keys;
	}
}
};