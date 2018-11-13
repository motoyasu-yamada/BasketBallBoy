var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameObject = (function () {
    function GameObject(name) {
        if (name === void 0) { name = null; }
        this.toDelete = false;
        this.inited = false;
        if (name) {
            this._name = name;
        }
        GameWorld.addGameObject(this);
    }
    Object.defineProperty(GameObject.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
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
        if (this.display) {
            GameWorld.displayObjectContainer.removeChild(this.display);
        }
        this.display = null;
    };
    return GameObject;
}());
__reflect(GameObject.prototype, "GameObject");
//# sourceMappingURL=GameObject.js.map