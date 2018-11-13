

class Ball extends PhysicsObject {
	private bx: number;
	private toUp: number = 0;

	constructor() {
		super("Ball");
		this.bx = GameWorld.stageWidthMeter / 4;
	}

	options() {
		return { mass: 1, force: [0, -300], position: [this.bx, GameWorld.stageHeightMeter / 2] };
	}

	up() {
		console.log("UP");
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
		const ground = GameWorld.getGameObject<Ground>("Ground");
		const timeGauge = GameWorld.getGameObject<TimeGauge>("TimeGauge");
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
		const scoreUi = GameWorld.getGameObject<ScoreUi>("ScoreUi");
		scoreUi.countup();

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

	createEffect()
	{
		const effect = new egret.Shape();
		effect.graphics.beginFill(0xffffff,0.5);
		effect.graphics.drawRect(0,0,8,8);
		effect.graphics.endFill();

		const texture = new egret.RenderTexture();
		texture.drawToTexture(effect);

        const system = new particle.GravityParticleSystem(texture,{});
		this.display.parent.addChild(system);
		system.emissionTime = 3000;
		system.emissionRate = 200;
        system.start();
        system.y = this.display.y;
        system.x = this.display.x;
        system.emitterX = 0
        system.emitterY = 0;
        system.scaleX = system.scaleY = 1.5;		
	}
}