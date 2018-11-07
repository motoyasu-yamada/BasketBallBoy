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
var BASKET_SIZE_METER = 0.15;
var BALL_SIZE_METER = 0.6;
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        var ballPixel = egret.MainContext.instance.stage.stageWidth / 10;
        GameWorld.init(ballPixel / BALL_SIZE_METER, this.stage);
        new Sky();
        new Ground();
        var timeGauge = new TimaeGauge();
        timeGauge.reset();
        var ball = new Ball();
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) { return ball.up(); }, this);
        var lastBasketCreation = 2000;
        GameWorld.start(function (dt) {
            lastBasketCreation += dt;
            var gn = Math.random();
            if (2000 < lastBasketCreation && gn < 0.05) {
                new Basket();
                lastBasketCreation = 0;
            }
        });
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
function random(min, max) {
    return min + Math.random() * (max - min);
}
var GameWorld = (function () {
    function GameWorld() {
    }
    GameWorld.pixelToMeter = function (pixel) {
        return pixel / this.pixelPerMeter;
    };
    GameWorld.meterToPixel = function (meter) {
        return meter * this.pixelPerMeter;
    };
    GameWorld.xMeterToPixel = function (meter) {
        return this.meterToPixel(meter);
    };
    GameWorld.yMeterToPixel = function (meter) {
        return this.stageHeight - this.meterToPixel(meter);
    };
    GameWorld.init = function (pixelPerMeter, displayObjectContainer) {
        this.pixelPerMeter = pixelPerMeter;
        this.meterPerPixel = 1 / pixelPerMeter;
        this.stageHeight = egret.MainContext.instance.stage.stageHeight;
        this.stageWidth = egret.MainContext.instance.stage.stageWidth;
        this.stageHeightMeter = this.pixelToMeter(this.stageHeight);
        this.stageWidthMeter = this.pixelToMeter(this.stageWidth);
        this.displayObjectContainer = displayObjectContainer;
        var world = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;
        world.gravity = [0, -9.8];
        this.world = world;
    };
    GameWorld.start = function (globalProcess) {
        var _this = this;
        var loop = function (deltaTime) {
            if (deltaTime < 10) {
                return;
            }
            if (deltaTime > 1000) {
                return;
            }
            _this.world.step(1 / 60, deltaTime / 1000, 10);
            var l = _this.objects.length;
            for (var i = 0; i < l; i++) {
                var o = _this.objects[i];
                if (!o.inited && !o.toDelete) {
                    o.init();
                }
            }
            var someoneIsDeleted = false;
            for (var i = 0; i < l; i++) {
                var o = _this.objects[i];
                if (o.inited && !o.toDelete) {
                    o.process(deltaTime);
                }
            }
            if (globalProcess) {
                globalProcess(deltaTime);
            }
            for (var i = 0; i < l; i++) {
                var o = _this.objects[i];
                if (o.toDelete) {
                    someoneIsDeleted = true;
                    continue;
                }
                if (o.inited) {
                    o.update();
                }
            }
            if (!someoneIsDeleted) {
                return;
            }
            _this.objects = _this.objects.filter(function (i) {
                if (!i.toDelete) {
                    return true;
                }
                i.delete();
                return false;
            });
        };
        egret.Ticker.getInstance().register(loop, this.displayObjectContainer);
    };
    GameWorld.objects = [];
    return GameWorld;
}());
__reflect(GameWorld.prototype, "GameWorld");
var GameObject = (function () {
    function GameObject() {
        this.toDelete = false;
        this.inited = false;
        GameWorld.objects.push(this);
    }
    GameObject.prototype.init = function () {
        this.resetDisplay();
        this.inited = true;
    };
    GameObject.prototype.resetDisplay = function () {
        if (this.display) {
            GameWorld.displayObjectContainer.removeChild(this.display);
            this.display = null;
        }
        this.display = this.createDisplay();
        GameWorld.displayObjectContainer.addChild(this.display);
    };
    GameObject.prototype.update = function () { };
    GameObject.prototype.markToDelete = function () {
        this.toDelete = true;
    };
    GameObject.prototype.delete = function () {
        GameWorld.displayObjectContainer.removeChild(this.display);
    };
    return GameObject;
}());
__reflect(GameObject.prototype, "GameObject");
var PhysicsObject = (function (_super) {
    __extends(PhysicsObject, _super);
    function PhysicsObject() {
        return _super.call(this) || this;
    }
    PhysicsObject.prototype.init = function () {
        _super.prototype.init.call(this);
        this.body = new p2.Body(this.options());
        this.addShapeToBody();
        this.body.displays = [this.display];
        GameWorld.world.addBody(this.body);
    };
    PhysicsObject.prototype.addShapeToBody = function () {
        var shape = this.createShape();
        this.body.addShape(shape);
    };
    PhysicsObject.prototype.createShape = function () {
        throw new Error("createShape or addShapeToBody must be implemented");
    };
    PhysicsObject.prototype.update = function () {
        var body = this.body;
        var display = this.display;
        if (!display) {
            return;
        }
        display.x = GameWorld.xMeterToPixel(body.position[0]);
        display.y = GameWorld.yMeterToPixel(body.position[1]);
        display.rotation = 360 - (body.angle + body.shapes[0].angle) * 180 / Math.PI;
    };
    PhysicsObject.prototype.delete = function () {
        _super.prototype.delete.call(this);
        GameWorld.world.removeBody(this.body);
        this.body.displays = [];
        this.body = null;
    };
    return PhysicsObject;
}(GameObject));
__reflect(PhysicsObject.prototype, "PhysicsObject");
var TimaeGauge = (function (_super) {
    __extends(TimaeGauge, _super);
    function TimaeGauge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.restTimeMiliseconds = 0;
        _this.courseOut = false;
        return _this;
    }
    TimaeGauge.prototype.reset = function () {
        this.restTimeMiliseconds = 60 * 1000;
        this.courseOut = false;
    };
    TimaeGauge.prototype.createDisplay = function () {
        var sprite = new egret.Sprite();
        var g = sprite.graphics;
        g.clear();
        if (this.isTimeOver()) {
            return;
        }
        g.lineStyle(0);
        g.beginFill(0x0000ff, 0.8);
        g.drawRect(0, 0, GameWorld.stageWidth * this.restTimeMiliseconds / 60 / 1000, 30);
        g.endFill();
        g.lineStyle(2, 0xffffff, 0.8);
        g.beginFill(0x8080ff, 0);
        g.drawRect(0, 0, GameWorld.stageWidth, 30);
        g.endFill();
        return sprite;
    };
    TimaeGauge.prototype.isTimeOver = function () {
        return this.restTimeMiliseconds <= 0;
    };
    TimaeGauge.prototype.reduceByCourseOut = function () {
        this.courseOut = true;
    };
    TimaeGauge.prototype.process = function (deltaMilliseconds) {
        if (this.courseOut) {
            this.restTimeMiliseconds -= deltaMilliseconds * 3;
            this.courseOut = false;
        }
        else {
            this.restTimeMiliseconds -= deltaMilliseconds;
        }
        this.resetDisplay();
    };
    return TimaeGauge;
}(GameObject));
__reflect(TimaeGauge.prototype, "TimaeGauge");
var Sky = (function (_super) {
    __extends(Sky, _super);
    function Sky() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sky.prototype.createDisplay = function () {
        var sprite = new egret.Sprite();
        var g = sprite.graphics;
        g.clear();
        g.beginFill(0x8080ff, 1);
        g.drawRect(0, 0, GameWorld.stageWidth, GameWorld.stageHeight);
        g.endFill();
        g.beginFill(0xc0c0ff);
        g.drawCircle(0, 0, GameWorld.stageWidth);
        g.endFill();
        return sprite;
    };
    Sky.prototype.process = function () { };
    return Sky;
}(GameObject));
__reflect(Sky.prototype, "Sky");
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        var _this = _super.call(this) || this;
        _this.toUp = 0;
        _this.bx = GameWorld.stageWidthMeter / 4;
        return _this;
    }
    Ball.prototype.options = function () {
        return { mass: 1, force: [0, -300], position: [this.bx, GameWorld.stageHeightMeter / 2] };
    };
    Ball.prototype.up = function () {
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
    return Ball;
}(PhysicsObject));
__reflect(Ball.prototype, "Ball");
var Ground = (function (_super) {
    __extends(Ground, _super);
    function Ground() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ground.prototype.options = function () {
        return { position: [0, 1], type: p2.Body.STATIC };
    };
    Ground.prototype.createShape = function () {
        return new p2.Plane({ angle: Math.PI });
    };
    Ground.prototype.createDisplay = function () {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x400000);
        shape.graphics.drawRect(0, 0, GameWorld.stageWidth, GameWorld.meterToPixel(1));
        shape.graphics.endFill();
        return shape;
    };
    Ground.prototype.process = function () {
    };
    return Ground;
}(PhysicsObject));
__reflect(Ground.prototype, "Ground");
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
        return { gravityScale: 0, mass: 40, position: [10, random(2, 7)], velocity: [this.velocityX, 0] };
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
        this.body.addShape(left, [-this.halfLengthMeter, 0]);
        this.body.addShape(right, [+this.halfLengthMeter, 0]);
    };
    Basket.prototype.process = function () {
        if (this.body && this.body.position[0] < -1) {
            this.markToDelete();
        }
    };
    return Basket;
}(PhysicsObject));
__reflect(Basket.prototype, "Basket");
//# sourceMappingURL=Main.js.map