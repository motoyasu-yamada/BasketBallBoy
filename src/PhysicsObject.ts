
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
		display.x = GameWorld.xMeterToPixel(body.position[0]);
		display.y = GameWorld.yMeterToPixel(body.position[1]);
		display.rotation = 360 - (body.angle + body.shapes[0].angle) * 180 / Math.PI;
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
