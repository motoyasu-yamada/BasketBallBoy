class GameScene extends egret.Sprite {
	public constructor() {
		super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage() {
		GameMain.start(this.parent.stage,() => {
			const score = GameWorld.getGameObject<ScoreUi>("ScoreUi"); 
            this.parent.addChild(new GameOverScene(score.lastScore));
            this.parent.removeChild(this);	
		});
	}
}

