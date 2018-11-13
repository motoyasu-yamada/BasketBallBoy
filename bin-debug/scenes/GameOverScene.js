var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameOverScene = (function (_super) {
    __extends(GameOverScene, _super);
    function GameOverScene(lastScore) {
        var _this = _super.call(this) || this;
        _this.lastScore = lastScore;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/custom_skins/GameOverScene.exml";
        return _this;
    }
    GameOverScene.prototype.uiCompHandler = function () {
        var _this = this;
        this.lastScoreLabel.text = "" + this.lastScore;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            GameMain.destroy();
            _this.parent.addChild(new TitleScene());
            _this.parent.removeChild(_this);
        }, this);
    };
    return GameOverScene;
}(eui.Component));
__reflect(GameOverScene.prototype, "GameOverScene", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GameOverScene.js.map