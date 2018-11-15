class Basket extends PhysicsObject {
	private lengthMeter: number;
	private halfLengthMeter: number;
	private velocityX: number;
	private line: p2.Line;

	constructor() {
		super();
		this.lengthMeter = BALL_SIZE_METER + BASKET_SIZE_METER + random(0.1, 0.5);
		this.halfLengthMeter = this.lengthMeter / 2;
		this.velocityX = random(-2.5, -1);
	}

	options() {
		const y = random(2, 7);
		return { gravityScale: 0, mass: 400, position: [10, y], velocity: [this.velocityX, 0], type: p2.Body.KINEMATIC };
	}

	createDisplay(): egret.Shape {
		const lx = GameWorld.xMeterToPixel((0 - this.halfLengthMeter));
		const rx = GameWorld.xMeterToPixel((0 + this.halfLengthMeter));

		const shape = new egret.Shape();
		const g = shape.graphics;
		g.beginFill(Palette.BasketRim, 1);
		
		g.lineStyle(5, Palette.BasketNet);
		g.moveTo(lx, 0);
		g.lineTo(rx, 0);

		g.lineStyle(5,Palette.BasketRimBorder);
		g.drawCircle(lx, 0, GameWorld.meterToPixel(BASKET_SIZE_METER));
		g.drawCircle(rx, 0, GameWorld.meterToPixel(BASKET_SIZE_METER));

		g.endFill();

		return shape;
	}

	addShapeToBody() {
		let left = new p2.Circle({ radius: BASKET_SIZE_METER });
		let right = new p2.Circle({ radius: BASKET_SIZE_METER });
		this.line = new p2.Line({ length: this.halfLengthMeter * 2 });
		this.line.sensor = true;

		this.body.addShape(left, [- this.halfLengthMeter, 0]);
		this.body.addShape(right, [+ this.halfLengthMeter, 0]);
		this.body.addShape(this.line, [0, 0]);
	}

	process() {
		if (this.body && this.body.position[0] < -1) {
			this.markToDelete();
		}
	}

	hit(shape: p2.Shape, ballPosition: number[]): number {
		if (shape.id !== this.line.id) {
			return 0;
		}
		const a = this.body.angle;
		const ax = Math.cos(a);
		const ay = Math.sin(a);
		const bx = ballPosition[0] - this.body.position[0];
		const by = ballPosition[1] - this.body.position[1];
		const z = ax * by - ay * bx;
		if (z < 0) {
			return 1;
		}
		return -1;
	}
}
