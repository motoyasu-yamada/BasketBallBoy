class GameScene extends egret.Sprite {
	public constructor() {
		super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage() {
		const ballPixel = egret.MainContext.instance.stage.stageWidth / 10;
		GameWorld.init(ballPixel / BALL_SIZE_METER, this.stage);

		new Sky();

		ground = new Ground();
		timeGauge = new TimeGauge();
		timeGauge.reset();

		ball = new Ball();
		this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => ball.up(), this);

		const basketManager = new BasketManager();

		GameWorld.start();
	}
}


const BASKET_SIZE_METER = 0.15;
const BALL_SIZE_METER = 0.6;
const FPS = 60;

let ground: Ground;
let timeGauge: TimeGauge;
let ball: Ball;

function random(min: number, max: number) {
	return min + Math.random() * (max - min);
}

class GameWorld {
	public static world: p2.World;
	private static pixelPerMeter: number;
	private static meterPerPixel: number;
	private static objects: GameObject[] = [];
	private static physicsObjects: { [id: number]: PhysicsObject; } = {};
	public static stageHeight: number;
	public static stageWidth: number;
	public static stageHeightMeter: number;
	public static stageWidthMeter: number;
	public static displayObjectContainer: egret.DisplayObjectContainer;

	static addGameObject(o: GameObject) {
		this.objects.push(o);
	}

	static addPhysicsObject(o: PhysicsObject) {
		this.world.addBody(o.body);
		this.physicsObjects[o.id] = o;
	}

	static pixelToMeter(pixel: number): number {
		return pixel / this.pixelPerMeter;
	}
	static meterToPixel(meter: number): number {
		return meter * this.pixelPerMeter;
	}
	static xMeterToPixel(meter: number): number {
		return this.meterToPixel(meter);

	}
	static yMeterToPixel(meter: number): number {
		return this.stageHeight - this.meterToPixel(meter);
	}

	static init(pixelPerMeter: number, displayObjectContainer: egret.DisplayObjectContainer) {
		this.pixelPerMeter = pixelPerMeter;
		this.meterPerPixel = 1 / pixelPerMeter;

		this.stageHeight = egret.MainContext.instance.stage.stageHeight;
		this.stageWidth = egret.MainContext.instance.stage.stageWidth;
		this.stageHeightMeter = this.pixelToMeter(this.stageHeight);
		this.stageWidthMeter = this.pixelToMeter(this.stageWidth);

		this.displayObjectContainer = displayObjectContainer;

		const world = new p2.World();
		world.sleepMode = p2.World.BODY_SLEEPING;
		world.gravity = [0, -9.8];
		this.world = world;
	}

	static start() {
		this.world.on("impact", (evt) => {
			const a: PhysicsObject = this.physicsObjects[evt.bodyA.id];
			const b: PhysicsObject = this.physicsObjects[evt.bodyB.id];
			if (a.onImpact(b) === false) {
				return;
			}
			if (b.onImpact(a) === false) {
				return;
			}
		});

		this.world.on("beginContact", (evt: any) => {
			const a: PhysicsObject = this.physicsObjects[evt.bodyA.id];
			const b: PhysicsObject = this.physicsObjects[evt.bodyB.id];
			if (a.onBeginContact(b, evt.shapeA, evt.shapeB) === false) {
				return;
			}
			if (b.onBeginContact(a, evt.shapeB, evt.shapeA) === false) {
				return;
			}
		});

		this.world.on("endContact", (evt: any) => {
			const a: PhysicsObject = this.physicsObjects[evt.bodyA.id];
			const b: PhysicsObject = this.physicsObjects[evt.bodyB.id];
			if (a.onEndContact(b, evt.shapeA, evt.shapeB) === false) {
				return;
			}
			if (b.onEndContact(a, evt.shapeB, evt.shapeA) === false) {
				return;
			}
		});

		const loop = (e: egret.Event) => {
			const deltaTime = 1000 / FPS;
			this.world.step(1 / 60, deltaTime / 1000, 10);
			const l = this.objects.length;
			for (let i: number = 0; i < l; i++) {
				const o = this.objects[i];
				if (!o.inited && !o.toDelete) {
					o.init();
				}
			}

			let someoneIsDeleted = false;
			for (let i: number = 0; i < l; i++) {
				const o = this.objects[i];
				if (o.inited && !o.toDelete) {
					o.process();
				}
			}

			for (let i: number = 0; i < l; i++) {
				const o = this.objects[i];
				if (o.toDelete) {
					someoneIsDeleted = true;
					continue;
				}
				if (o.inited) {
					o.update();
				}
			}

			if (!someoneIsDeleted) {
				return;
			}
			this.objects = this.objects.filter((i) => {
				if (!i.toDelete) {
					return true;
				}
				i.delete();
				return false;
			});
		};

		this.displayObjectContainer.addEventListener(egret.Event.ENTER_FRAME, loop, this);
	}
}

