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
var Basket = (function (_super) {
    __extends(Basket, _super);
    function Basket() {
        var _this = _super.call(this) || this;
        _this.lengthMeter = BALL_SIZE_METER + BASKET_SIZE_METER + random(0.1, 0.5);
        _this.halfLengthMeter = _this.lengthMeter / 2;
        _this.velocityX = random(-2.5, -1);
        return _this;
    }
    Basket.prototype.options = function () {
        var y = random(2, 7);
        return { gravityScale: 0, mass: 400, position: [10, y], velocity: [this.velocityX, 0], type: p2.Body.KINEMATIC };
    };
    Basket.prototype.createDisplay = function () {
        var lx = GameWorld.xMeterToPixel((0 - this.halfLengthMeter));
        var rx = GameWorld.xMeterToPixel((0 + this.halfLengthMeter));
        var shape = new egret.Shape();
        var g = shape.graphics;
        g.beginFill(0xffff00, 1);
        g.drawCircle(lx, 0, GameWorld.meterToPixel(BASKET_SIZE_METER));
        g.drawCircle(rx, 0, GameWorld.meterToPixel(BASKET_SIZE_METER));
        g.lineStyle(5, 0xfff000, 0.5);
        g.moveTo(lx, 0);
        g.lineTo(rx, 0);
        g.endFill();
        return shape;
    };
    Basket.prototype.addShapeToBody = function () {
        var left = new p2.Circle({ radius: BASKET_SIZE_METER });
        var right = new p2.Circle({ radius: BASKET_SIZE_METER });
        this.line = new p2.Line({ length: this.halfLengthMeter * 2 });
        this.line.sensor = true;
        this.body.addShape(left, [-this.halfLengthMeter, 0]);
        this.body.addShape(right, [+this.halfLengthMeter, 0]);
        this.body.addShape(this.line, [0, 0]);
    };
    Basket.prototype.process = function () {
        if (this.body && this.body.position[0] < -1) {
            this.markToDelete();
        }
    };
    Basket.prototype.hit = function (shape, ballPosition) {
        if (shape.id !== this.line.id) {
            return 0;
        }
        var a = this.body.angle;
        var ax = Math.cos(a);
        var ay = Math.sin(a);
        var bx = ballPosition[0] - this.body.position[0];
        var by = ballPosition[1] - this.body.position[1];
        var z = ax * by - ay * bx;
        if (z < 0) {
            return 1;
        }
        return -1;
    };
    return Basket;
}(PhysicsObject));
__reflect(Basket.prototype, "Basket");
//# sourceMappingURL=Basket.js.map