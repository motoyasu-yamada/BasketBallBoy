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
var Ground = (function (_super) {
    __extends(Ground, _super);
    function Ground() {
        return _super.call(this, "Ground") || this;
    }
    Ground.prototype.options = function () {
        return { position: [GameWorld.stageWidthMeter / 2, 0], type: p2.Body.STATIC };
    };
    Ground.prototype.addShapeToBody = function () {
        var w = GameWorld.stageWidthMeter;
        this.body.addShape(new p2.Box({ width: w, height: 1 }), [0, 0.5]);
        this.body.addShape(new p2.Box({ width: w, height: 1 }), [0, GameWorld.stageHeightMeter - 0.5]);
        this.body.damping = 1;
    };
    Ground.prototype.createDisplay = function () {
        var w = GameWorld.stageWidth;
        var h = GameWorld.meterToPixel(1);
        var shape = new egret.Shape();
        var g = shape.graphics;
        g.beginFill(Palette.Ground);
        g.drawRect(-w / 2, -h, w, h);
        g.drawRect(-w / 2, -GameWorld.stageHeight, w, h);
        shape.graphics.endFill();
        return shape;
    };
    Ground.prototype.process = function () {
    };
    return Ground;
}(PhysicsObject));
__reflect(Ground.prototype, "Ground");
//# sourceMappingURL=Ground.js.map