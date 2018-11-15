class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private async onAddToStage(event: egret.Event) {
        const loadResource = async () => {
            try {
                const loadingScene = new LoadingScene();
                this.stage.addChild(loadingScene);
                await RES.loadConfig("resource/default.res.json", "resource/");
                await RES.loadGroup("preload", 0, loadingScene);
                SoundManager.init();
                this.stage.removeChild(loadingScene);   
            } catch(e) {
                console.error(e);
            }         
        };
        await loadResource();

        const titleScene = new TitleScene();
        this.stage.addChild(titleScene);
    }
}