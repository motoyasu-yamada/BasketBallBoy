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
//# sourceMappingURL=BasketManager.js.map