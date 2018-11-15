class TimeGauge extends GameObject {
	private remainedSecondOnStart:number;
	private restTimeMiliseconds:number;
	private courseOut = false;

	constructor(remainedSecond: number = 30) {
		super("TimeGauge");
		this.remainedSecondOnStart = remainedSecond;
		this.restTimeMiliseconds = remainedSecond * 1000;
	}

	createDisplay() {
		const sprite = new egret.Sprite();
		const g = sprite.graphics;
		g.clear();

		g.lineStyle(5, Palette.TimeGauge)
		g.beginFill(0, 0);
		g.drawRect(30, 30, GameWorld.stageWidth - 60, 60);
		g.endFill();

		if (!this.isTimeOver()) {
			g.lineStyle(0);
			g.beginFill(Palette.TimeGauge);
			g.drawRect(40, 40, (GameWorld.stageWidth - 80) * this.restTimeMiliseconds / this.remainedSecondOnStart  / 1000, 40);
			g.endFill();
		}

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
		if (this.isTimeOver()) {
			GameWorld.emit("gameover");
		}
	}
}