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
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/custom_skins/TitleScene.exml";
        return _this;
    }
    TitleScene.prototype.uiCompHandler = function () {
        var _this = this;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            _this.parent.addChild(new GameScene());
            _this.parent.removeChild(_this);
        }, this);
    };
    return TitleScene;
}(eui.Component));
__reflect(TitleScene.prototype, "TitleScene", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=TitleScene.js.map