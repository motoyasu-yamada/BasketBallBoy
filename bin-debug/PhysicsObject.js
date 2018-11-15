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
var PhysicsObject = (function (_super) {
    __extends(PhysicsObject, _super);
    function PhysicsObject(name) {
        if (name === void 0) { name = null; }
        return _super.call(this, name) || this;
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
        display.x = this.egretX;
        display.y = this.egretY;
        display.rotation = this.egretAngel;
    };
    Object.defineProperty(PhysicsObject.prototype, "meterX", {
        get: function () {
            return this.body.position[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsObject.prototype, "meterY", {
        get: function () {
            return this.body.position[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsObject.prototype, "egretX", {
        get: function () {
            return GameWorld.xMeterToPixel(this.meterX);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsObject.prototype, "egretY", {
        get: function () {
            return GameWorld.yMeterToPixel(this.meterY);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsObject.prototype, "egretAngel", {
        get: function () {
            return (this.body.angle + this.body.shapes[0].angle) * 180 / Math.PI;
        },
        enumerable: true,
        configurable: true
    });
    PhysicsObject.prototype.delete = function () {
        _super.prototype.delete.call(this);
        if (this.body) {
            GameWorld.world.removeBody(this.body);
            this.body.displays = [];
            this.body = null;
        }
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
//# sourceMappingURL=PhysicsObject.js.map