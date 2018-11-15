class SoundManager
{
    private static inited = false;
    private static buttonPressed: egret.Sound;
    private static gameOver: egret.Sound;
    private static success: egret.Sound;        

    public static init() {
        if (this.inited) {
            return;
        }
        this.buttonPressed = RES.getRes("btn_mp3");
        this.gameOver = RES.getRes("gameover_mp3");
        this.success = RES.getRes("success_mp3");        
        this.inited = true;
    }

    public static playButtonPressed() {
        this.buttonPressed.play(0,1);
    }

    public static playGameOver() {
        this.gameOver.play(0,1);
    }

    public static playSuccess() {
        this.success.play(0,1);
    }
}