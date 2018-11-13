
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