abstract class GameObject {
	protected display: egret.DisplayObject;
	toDelete: boolean = false;
	inited: boolean = false;

	constructor() {
		GameWorld.addGameObject(this);
	}

	init() {
		this.resetDisplay();
		this.inited = true;
	}

	protected resetDisplay() {
		if (this.display) {
			GameWorld.displayObjectContainer.removeChild(this.display);
			this.display = null;
		}
		this.display = this.createDisplay();
		if (this.display) {
			GameWorld.displayObjectContainer.addChild(this.display);
		}
	}

	createDisplay(): egret.DisplayObject {
		return null;
	}

	abstract process(): void;

	update() { }

	markToDelete() {
		this.toDelete = true;
	}

	delete() {
		GameWorld.displayObjectContainer.removeChild(this.display);
	}
}

abstract class PhysicsObject extends GameObject {
	public body: p2.Body;

	constructor() {
		super();
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
		GameWorld.world.removeBody(this.body);
		this.body.displays = [];
		this.body = null;
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

class TimeGauge extends GameObject {
	private restTimeMiliseconds = 0;
	private courseOut = false;

	reset() {
		this.restTimeMiliseconds = 60 * 1000;
		this.courseOut = false;
	}

	createDisplay() {
		const sprite = new egret.Sprite();
		const g = sprite.graphics;
		g.clear();
		if (!this.isTimeOver()) {
			g.lineStyle(0);
			g.beginFill(0x0000ff, 0.8);
			g.drawRect(0, 0, GameWorld.stageWidth * this.restTimeMiliseconds / 60 / 1000, 30);
			g.endFill();
		}

		g.lineStyle(2, 0xffffff, 0.8)
		g.beginFill(0x8080ff, 0);
		g.drawRect(0, 0, GameWorld.stageWidth, 30);
		g.endFill();

		return sprite;
	}

	isTimeOver(): boolean {
		return this.restTimeMiliseconds <= 0;
	}

	reduceByCourseOut(): void {
		this.courseOut = true;
	}

	process() {
		if (this.courseOut) {
			this.restTimeMiliseconds -= 3000;
			this.courseOut = false;
		} else {
			this.restTimeMiliseconds -= 1000 / FPS;
		}
		this.resetDisplay();
	}
}

class Sky extends GameObject {

	createDisplay() {
		const sprite = new egret.Sprite();
		const g = sprite.graphics;
		g.clear();
		g.beginFill(0x8080ff, 1);
		g.drawRect(0, 0, GameWorld.stageWidth, GameWorld.stageHeight);
		g.endFill();

		g.beginFill(0xc0c0ff);
		g.drawCircle(0, 0, GameWorld.stageWidth);
		g.endFill();
		return sprite;
	}

	process() { }
}

class Ball extends PhysicsObject {
	private bx: number;
	private toUp: number = 0;

	constructor() {
		super();
		this.bx = GameWorld.stageWidthMeter / 4;
	}

	options() {
		return { mass: 1, force: [0, -300], position: [this.bx, GameWorld.stageHeightMeter / 2] };
	}

	up() {
		this.toUp++;
	}

	process() {
		this.body.position[0] = this.bx;
		this.body.angle = 0;
		if (this.toUp) {
			this.body.applyForceLocal([0, 500 * this.toUp], [0, 0]);
			this.toUp = 0;
		}
	}

	createShape(): p2.Shape {
		return new p2.Circle({ radius: BALL_SIZE_METER / 2 });
	}

	createDisplay(): egret.DisplayObject {
		const shape = new egret.Shape();
		shape.graphics.beginFill(0xff0000);
		shape.graphics.drawCircle(0, 0, GameWorld.meterToPixel(BALL_SIZE_METER / 2));
		shape.graphics.endFill();
		return shape;
	}

	onImpact(mated: PhysicsObject) {
		if (mated.id === ground.id) {
			timeGauge.reduceByCourseOut();
			return false;
		}
		return true;
	}

	private toPassBasket = 0;
	private toPassBasketSide = 0;

	onEndContact(mated: PhysicsObject, myShape: p2.Shape, matedShape: p2.Shape): boolean {
		if (!(mated instanceof Basket)) {
			return true;
		}
		this.toPassBasket = 0;
		const hit = mated.hit(matedShape, this.body.position);
		if (hit === 0) {
			return false;
		}
		if (hit === this.toPassBasketSide) {
			console.log(`XXXXX TOUCH ${mated.id}(${hit})`);
			return false;
		}
		console.log(`OOOOO PASS ${mated.id}(${hit})`);

		return false;
	}

	onBeginContact(mated: PhysicsObject, myShape: p2.Shape, matedShape: p2.Shape): boolean {
		if (!(mated instanceof Basket)) {
			return true;
		}
		const hit = mated.hit(matedShape, this.body.position);
		if (hit === 0) {
			return false;
		}
		this.toPassBasket = mated.id;
		this.toPassBasketSide = hit;
		return false;
	}
}

class Ground extends PhysicsObject {
	options() {
		return { position: [GameWorld.stageWidthMeter / 2, 0], type: p2.Body.STATIC };
	}

	addShapeToBody() {
		const w = GameWorld.stageWidthMeter;
		this.body.addShape(new p2.Box({ width: w, height: 1 }), [0, 0.5]);
		this.body.addShape(new p2.Box({ width: w, height: 1 }), [0, GameWorld.stageHeightMeter - 0.5]);
		this.body.damping = 1;
	}

	createDisplay(): egret.DisplayObject {
		const w = GameWorld.stageWidth;
		const h = GameWorld.meterToPixel(1);
		const shape = new egret.Shape();
		const g = shape.graphics;
		g.beginFill(0x400000);
		g.drawRect(-w / 2, - h, w, h);
		g.drawRect(-w / 2, - GameWorld.stageHeight, w, h);
		shape.graphics.endFill();
		return shape;
	}

	process() {
	}
}

class BasketManager extends GameObject {
	private lastBasketCreation = 2000;

	process() {
		this.lastBasketCreation += 1000 / FPS;
		const gn = Math.random();
		if (2000 < this.lastBasketCreation && gn < 0.05) {
			new Basket();
			this.lastBasketCreation = 0;
		}
	}
}

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
		return { gravityScale: 0, mass: 40, position: [10, y], velocity: [this.velocityX, 0] };
	}

	createDisplay(): egret.Shape {
		const lx = GameWorld.xMeterToPixel((0 - this.halfLengthMeter));
		const rx = GameWorld.xMeterToPixel((0 + this.halfLengthMeter));

		const shape = new egret.Shape();
		const g = shape.graphics;
		g.beginFill(0xffff00, 1);
		g.drawCircle(lx, 0, GameWorld.meterToPixel(BASKET_SIZE_METER));
		g.drawCircle(rx, 0, GameWorld.meterToPixel(BASKET_SIZE_METER));

		g.lineStyle(5, 0xfff000, 0.5);
		g.moveTo(lx, 0);
		g.lineTo(rx, 0);

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
