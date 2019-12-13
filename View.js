class View {
	constructor(canvas_id){
		let canvas = document.getElementById(canvas_id);
		this.width = canvas.width;
		this.height = canvas.height;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.ctx.translate(this.width * 0.5, this.height * 0.5);
	}

	initOrigin(){
		this.origin = new Point(0, 0);
	}

	applyDraw(drawFn){
		drawFn(this.ctx);
	}

	reset(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
}