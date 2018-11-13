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
        this.textField.x = 50;
        this.textField.y = 100;
        this.textField.size = 30;
        this.textField.textColor = 0xffffff;

		return this.textField;
	}

	process() {
	}
}