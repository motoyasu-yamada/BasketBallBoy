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
var TitleScene = (function (_super) {
    __extends(TitleScene, _super);
    function TitleScene() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    TitleScene.prototype.onAddToStage = function () {
        var _this = this;
        this.textField = new egret.TextField();
        this.textField.text = "Touch To Start";
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.parent.once(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            _this.parent.addChild(new GameScene());
            _this.parent.removeChild(_this);
        }, this);
    };
    return TitleScene;
}(egret.Sprite));
__reflect(TitleScene.prototype, "TitleScene");
//# sourceMappingURL=TitleScene.js.map