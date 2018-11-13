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
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        var _this = _super.call(this, "Ball") || this;
        _this.toUp = 0;
        _this.toPassBasket = 0;
        _this.toPassBasketSide = 0;
        _this.bx = GameWorld.stageWidthMeter / 4;
        return _this;
    }
    Ball.prototype.options = function () {
        return { mass: 1, force: [0, -300], position: [this.bx, GameWorld.stageHeightMeter / 2] };
    };
    Ball.prototype.up = function () {
        console.log("UP");
        this.toUp++;
    };
    Ball.prototype.process = function () {
        this.body.position[0] = this.bx;
        this.body.angle = 0;
        if (this.toUp) {
            this.body.applyForceLocal([0, 500 * this.toUp], [0, 0]);
            this.toUp = 0;
        }
    };
    Ball.prototype.createShape = function () {
        return new p2.Circle({ radius: BALL_SIZE_METER / 2 });
    };
    Ball.prototype.createDisplay = function () {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000);
        shape.graphics.drawCircle(0, 0, GameWorld.meterToPixel(BALL_SIZE_METER / 2));
        shape.graphics.endFill();
        return shape;
    };
    Ball.prototype.onImpact = function (mated) {
        var ground = GameWorld.getGameObject("Ground");
        var timeGauge = GameWorld.getGameObject("TimeGauge");
        if (mated.id === ground.id) {
            timeGauge.reduceByCourseOut();
            return false;
        }
        return true;
    };
    Ball.prototype.onEndContact = function (mated, myShape, matedShape) {
        if (!(mated instanceof Basket)) {
            return true;
        }
        this.toPassBasket = 0;
        var hit = mated.hit(matedShape, this.body.position);
        if (hit === 0) {
            return false;
        }
        if (hit === this.toPassBasketSide) {
            console.log("XXXXX TOUCH " + mated.id + "(" + hit + ")");
            return false;
        }
        console.log("OOOOO PASS " + mated.id + "(" + hit + ")");
        var scoreUi = GameWorld.getGameObject("ScoreUi");
        scoreUi.countup();
        return false;
    };
    Ball.prototype.onBeginContact = function (mated, myShape, matedShape) {
        if (!(mated instanceof Basket)) {
            return true;
        }
        var hit = mated.hit(matedShape, this.body.position);
        if (hit === 0) {
            return false;
        }
        this.toPassBasket = mated.id;
        this.toPassBasketSide = hit;
        return false;
    };
    Ball.prototype.createEffect = function () {
        var effect = new egret.Shape();
        effect.graphics.beginFill(0xffffff, 0.5);
        effect.graphics.drawRect(0, 0, 8, 8);
        effect.graphics.endFill();
        var texture = new egret.RenderTexture();
        texture.drawToTexture(effect);
        var system = new particle.GravityParticleSystem(texture, {});
        this.display.parent.addChild(system);
        system.emissionTime = 3000;
        system.emissionRate = 200;
        system.start();
        system.y = this.display.y;
        system.x = this.display.x;
        system.emitterX = 0;
        system.emitterY = 0;
        system.scaleX = system.scaleY = 1.5;
    };
    return Ball;
}(PhysicsObject));
__reflect(Ball.prototype, "Ball");
//# sourceMappingURL=Ball.js.map