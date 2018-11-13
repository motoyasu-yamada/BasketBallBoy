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
		if (!this.isTimeOver()) {
			g.lineStyle(0);
			g.beginFill(0x0000ff, 0.8);
			g.drawRect(0, 0, GameWorld.stageWidth * this.restTimeMiliseconds / this.remainedSecondOnStart  / 1000, 30);
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
		if (this.isTimeOver()) {
			GameWorld.emit("gameover");
		}
	}
}