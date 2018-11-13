class Ground extends PhysicsObject {
	constructor(){
		super("Ground");
	}
	
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