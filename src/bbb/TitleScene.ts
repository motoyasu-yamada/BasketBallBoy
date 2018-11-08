
class TitleScene extends egret.Sprite {
    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private textField: egret.TextField;

    private onAddToStage(): void {
        this.textField = new egret.TextField();
        this.textField.text = "Touch To Start";
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";

        this.parent.once(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
            this.parent.addChild(new GameScene());
            this.parent.removeChild(this);
        }, this);
    }
}

