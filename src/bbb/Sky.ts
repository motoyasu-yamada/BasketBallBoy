
class Sky extends GameObject {

	createDisplay() {
		const sprite = new egret.Sprite();
		const g = sprite.graphics;
		g.clear();

		g.beginFill(Palette.BackgroundA);
		g.drawRect(0, 0, GameWorld.stageWidth, GameWorld.stageHeight);
		g.endFill();

		const bw = GameWorld.stageWidth / 6;
		g.beginFill(Palette.BackgroundB);
		for (let i = 0; i < 6; i ++) {
			g.drawRect(bw * i, 0, bw / 2, GameWorld.stageHeight);
		}
		g.endFill();

		return sprite;
	}

	process() { }
}