
class TitleScene extends eui.Component implements  eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener( eui.UIEvent.COMPLETE, this.uiCompHandler, this );
        this.skinName = "resource/custom_skins/TitleScene.exml";		
    }

    private uiCompHandler():void {
        this.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt:egret.TouchEvent )=>{
            SoundManager.playButtonPressed();
            this.parent.addChild(new GameScene());
            this.parent.removeChild(this);            
        }, this );
    }
}

