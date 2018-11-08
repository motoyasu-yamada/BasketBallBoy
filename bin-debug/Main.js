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
var FPS = 60;
var ground;
var timeGauge;
var ball;
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
        ground = new Ground();
        timeGauge = new TimeGauge();
        timeGauge.reset();
        ball = new Ball();
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) { return ball.up(); }, this);
        var basketManager = new BasketManager();
        GameWorld.start();
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
    GameWorld.addGameObject = function (o) {
        this.objects.push(o);
    };
    GameWorld.addPhysicsObject = function (o) {
        this.world.addBody(o.body);
        this.physicsObjects[o.id] = o;
    };
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
    GameWorld.start = function () {
        var _this = this;
        this.world.on("impact", function (evt) {
            var a = _this.physicsObjects[evt.bodyA.id];
            var b = _this.physicsObjects[evt.bodyB.id];
            if (a.onImpact(b) === false) {
                return;
            }
            if (b.onImpact(a) === false) {
                return;
            }
        });
        this.world.on("beginContact", function (evt) {
            var a = _this.physicsObjects[evt.bodyA.id];
            var b = _this.physicsObjects[evt.bodyB.id];
            if (a.onBeginContact(b, evt.shapeA, evt.shapeB) === false) {
                return;
            }
            if (b.onBeginContact(a, evt.shapeB, evt.shapeA) === false) {
                return;
            }
        });
        this.world.on("endContact", function (evt) {
            var a = _this.physicsObjects[evt.bodyA.id];
            var b = _this.physicsObjects[evt.bodyB.id];
            if (a.onEndContact(b, evt.shapeA, evt.shapeB) === false) {
                return;
            }
            if (b.onEndContact(a, evt.shapeB, evt.shapeA) === false) {
                return;
            }
        });
        var loop = function (e) {
            var deltaTime = 1000 / FPS;
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
                    o.process();
                }
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
        this.displayObjectContainer.addEventListener(egret.Event.ENTER_FRAME, loop, this);
    };
    GameWorld.objects = [];
    GameWorld.physicsObjects = {};
    return GameWorld;
}());
__reflect(GameWorld.prototype, "GameWorld");
var GameObject = (function () {
    function GameObject() {
        this.toDelete = false;
        this.inited = false;
        GameWorld.addGameObject(this);
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
        if (this.display) {
            GameWorld.displayObjectContainer.addChild(this.display);
        }
    };
    GameObject.prototype.createDisplay = function () {
        return null;
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
    Object.defineProperty(PhysicsObject.prototype, "id", {
        get: function () {
            return this.body.id;
        },
        enumerable: true,
        configurable: true
    });
    PhysicsObject.prototype.init = function () {
        this.body = new p2.Body(this.options());
        this.addShapeToBody();
        this.body.displays = [this.display];
        GameWorld.addPhysicsObject(this);
        _super.prototype.init.call(this);
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
    PhysicsObject.prototype.onImpact = function (mated) {
        return true;
    };
    PhysicsObject.prototype.onEndContact = function (mated, myShape, matedShape) {
        return true;
    };
    PhysicsObject.prototype.onBeginContact = function (mated, myShape, matedShape) {
        return true;
    };
    return PhysicsObject;
}(GameObject));
__reflect(PhysicsObject.prototype, "PhysicsObject");
var TimeGauge = (function (_super) {
    __extends(TimeGauge, _super);
    function TimeGauge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.restTimeMiliseconds = 0;
        _this.courseOut = false;
        return _this;
    }
    TimeGauge.prototype.reset = function () {
        this.restTimeMiliseconds = 60 * 1000;
        this.courseOut = false;
    };
    TimeGauge.prototype.createDisplay = function () {
        var sprite = new egret.Sprite();
        var g = sprite.graphics;
        g.clear();
        if (!this.isTimeOver()) {
            g.lineStyle(0);
            g.beginFill(0x0000ff, 0.8);
            g.drawRect(0, 0, GameWorld.stageWidth * this.restTimeMiliseconds / 60 / 1000, 30);
            g.endFill();
        }
        g.lineStyle(2, 0xffffff, 0.8);
        g.beginFill(0x8080ff, 0);
        g.drawRect(0, 0, GameWorld.stageWidth, 30);
        g.endFill();
        return sprite;
    };
    TimeGauge.prototype.isTimeOver = function () {
        return this.restTimeMiliseconds <= 0;
    };
    TimeGauge.prototype.reduceByCourseOut = function () {
        this.courseOut = true;
    };
    TimeGauge.prototype.process = function () {
        if (this.courseOut) {
            this.restTimeMiliseconds -= 3000;
            this.courseOut = false;
        }
        else {
            this.restTimeMiliseconds -= 1000 / FPS;
        }
        this.resetDisplay();
    };
    return TimeGauge;
}(GameObject));
__reflect(TimeGauge.prototype, "TimeGauge");
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
        _this.toPassBasket = 0;
        _this.toPassBasketSide = 0;
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
    Ball.prototype.onImpact = function (mated) {
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
    return Ball;
}(PhysicsObject));
__reflect(Ball.prototype, "Ball");
var Ground = (function (_super) {
    __extends(Ground, _super);
    function Ground() {
        return _super !== null && _super.apply(this, arguments) || this;
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
        g.beginFill(0x400000);
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
var BasketManager = (function (_super) {
    __extends(BasketManager, _super);
    function BasketManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastBasketCreation = 2000;
        return _this;
    }
    BasketManager.prototype.process = function () {
        this.lastBasketCreation += 1000 / FPS;
        var gn = Math.random();
        if (2000 < this.lastBasketCreation && gn < 0.05) {
            new Basket();
            this.lastBasketCreation = 0;
        }
    };
    return BasketManager;
}(GameObject));
__reflect(BasketManager.prototype, "BasketManager");
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
        return { gravityScale: 0, mass: 40, position: [10, y], velocity: [this.velocityX, 0] };
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
//# sourceMappingURL=Main.js.map