class ScoreUi extends GameObject {
	private score: number = 0;
    private textField: egret.TextField;

	constructor() {
		super("ScoreUi");
	}
	
	reset() {
		this.score = 0;
	}
	
	get lastScore() : number {
		return this.score;
	}

    countup() {
        this.score ++;
        this.textField.text = this.score.toString();
    }

	createDisplay() {
		this.textField = new egret.TextField();
        this.textField.x = GameWorld.stageWidth / 2;
        this.textField.y = 120;
        this.textField.size = 60;
		this.textField.textAlign = "center";
        this.textField.textColor = Palette.Score;

		return this.textField;
	}

	process() {
	}
}