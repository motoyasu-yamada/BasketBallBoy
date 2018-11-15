var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SoundManager = (function () {
    function SoundManager() {
    }
    SoundManager.init = function () {
        if (this.inited) {
            return;
        }
        this.buttonPressed = RES.getRes("btn_mp3");
        this.gameOver = RES.getRes("gameover_mp3");
        this.success = RES.getRes("success_mp3");
        this.inited = true;
    };
    SoundManager.playButtonPressed = function () {
        this.buttonPressed.play(0, 1);
    };
    SoundManager.playGameOver = function () {
        this.gameOver.play(0, 1);
    };
    SoundManager.playSuccess = function () {
        this.success.play(0, 1);
    };
    SoundManager.inited = false;
    return SoundManager;
}());
__reflect(SoundManager.prototype, "SoundManager");
//# sourceMappingURL=SoundManager.js.map