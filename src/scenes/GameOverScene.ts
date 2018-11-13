class GameOverScene extends eui.Component implements  eui.UIComponent {
	private lastScoreLabel: eui.Label;
	private lastScore: number;

	public constructor(lastScore: number) {
		super();
		this.lastScore = lastScore;
        this.addEventListener( eui.UIEvent.COMPLETE, this.uiCompHandler, this );
        this.skinName = "resource/custom_skins/GameOverScene.exml";		
	}

    private uiCompHandler():void {
		this.lastScoreLabel.text = `${this.lastScore}`;

        this.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt:egret.TouchEvent )=>{
            GameMain.destroy();
            this.parent.addChild(new TitleScene());
            this.parent.removeChild(this);            
        }, this );
    }
	
}
