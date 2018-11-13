var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BASKET_SIZE_METER = 0.15;
var BALL_SIZE_METER = 0.6;
var FPS = 60;
var GameMain = (function () {
    function GameMain() {
    }
    GameMain.destroy = function () {
        console.log("+++++++++++++ GameMain#destory");
        GameWorld.destroy();
    };
    GameMain.start = function (stage, onGameOver) {
        console.log("+++++++++++++ GameMain#start");
        var ballPixel = egret.MainContext.instance.stage.stageWidth / 10;
        GameWorld.init(ballPixel / BALL_SIZE_METER, stage);
        new Sky();
        new Ground();
        new TimeGauge(30);
        new ScoreUi();
        var ball = new Ball();
        stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) { return ball.up(); }, this);
        var basketManager = new BasketManager();
        GameWorld.on("gameover", function () {
            GameWorld.pause();
            onGameOver();
        });
        GameWorld.start();
    };
    return GameMain;
}());
__reflect(GameMain.prototype, "GameMain");
//# sourceMappingURL=GameMain.js.map