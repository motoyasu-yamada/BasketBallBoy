var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameWorld = (function () {
    function GameWorld() {
    }
    GameWorld.getGameObject = function (name) {
        var o = this.namedObjects[name];
        if (o) {
            return o;
        }
        throw new Error("GameObject'" + name + "' is not found");
    };
    GameWorld.addGameObject = function (o) {
        this.objects.push(o);
        var name = o.name;
        if (!name) {
            return;
        }
        if (this.namedObjects[name]) {
            throw new Error("GameObject'" + name + "' already exists");
        }
        this.namedObjects[name] = o;
    };
    GameWorld.addPhysicsObject = function (o) {
        this.world.addBody(o.body);
        this.physicsObjects[o.id] = o;
    };
    GameWorld.destroy = function () {
        var _this = this;
        setTimeout(function () {
            console.log("GameWorld#destroy -> setInterval");
            _this.objects.forEach(function (i) { return i.delete(); });
            _this.objects = [];
            _this.physicsObjects = {};
            _this.namedObjects = {};
            _this.world.clear();
        }, 1);
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
    GameWorld.emit = function (eventName, e) {
        if (this.callback !== null) {
            this.callback(e);
        }
    };
    GameWorld.on = function (eventName, callback) {
        this.callback = callback;
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
        this.loop = function (e) {
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
        this.displayObjectContainer.addEventListener(egret.Event.ENTER_FRAME, this.loop, this);
    };
    GameWorld.pause = function () {
        this.displayObjectContainer.removeEventListener(egret.Event.ENTER_FRAME, this.loop, this);
    };
    GameWorld.objects = [];
    GameWorld.namedObjects = {};
    GameWorld.physicsObjects = {};
    return GameWorld;
}());
__reflect(GameWorld.prototype, "GameWorld");
//# sourceMappingURL=GameWorld.js.map