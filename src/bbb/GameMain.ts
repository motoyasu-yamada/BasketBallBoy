const BASKET_SIZE_METER = 0.15;
const BALL_SIZE_METER = 0.6;
const FPS = 60;

class GameMain 
{
    public static destroy() 
    {
        console.log("+++++++++++++ GameMain#destory");
        GameWorld.destroy();
    }

    public static start(stage:egret.Stage, onGameOver:()=>void) 
    {
        console.log("+++++++++++++ GameMain#start");

		const ballPixel = egret.MainContext.instance.stage.stageWidth / 10;
		GameWorld.init(ballPixel / BALL_SIZE_METER, stage);

		new Sky();

		new Ground();
		new TimeGauge(30);
        new ScoreUi();
        const ball = new Ball();

		stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => ball.up(), this);

		const basketManager = new BasketManager();

        GameWorld.on("gameover",() => {
            GameWorld.pause();
            onGameOver();
        });

        GameWorld.start();
    }

}