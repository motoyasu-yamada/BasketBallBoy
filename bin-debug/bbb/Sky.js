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
var Sky = (function (_super) {
    __extends(Sky, _super);
    function Sky() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sky.prototype.createDisplay = function () {
        var sprite = new egret.Sprite();
        var g = sprite.graphics;
        g.clear();
        g.beginFill(Palette.BackgroundA);
        g.drawRect(0, 0, GameWorld.stageWidth, GameWorld.stageHeight);
        g.endFill();
        var bw = GameWorld.stageWidth / 6;
        g.beginFill(Palette.BackgroundB);
        for (var i = 0; i < 6; i++) {
            g.drawRect(bw * i, 0, bw / 2, GameWorld.stageHeight);
        }
        g.endFill();
        return sprite;
    };
    Sky.prototype.process = function () { };
    return Sky;
}(GameObject));
__reflect(Sky.prototype, "Sky");
//# sourceMappingURL=Sky.js.map