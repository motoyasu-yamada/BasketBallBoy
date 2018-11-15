
abstract class PhysicsObject extends GameObject {
	public body: p2.Body;

	constructor(name:string = null) {
		super(name);
	}

	get id(): number {
		return this.body.id;
	}

	init() {
		this.body = new p2.Body(this.options());
		this.addShapeToBody();
		this.body.displays = [this.display];
		GameWorld.addPhysicsObject(this);
		super.init();
	}

	abstract options(): any;

	addShapeToBody() {
		const shape = this.createShape();
		this.body.addShape(shape);
	}

	createShape(): p2.Shape {
		throw new Error("createShape or addShapeToBody must be implemented");
	}

	update() {
		const body = this.body;
		const display: egret.DisplayObject = this.display;
		if (!display) {
			return;
		}
		display.x = this.egretX;
		display.y = this.egretY;
		display.rotation = this.egretAngel;
	}

	get meterX(): number {
		return this.body.position[0];
	}

	get meterY():number {
		return this.body.position[1];
	}

	get egretX(): number {
		return GameWorld.xMeterToPixel(this.meterX);
	}

	get egretY(): number {
		return GameWorld.yMeterToPixel(this.meterY);
	}

	get egretAngel(): number {
		return (this.body.angle + this.body.shapes[0].angle) * 180 / Math.PI;
	}

	delete() {
		super.delete();
		if (this.body) {
			GameWorld.world.removeBody(this.body);
			this.body.displays = [];
			this.body = null;
		}
	}

	onImpact(mated: PhysicsObject): boolean {
		return true;
	}

	onEndContact(mated: PhysicsObject, myShape: p2.Shape, matedShape: p2.Shape): boolean {
		return true;
	}

	onBeginContact(mated: PhysicsObject, myShape: p2.Shape, matedShape: p2.Shape): boolean {
		return true;
	}
}
